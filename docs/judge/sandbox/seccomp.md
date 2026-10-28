# 安全计算（seccomp）

## 概述

**Seccomp（Secure Computing Mode）** 是 Linux 内核的一项安全特性，它允许进程在运行时限制自己可以执行的系统调用（`syscall`），以减少攻击面。

在沙箱实现中， `seccomp` 通常使用白名单限制程序使用安全的系统调用（`syscall`），或者与 `ptrace` 结合，深度判断系统调用参数的安全性。

通常在子进程运行用户进程前，使用 [seccomp](https://man7.org/linux/man-pages/man2/seccomp.2.html) 系统调用实现。[syscalls](https://man7.org/linux/man-pages/man2/syscalls.2.html)。[seccomp profile of docker](https://github.com/moby/moby/blob/master/profiles/seccomp/default.json)。[bootlin](https://bootlin.com) 。[The linux documentation project](https://tldp.org/guides.html)

部署过滤器时应设置 `no_new_privs`（或由具备权限的沙箱管理器安装过滤器），并审查所有允许的 syscall。过滤策略需要按目标架构和 ABI 测试，避免只按 syscall 名称生成规则而漏掉兼容 ABI。新内核接口（例如 `io_uring`）可能绕过按传统 syscall 逐项建模的假设；不需要时应显式拒绝，并在内核升级时重新审查策略。

## 过滤器继承与线程同步

seccomp filter 是逐线程生效的。通过允许的 `fork()`、`clone()` 或 `clone3()` 创建的子任务会继承创建者已有的过滤器；允许的 `execve()` 不会清除已有过滤器。因此，通常在目标程序执行前安装策略，就能让程序后续创建的子进程和线程继续受约束，且策略会跨越 `exec` 保留。后续再安装的过滤器会叠加在已有过滤器上，只能进一步收紧权限，不能撤销已有限制。

若沙箱管理器在多线程进程中安装过滤器，默认只约束调用线程。可使用 `SECCOMP_FILTER_FLAG_TSYNC` 将过滤器同步到同一线程组的其他线程；安装失败时必须检查错误并确认没有线程留在未过滤状态。更简单的评测启动顺序通常是：在专用子进程中完成权限降级和初始化，安装 seccomp，再立即 `execve()` 提交程序。管理器必须在安装提交程序策略之前完成它自己所需的 `clone`/`clone3`、文件准备和监督器启动。

## seccomp 的工作模式

Linux 提供三种 seccomp 模式：

### **Strict 模式（原始模式）**

- 通过 `prctl(PR_SET_SECCOMP, SECCOMP_MODE_STRICT)` 启用。
- 只能保留四个系统调用：
  - `read`
  - `write`
  - `_exit`
  - `sigreturn`
- 其余调用全部被 `SIGKILL`。
- 适用于非常简单的程序。

### **Filter 模式（常用模式）(Linux 3.10+)**

- 通过 `prctl()` 或 `seccomp()` 系统调用启用。
- 使用 **Berkeley Packet Filter（BPF）程序** 定义允许或禁止哪些 syscall。
- 提供了更细粒度的控制，例如：
  - 允许 `open()` 但拒绝 `execve()`
  - 根据 `syscall` 参数决定是否放行
- 可以和 `ptrace` 结合使用，在需要判断复杂参数时暂停并检查参数

### **Notification 模式（通知模式，Linux 5.0+）**

- 内核不直接决定是否允许 syscall，而是将 syscall 通知用户空间守护进程（agent）进行策略决策。

## seccomp 的关键机制

### BPF（Berkeley Packet Filter）

- 用于编写 seccomp 过滤器逻辑（类似一个小程序）。
- 每个系统调用编号与其参数都可以在 BPF 中检查。
- 动作类型包括：

seccomp 的加载接口接收的是受限的 classic BPF（cBPF）过滤器，不是通过 `bpf()` 加载的通用 eBPF 程序。内核在某些架构上会把通过验证的 cBPF 转换为内部 eBPF 表示并解释或 JIT 执行，但此实现细节不会让 seccomp 过滤器获得 eBPF 的 maps、helpers、循环或其他程序类型能力；过滤器仍受 seccomp/cBPF 的输入和验证规则约束。参见 [Linux BPF 文档](https://docs.kernel.org/networking/filter.html)。

| 动作                         | 含义                    |
| -------------------------- | --------------------- |
| `SECCOMP_RET_ALLOW`        | 允许 syscall            |
| `SECCOMP_RET_KILL_PROCESS` | 杀死进程（默认）              |
| `SECCOMP_RET_ERRNO`        | 拒绝 syscall，返回指定 errno |
| `SECCOMP_RET_TRAP`         | 发送 `SIGSYS`，供信号处理器处理  |
| `SECCOMP_RET_TRACE`        | 供调试器跟踪                |
| `SECCOMP_RET_LOG`          | 记录日志但允许执行             |
| `SECCOMP_RET_USER_NOTIF`   | 通知用户空间进程（v5.0+）       |

使用 `SECCOMP_RET_TRACE` 时，需要在 `seccomp` 系统调用前 attach 调试器，通常需要子进程给自身发送暂停信号。由调试器捕获之后再继续。

[常用 syscall 参数参考](https://aquasecurity.github.io/tracee/dev/docs/events/)

## 架构与 x86 ABI 注意事项

过滤器应先检查 `seccomp_data.arch`，再按该架构解释 syscall 编号和参数；不能跨架构共用未经校验的 syscall 编号表。x86-64 与 x32 ABI 在 `arch` 字段中都报告 `AUDIT_ARCH_X86_64`，x32 通过 syscall 编号中的 `__X32_SYSCALL_BIT`（`0x40000000`）区分。策略应明确拒绝 x32，或完整支持并识别两套编号。若允许 i386 兼容 ABI，也要检查其 `AUDIT_ARCH_I386` 与不同 syscall 编号；不要只检查 syscall number 而忽略架构字段。Linux 5.4 之前的内核对 x32 syscall 编号范围还有历史兼容问题；若评测节点仍支持旧内核，应显式拒绝相关范围或据目标内核做专项验证。

在 x86-64 上还要考虑兼容 syscall 入口（例如 32 位 `int 0x80`）和 vDSO/vsyscall 行为。过滤器只在 syscall 进入内核时执行；通过 vDSO 在用户态完成的调用不会触发 seccomp，因此同一程序可能因机器/clocksource 不同而走不同路径。Linux 内核文档建议在 x86 上测试 vDSO 回退路径；安全策略不应把 seccomp 当作对用户态指令或所有时间读取方式的限制。

## 性能开销

seccomp-BPF 在每次经过内核的系统调用上执行。过滤器越长、叠加层数越多、决策路径越复杂，系统调用密集型程序承担的检查开销通常越大；多个过滤器会逐一运行，最终采用限制性最高的结果。简单过滤器对计算密集型程序的影响一般较小，但实际开销取决于内核、CPU、过滤器及 syscall 频率。`SECCOMP_RET_TRACE` 和 `SECCOMP_RET_USER_NOTIF` 还会引入调试器/用户态监督器往返，通常比纯内核内的 `ALLOW`/`ERRNO`/`KILL` 路径昂贵得多。

评测环境宜使用经过验证的紧凑策略，避免为不需要的 syscall 增加复杂参数分支；对常用语言的启动、输入输出和高 syscall 负载测试基准。性能比较需固定 CPU 架构、内核、运行时及过滤器，并报告中位数和尾延迟；不要把特定机器的单一开销数字当作通用常数。

参考：[seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)、[Linux seccomp filter 文档](https://docs.kernel.org/userspace-api/seccomp_filter.html)。
