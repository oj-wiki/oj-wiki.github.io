# 创建运行子进程（fork/clone + exec）

传统的 Unix 流程使用 `fork` 创建子进程，再由子进程调用 `exec` 替换自身映像。Linux 还提供 `clone` 和 `clone3`，允许调用者指定进程共享/隔离标志；沙箱可借此在创建时设置 namespace 或将子进程直接放入 cgroup。

## 创建过程

父进程调用 `fork`（或具有相应标志的 `clone`/`clone3`）。成功时，父进程得到子进程 PID，子进程得到 `0`，随后两边并发执行。子进程完成文件描述符、身份、资源限制和安全策略初始化后调用 `execve`；父进程监督任务并用 `wait` 系列系统调用回收状态。

## `clone3` 与 `CLONE_INTO_CGROUP`

Linux 5.3 引入 `clone3`，以 `struct clone_args` 传递创建参数；Linux 5.7 起支持 `CLONE_INTO_CGROUP`。该标志让内核在创建子进程时将其直接放入 `clone_args.cgroup` 指定的 cgroup。相比先创建进程、再写入 `cgroup.procs`，它避免子进程在迁移前短暂运行于父 cgroup 的窗口，也避免这段时间的资源消耗落在错误的组里。该功能要求 cgroup v2 及调用者对目标 cgroup 有足够权限；目标 cgroup 应先创建并配置好。

`clone3` 的基本调用形态如下。实际沙箱还需处理文件描述符、信号、namespace、权限降级和错误管道等；此片段只展示 cgroup 放置：

```c
#define _GNU_SOURCE
#include <linux/sched.h>
#include <signal.h>
#include <sys/syscall.h>
#include <unistd.h>

struct clone_args args = {
    .flags = CLONE_INTO_CGROUP,
    .exit_signal = SIGCHLD,
    .cgroup = (unsigned long)cgroup_fd,
};
long pid = syscall(SYS_clone3, &args, sizeof(args));
if (pid == 0) {
    execve(path, argv, envp);
    _exit(127); // exec 失败；不要在子进程中走父进程的清理路径
}
if (pid > 0) {
    // 父进程监督 pid，并 waitpid()/wait4() 回收
}
```

`clone3` 不是对所有环境都可用：旧内核可能返回 `ENOSYS`；不支持的 flag、参数或 `struct clone_args` 大小可能返回 `EINVAL`/`E2BIG`；seccomp、权限或 cgroup 配置也可能导致 `EPERM` 等错误。实现需区分“功能不可用”与真实配置/安全错误，并仅对可识别的兼容性错误回退；不能因任意失败就静默降级并误报资源限制仍有效。

回退到普通 `clone`/`fork` 后再迁移 cgroup 时，若要保持资源边界，子进程必须先阻塞在同步点，父进程将其加入目标 cgroup 并确认成功后再放行。否则即使窗口很短，也可能在迁移前消耗宿主资源。还需确保取消任务时完整终止进程树，并在退出后回收 wait 状态和 cgroup。

### 与 `vfork` / `CLONE_VFORK` 的组合

在满足 Linux 5.7+ 与 cgroup v2 前提时，可将 `clone3(CLONE_INTO_CGROUP)` 与 `vfork` 语义组合，以减少创建子进程时复制地址空间的开销。`vfork` 会让父进程暂停，直到子进程 `exec` 或退出；配合 `CLONE_VM` 时，子进程在 `exec` 前与父进程共享地址空间。因此子进程路径必须极短且受控：避免返回语言 runtime、分配内存、获取可能被其他线程持有的锁，成功时尽快 `exec`，失败时用 `_exit`。这不是通用的 `fork` 替代品，尤其需要专门处理多线程运行时和异步信号安全问题。

### Seccomp 与调用顺序

应区分沙箱管理器创建受限任务所用的 `clone3`，与提交程序自身尝试调用 `clone3`。管理器创建子进程时必须尚未安装会阻止该调用的过滤器；提交程序运行后，则要按策略限制其创建线程/进程的能力。seccomp-BPF 只能检查 syscall 编号和寄存器中的参数，不能解引用 `clone3` 指向用户空间的 `struct clone_args`，所以无法像检查传统 `clone` 标志那样可靠地按结构体字段筛选标志。若需限制 namespace 或进程创建，应考虑拒绝提交程序的 `clone3`，并检查 `clone`、`unshare`、`setns` 等相关入口是否也被一致限制。

### 实现时需要明确的策略

- 是否启用 `CLONE_INTO_CGROUP` 应由运行时能力与调用方策略共同决定，不要只依赖内核版本字符串。先创建并配置目标 cgroup，再打开并保留其目录 fd 供创建调用使用。
- 明确兼容模式：可在功能确实不支持时采用安全的备用路径；备用路径必须让子进程在父进程完成 cgroup 迁移前保持阻塞。若 cgroup fd 无效、权限不足或策略拒绝调用，应报告配置/安全错误，不能静默当作隔离成功。
- 创建后、`exec` 前仍可能执行设置映射、挂载、身份降权、rlimit 和 seccomp 等步骤。要用错误管道或等效协议把这些步骤的 errno 与失败阶段传回父进程，并确保错误分支以 `_exit` 结束。
- `CLONE_VFORK` 不适合所有初始化流程。若初始化需要父进程并行处理、用户命名空间的父子映射协调、ptrace 停顿或其他同步，应评估是否关闭 vfork 路径；无论采用哪种路径，都要保证进程树可被取消和回收。
- 沙箱管理器的创建 syscall 策略与提交程序的 syscall 策略不同。seccomp-BPF 不能解引用 `clone3` 指向用户空间的 `struct clone_args`，因而无法可靠检查其中的 flag。若要限制提交程序创建进程或 namespace，应考虑拒绝其 `clone3`，并同时审查 `clone`、`unshare`、`setns` 等入口。

参考：[clone(2)/clone3(2)](https://man7.org/linux/man-pages/man2/clone.2.html)、[Linux `clone_args` 定义](https://github.com/torvalds/linux/blob/master/include/uapi/linux/sched.h)、[cgroup v2 文档](https://docs.kernel.org/admin-guide/cgroup-v2.html)。

## 父子进程职责

子进程：

1. 完成必要初始化，包括标准输入输出重定向、关闭多余文件描述符、设置身份与资源限制、安全策略及工作目录。
2. 调用 `execve`/`execveat` 运行目标程序；失败时使用 `_exit` 返回明确错误码，避免继续运行沙箱管理器的清理逻辑。

父进程：

1. 监测子进程及其进程树资源，执行超时取消并终止残留子进程。
2. 使用 `wait` 系列（例如 `wait4`、`waitpid`）等待并回收子进程，区分正常退出、信号终止和沙箱内部错误。

## 进程属性

在 Linux 下，运行的进程通常有以下属性，在 OJ 的环境下，一般需要进行自定义配置

- 环境变量
- 命令行参数
- 资源限制：
  - [基于 Rlimit 的限制](./rlimit)
    - 最大 CPU 时间，
    - 最大写入量，
    - 最多可打开文件数量，
    - 最大进程数量
    - 堆栈大小限制，可使用，可申请的最大内存等
  - 所属[控制组（`cgroup`）](./control-group)
- 安全限制
  - 进程所属的用户
  - [用户组已经当前持有的特权](https://man7.org/linux/man-pages/man7/capabilities.7.html)
  - [能否提升特权](https://man7.org/linux/man-pages/man2/capget.2.html)
  - [Seccomp](./seccomp)，apparmor，selinux 等安全配置 [prctl](https://man7.org/linux/man-pages/man2/prctl.2.html)
  - 进程所处的[命名空间隔离](./namespace)
- 文件系统：
  - 当前的工作目录
  - 根目录（`chroot`）
  - 打开的文件描述符
  - 创建掩码（`umask`）
- 进程信号：信号处理函数，掩码等
- [Ptrace 状态](./ptrace)：是否正在被调试

## 例子

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        perror("fork failed");
        exit(1);
    }
    else if (pid == 0) {
        // 在子进程中，此时进行必要的初始化设置
        // 然后运行程序
        execl("/bin/ls", "ls", "-l", NULL);
        // 如果 exec 失败
        perror("exec failed");
        exit(1);
    }
    else {
        // 在父进程中，等待子进程结束
        int status;
        waitpid(pid, &status, 0);
        if (WIFEXITED(status)) {
            printf("Child exited with code %d\n", WEXITSTATUS(status));
        }
    }
    return 0;
}
```
