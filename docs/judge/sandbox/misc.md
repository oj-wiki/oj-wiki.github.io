# 跨平台沙箱与实现

OJ 沙箱通常执行攻击者可控的程序，选择方案时应看安全边界、资源统计精度、启动成本、内核/系统版本要求和运维复杂度。不同操作系统提供的进程沙箱并不具备相同的隔离语义；不要只因能启动程序就认为具备等价的文件、网络、系统调用和资源限制。

## Linux

当前主流的执行基础仍是 Linux 原生隔离组合：user/mount/PID/network namespaces、cgroup v2、rlimit、seccomp-BPF，以及按需使用 AppArmor/SELinux 或 Landlock。namespace 主要建立视图边界，cgroup 管理进程树资源，seccomp 缩减系统调用面，Landlock 可由非特权进程叠加文件系统等访问规则；它们不能相互替代。尤其容器共享宿主机内核，不能仅依靠容器镜像或 Docker 默认配置承载高风险、多租户代码。

常见实现路线：

| 实现 | 适用点 | 需要核对 |
| --- | --- | --- |
| [Isolate](https://github.com/ioi/isolate) | OI/竞赛评测的轻量沙箱；使用 namespaces、cgroups，并提供 CPU/墙钟时间、内存和文件系统工作区管理 | 通常需要特权安装/keeper 配置；检查 cgroup v1/v2、systemd delegation、发行版和架构支持 |
| [nsjail](https://github.com/google/nsjail) | 可组合 namespaces、rlimits、cgroups 和 seccomp-BPF 的通用 Linux 沙箱 | syscall 策略与挂载配置需按语言运行时维护；验证宿主机内核能力及权限配置 |
| [Judge0](https://github.com/judge0/judge0) | 提供代码执行 API 与多语言执行环境，使用 Isolate 等组件 | 是完整执行服务，不是独立内核隔离原语；部署时仍需审查服务暴露面、任务清理和资源上限 |
| [gVisor/runsc](https://github.com/google/gvisor) | OCI 工作流下用用户态应用内核减少应用直接触达宿主机内核的机会 | Linux 宿主机和受支持的工作负载；需验证 syscall 兼容性、性能和设备支持 |
| [Firecracker](https://github.com/firecracker-microvm/firecracker) | 通过轻量 KVM microVM 提供独立 guest kernel，适合更强租户隔离 | 需要 KVM/硬件虚拟化及 VM 镜像、启动和快照运维；启动开销高于进程沙箱 |

Linux 内核近年值得关注的补充是 [Landlock](https://docs.kernel.org/userspace-api/landlock.html)：它是可叠加的 LSM 访问控制接口，适合补充限制文件系统访问；其可用规则和行为依赖内核 ABI 版本，不能单独替代 namespaces、seccomp 或 cgroup。cgroup v2 的 CPU、内存、进程数限制和统计应优先于仅依赖单进程 `rlimit` 的方案；参考 [cgroup v2 文档](https://docs.kernel.org/admin-guide/cgroup-v2.html)。

## macOS

Apple 的 Seatbelt 沙箱策略仍可见于系统组件，但 `sandbox-exec` 和 `sandbox_init` 已弃用，不适合作为新 OJ 的稳定、受支持通用沙箱 API。若短期在 macOS 上执行不可信代码，应采用单独账户/机器并严密限制文件与网络权限，同时确认系统更新后策略仍有效；不要把旧版 `sandbox_init` 教程当作长期方案。

需要强隔离时，可在 macOS 主机上通过 [Virtualization.framework](https://developer.apple.com/documentation/virtualization) 运行 Linux guest，再在 guest 内使用 Linux 评测沙箱。该框架支持 Apple silicon 和 Intel Mac 上的虚拟机；guest 镜像、虚拟网络、共享目录与快照恢复仍需由评测服务正确管理。若比赛要求 Linux 运行时、计时及编译器一致性，Linux guest 通常比原生 macOS 执行更容易复现。

## Windows

Windows 可组合低权限令牌、[Job Objects](https://learn.microsoft.com/windows/win32/procthread/job-objects) 和进程缓解策略来限制进程树、内存/CPU、子进程及部分攻击面。Job Objects 主要负责管理和资源记账，本身不是完整安全沙箱。

[AppContainer](https://learn.microsoft.com/windows/win32/secauthz/appcontainer-isolation) 以能力授权方式限制文件、注册表、IPC 和网络等访问，适用于可适配该模型的进程；[Windows Sandbox](https://learn.microsoft.com/windows/security/application-security/application-isolation/windows-sandbox/) 与 Hyper-V 隔离适合丢弃式桌面/虚拟化环境，但启动、镜像管理和评测计量不一定适合高频 OJ 任务。生产评测应验证进程树逃逸、网络隔离、目录授权、超时终止和 CPU/内存统计；仅用 Sandboxie、低完整性级别或 Job Objects 不足以宣称安全执行任意恶意代码。

Windows 也可把 Linux 评测机放在独立 Linux 主机或受控虚拟机/WSL2 中，以匹配 GNU/Linux 竞赛环境；WSL2 的虚拟网络、宿主机文件共享和来宾管理仍须单独设置。不要将 Windows 容器与 Linux 容器的内核和 syscall 隔离语义混为一谈。

## BSD 与其他方案

- [FreeBSD Capsicum](https://docs.freebsd.org/en/articles/capsicum/)：能力模式与 capability-based sandboxing，适合主动采用能力模型的 FreeBSD 程序；不是跨平台 OJ 沙箱的直接替代品。
- OpenBSD 的 pledge/unveil 可缩减系统调用和文件访问面，但需面向 OpenBSD 的程序/策略；参见 [pledge(2)](https://man.openbsd.org/pledge) 与 [unveil(2)](https://man.openbsd.org/unveil)。
- [Sandboxie Plus](https://github.com/sandboxie-plus/Sandboxie)：Windows 应用隔离项目，可作研究和桌面兼容性工具；部署前须核对当前支持版本与威胁模型。

## OJ 与竞赛相关项目

- [DOMjudge](https://github.com/DOMjudge/domjudge)：赛事平台及评测机工作流，适合 ICPC 风格比赛。
- [CMS](https://github.com/cms-dev/cms)：分布式竞赛管理与评测，常用于 IOI/OI 风格赛事。
- [go-judge](https://github.com/criyle/go-judge)：面向 OJ 的 Linux 沙箱执行服务，提供 API 和可复用执行环境；详见 [本 Wiki 介绍](go-judge.md)。
- [simple-sandbox](https://github.com/lyrio-dev/simple-sandbox)：Lyrio 生态的 Linux 沙箱实现。
- [Firecracker Containerd](https://github.com/firecracker-microvm/firecracker-containerd)：将容器工作流放在 Firecracker microVM 中运行。
- [NOI Linux 2.0](https://www.noi.cn/gynoi/jsgz/2021-07-16/732450.shtml)：竞赛环境发行版；环境镜像与恶意代码隔离是不同问题。
- [icpc-live-v3](https://github.com/icpctools/icpctools)：ICPC 现场赛工具套件，不是通用代码执行沙箱。

选择具体实现前，应查看官方仓库的近期发布、支持矩阵与安全公告，并在目标内核/系统上验证限制和资源计量。以上项目状态会变化，本页作为技术路线索引，不代替部署版本对应的官方文档。
