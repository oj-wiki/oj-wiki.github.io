# 创建运行子进程（fork + exec）

在类 Unix 和 POSIX 系统中，运行子进程并不是类似 Windows 系统下的一键式 `CreateProcessW`，而是使用 `fork` 分叉和 `exec` 系统调用来分叉当前进程，然后使分叉的子进程运行想要的命令。

## 创建过程

父进程使用 `fork` 系统调用， `fork` 系统调用会返回两次，在父进程中返回子进程的 `pid`，在子进程中返回 `0`。此时父进程和子进程同时运行。

此时，在子进程中

1. 进行必要的设置（包括重定向输入输出和关闭文件描述符，设置安全和资源限制等）
2. 使用 `exec` 系列系统调用运行程序

此时，在父进程中

1. 监测子进程的资源使用以及配置情况
2. 使用 `wait` 系列（例如 `wait4`, `waitpid`）系统调用等待进程结束

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
