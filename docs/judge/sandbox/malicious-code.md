# 常见恶意代码

在线评测系统有时会收到尝试突破沙箱限制的代码，以下是一些常见的攻击手段。

- 拒绝服务攻击：使用超过限制的计算资源。很多 OJ 的实现对于编译期的资源限制比较宽松，可能会遭遇此类攻击。
- 未授权访问：使用网络，访问预期外文件，使用特权系统调用

来源：

- [vijos/malicious-code](https://github.com/vijos/malicious-code)
- [judge0](https://ieeexplore.ieee.org/abstract/document/9245310)

## 超大可执行文件

使用全局变量初始化产生超大可执行文件。

```c
// https://codeexplainer.wordpress.com/2018/01/20/how-dismantle-compiler-bomb/
main[-1u]={1};
```

## 引用交互式文件

在编译期引用交互式文件。编译器尝试读取文件时会阻塞或溢出。

```c
#include </dev/urandom>
```

## 编译巨大嵌套式结构

```c
struct x struct z<x(x(x(x(x(x(x(x(x(x(x(x(x(x(x(x(x(y,x(y><y*,x(y*w>v<y*,w,x{}
```

## fork 炸弹

创建超量子线程耗尽 CPU 资源。

```c
#include <unistd.h>
int main() {
    for(;;) fork();
}
```

## 发送信号

向其他进程发送信号。在隔离不完善的情况下，可能造成其他进程退出。

```c
#include <unistd.h>
int main() {
    kill(1, SIGSEGV);
}
```

## 访问网络

评测环境应当在网络隔离的环境下运行。

## 非法输出

输出文件包含非 UTF-8 字符，以字符串形式传输时需要注意转换。通常需要用二进制文件格式传输。

```c
#include <stdio.h>
int main() {
    printf("\xFE");
}
```

## 特权系统调用

使用 0-day 漏洞，例如在特定内核 bug 下容器逃逸。
