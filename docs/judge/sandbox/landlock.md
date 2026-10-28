# Landlock

[Landlock](https://docs.kernel.org/userspace-api/landlock.html) 是 Linux 的可叠加 LSM 访问控制机制，允许普通进程进一步限制自身及后代进程的环境权限。它适合作为评测沙箱的补充层，尤其是按文件/目录层级限制访问；它不负责创建文件系统视图、限制 CPU/内存或过滤通用 syscall，不能单独替代 mount namespace、cgroup 或 seccomp。

## 内核版本支持

Landlock 首次进入主线 Linux 内核是在 **Linux 5.13**。内核需启用 `CONFIG_SECURITY_LANDLOCK=y`，并且运行时未禁用该 LSM；仅检查内核版本号不足以确认功能可用。Landlock 的功能按 ABI 版本递增：例如 ABI v4（Linux 6.7）加入 TCP 端口规则，ABI v10（Linux 7.2）加入 UDP 端口规则。发行版可能回移补丁，因此启动时应调用 `landlock_create_ruleset(..., LANDLOCK_CREATE_RULESET_VERSION)` 查询实际 ABI，再只使用已支持的规则；如果评测策略依赖的限制不可用，应拒绝启动或切换到其他已验证的隔离方案。

## 在评测中的用途

- **限制工作区写入范围**：只允许写入提交工作目录和临时目录，拒绝修改系统目录、题目数据、checker、编译器及评测服务文件。
- **限制文件读取与执行**：只为运行阶段授予需要的程序、动态库和资源文件读取/执行权限；编译器和运行时依赖可以只读挂载，再按阶段建立不同规则。
- **细化文件操作权限**：分别控制读文件、列目录、写入、创建、删除、重命名/跨目录引用、截断等操作，减少仅靠 `chroot` 或宽松挂载配置造成的意外访问。
- **补充网络规则**：Landlock ABI v4 起可按 TCP 端口限制 bind/connect，ABI v10 起也支持 UDP 端口规则。普通 OJ 通常应在 network namespace 层完全禁网；Landlock 端口规则可作为额外限制，不能涵盖所有网络/socket 操作。
- **下放策略执行**：Landlock 可由无特权进程自行追加限制，适用于沙箱启动器先完成可信初始化，再在执行提交程序前施加最小权限策略的设计。

## 典型启动顺序

1. 创建并准备任务工作区、工具链只读目录和临时目录；建立 namespace、cgroup 等外层隔离。
2. 在可信启动器中查询内核支持的 Landlock ABI 版本，并只配置该 ABI 实际支持的访问权。Landlock 通过 `landlock_create_ruleset`、`landlock_add_rule` 和 `landlock_restrict_self` 建立并应用策略。
3. 在执行不可信代码前应用策略，再调用 `execve`/`execveat`。子进程和线程会继承其父任务的 Landlock 域，后续层只能继续增加限制。
4. 关闭不打算传给提交程序的文件描述符。Landlock 规则不会追溯限制进入沙箱前已打开的文件；已有 fd、管道、socket、执行 fd 等必须按能力边界审计。
5. 通过正反用例验证所用内核 ABI、语言运行时和编译阶段确实满足预期的读、写、执行和网络访问边界。

## 设计限制与注意事项

- Landlock 只限制 ruleset 明确声明要处理的访问权。应用需查询 ABI 版本并构造兼容策略；若某项必须的限制不受当前内核支持，应拒绝启动该沙箱或选择其他隔离路径，不能把未支持的权限位静默当作已限制。
- 规则按文件层级匹配，通常是允许列出的路径、拒绝其他受管访问的模型；它不隐藏文件系统路径，也不是独立的 chroot。工具链、动态链接器、证书/时区数据等运行依赖必须明确授权。
- 在施加策略前打开的文件/目录不受新规则追溯限制。要避免把指向敏感数据的预打开 fd 传给不可信程序；标准输入输出及错误管道只应传递预期句柄。
- Landlock 不能限制所有文件相关操作，也不能替代 DAC、其他 LSM 或 mount namespace。特殊文件系统、socket、`/proc` 访问、挂载和命名空间操作等仍需结合权限、namespace 和 seccomp 处理。
- Landlock 域是逐线程继承的；对已有多线程进程，只在一个线程调用 `landlock_restrict_self` 不会自动限制其他兄弟线程。评测启动器应在单线程子进程应用规则，或采用明确的线程同步方案。
- 规则集可叠加，但有层数上限；嵌套启动器应尽量集中构建规则，避免每一层无谓地增加 Landlock 域。

Landlock 最适合补上“进程只能读哪些路径、能在哪些目录写、允许哪些文件操作”的细粒度边界。高风险评测仍应组合最小化 rootfs、关闭网络、非特权身份、seccomp 和 cgroup，并在目标内核上验证最终策略。

参考：[Landlock 用户空间 API 文档](https://docs.kernel.org/userspace-api/landlock.html)、[Landlock 内核设计文档](https://docs.kernel.org/security/landlock.html)。
