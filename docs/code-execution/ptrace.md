# 进程调试（ptrace）

## 概述

`ptrace`（**process trace**）是 Linux/Unix 系统中的一个系统调用，用于让一个进程（**追踪者**，通常是调试器）控制另一个进程（**被追踪者**），从而实现：

- 检查或修改被调试进程的寄存器与内存
- 拦截和修改系统调用
- 追踪信号的发送与接收
- 控制被调试进程的执行（单步、继续、暂停）

最常见的 `ptrace` 应用是 **gdb、strace** 等调试和跟踪工具。

在沙箱实现中，通常由沙箱守护进程作为追踪者，用户进程作为被追踪者。同时，通常与 `seccomp` 结合使用避免使用安全系统调用时过多的上下文切换。

由于 ptrace 实现需要在 syscall 前后进行多次上下文切换，因此开销过大。在新实现中通常不被采用。

## `ptrace` 的工作原理

### 附加模式

- 调试器通过 `PTRACE_ATTACH` 或在 `fork()` 后调用 `PTRACE_TRACEME` 建立跟踪关系。
- 被追踪进程会收到 `SIGSTOP` 信号进入暂停状态，等待调试器指令。

### 进程控制循环

1. 调试器调用 `ptrace()` 请求操作。
2. 内核执行操作（读寄存器、写内存、单步等）。
3. 调试器调用 `waitpid()` 等待被追踪进程状态变化。
4. 重复以上步骤直到调试结束。

## 常用操作（`request`）

| `request`                             | 功能                             |
| ------------------------------------- | ------------------------------ |
| `PTRACE_TRACEME`                      | 让当前进程被其父进程追踪（调试器使用）            |
| `PTRACE_ATTACH`                       | 附加到已有进程                        |
| `PTRACE_DETACH`                       | 分离被追踪进程                        |
| `PTRACE_PEEKDATA` / `PTRACE_PEEKTEXT` | 从目标进程内存读取数据                    |
| `PTRACE_POKEDATA` / `PTRACE_POKETEXT` | 向目标进程内存写入数据                    |
| `PTRACE_GETREGS` / `PTRACE_SETREGS`   | 获取/设置寄存器值                      |
| `PTRACE_CONT`                         | 继续运行被追踪进程                      |
| `PTRACE_SINGLESTEP`                   | 单步执行                           |
| `PTRACE_SYSCALL`                      | 在系统调用进入/退出时暂停                  |
| `PTRACE_SEIZE`                        | 附加进程但不发送 `SIGSTOP`（非阻塞 attach） |
| `PTRACE_INTERRUPT`                    | 暂停目标进程（配合 `SEIZE` 使用）          |

使用 `seccomp` 时，使用 `PTRACE_CONT` 和 `waitpid` 等待下一次通知。不使用时，通常使用 `PTRACE_SYSCALL` 监控所有系统调用

读取内存时，可以使用 [`process_vm_readv`](https://man7.org/linux/man-pages/man2/process_vm_readv.2.html) 而不是 `PTRACE_PEEKDATA` / `PTRACE_PEEKTEXT` 来加速访问长字符串。
