# 资源限制（rlimit）

## 概述

**rlimit** 是 Linux（以及类 Unix 系统）提供的一种**进程级资源限制机制**，用于控制单个进程在运行时可以使用的各种系统资源的上限。

rlimit 是\*\*软限制（soft limit）**和**硬限制（hard limit）\*\*的组合：

- **软限制**：当前实际生效的资源限制，进程可以在不需要特权的情况下降低该值。
- **硬限制**：软限制的上限，只能由特权用户（root）或具有 `CAP_SYS_RESOURCE` 能力的进程提高。

在沙箱实现中，通常使用 [`getrlimit / prlimit`](https://man7.org/linux/man-pages/man2/getrlimit.2.html) 系统调用，与 `cgroup` 一起限制资源使用。通常改动硬限制避免修改。

常用限制包括：

- `RLIMIT_CPU`：限制最大 CPU 使用量。超出通常表现为 `TIME_LIMIT_EXCEEDED`
- `RLIMIT_FSIZE`：限制最大文件写入量。超出通常表现为 `OUTPUT_LIMIT_EXCEEDED`
- `RLIMIT_STACK`：限制最大栈使用量，可以用于开启无限栈
- `RLIMIT_AS`：限制内存申请，在 OI 比赛中常见限制，例如 lemon
- `RLIMIT_NOFILE`：限制最大打开文件数量
- `RLIMIT_CORE`：通常关闭 coredump 避免报错创建文件

注意，`rlimit` 的限制仅对单个进程生效，在多进程运行情况下需要和 `cgroup` 配合使用。

## 资源类型

不同的 `RLIMIT_*` 常量表示不同的限制目标：

| 资源常量                | 含义                                |
| ------------------- | --------------------------------- |
| `RLIMIT_CPU`        | 进程可用 CPU 时间（秒），超出会收到 `SIGXCPU` 信号 |
| `RLIMIT_FSIZE`      | 进程可创建的文件最大字节数，超出会收到 `SIGXFSZ` 信号  |
| `RLIMIT_DATA`       | 数据段最大字节数（堆区）                      |
| `RLIMIT_STACK`      | 栈最大字节数                            |
| `RLIMIT_CORE`       | core dump 文件的最大字节数                |
| `RLIMIT_RSS`        | 常驻集大小（已废弃，现代内核无效）                 |
| `RLIMIT_NOFILE`     | 最大文件描述符数（open files）              |
| `RLIMIT_AS`         | 进程可用的虚拟地址空间（bytes）                |
| `RLIMIT_NPROC`      | 该用户可拥有的最大进程数                      |
| `RLIMIT_MEMLOCK`    | 进程可通过 `mlock` 锁定到 RAM 的最大字节数      |
| `RLIMIT_LOCKS`      | 最大文件锁数量                           |
| `RLIMIT_SIGPENDING` | 该用户可挂起的信号数量                       |
| `RLIMIT_MSGQUEUE`   | POSIX 消息队列总字节数上限                  |
| `RLIMIT_NICE`       | 进程可设置的最大 nice 值（优先级）              |
| `RLIMIT_RTPRIO`     | 最大实时优先级                           |
| `RLIMIT_RTTIME`     | 在实时调度中允许的最大 CPU 时间（纳秒）            |
