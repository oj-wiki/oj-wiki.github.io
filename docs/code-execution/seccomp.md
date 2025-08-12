# 安全计算（seccomp）

## 概述

**Seccomp（Secure Computing Mode** 是 Linux 内核的一项安全特性，它允许进程在运行时限制自己可以执行的系统调用（`syscall`），以减少攻击面。

在沙箱实现中， `seccomp` 通常使用白名单限制程序使用安全的系统调用（`syscall`），或者与 `ptrace` 结合，深度判断系统调用参数的安全性。

通常在子进程运行用户进程前，使用 [seccomp](https://man7.org/linux/man-pages/man2/seccomp.2.html) 系统调用实现。[syscalls](https://man7.org/linux/man-pages/man2/syscalls.2.html)。[seccomp profile of docker](https://github.com/moby/moby/blob/master/profiles/seccomp/default.json)。[bootlin](https://bootlin.com) 。[The linux documentation project](https://tldp.org/guides.html)

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

| 动作                         | 含义                    |
| -------------------------- | --------------------- |
| `SECCOMP_RET_ALLOW`        | 允许 syscall            |
| `SECCOMP_RET_KILL_PROCESS` | 杀死进程（默认）              |
| `SECCOMP_RET_ERRNO`        | 拒绝 syscall，返回指定 errno |
| `SECCOMP_RET_TRAP`         | 发送 `SIGSYS`，供信号处理器处理  |
| `SECCOMP_RET_TRACE`        | 供调试器跟踪                |
| `SECCOMP_RET_LOG`          | 记录日志但允许执行             |
| `SECCOMP_RET_USER_NOTIF`   | 通知用户空间进程（v5.0+）       |

使用 `SECCOMP_RET_TRACE` 时，需要在 `seccomp` 系统调用前 attch 调试器，通常需要子进程给自身发送暂停信号。由调试器捕获之后再继续。
