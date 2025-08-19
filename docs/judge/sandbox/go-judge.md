# go-judge

[go-judge](https://github.com/criyle/go-judge)（[文档](https://docs.goj.ac)） 是一个为 Online Judge 安全运行打造的沙箱。拥有 Rest / gRPC / WebSocket API 。使用 Linux 容器技术隔离用户程序。

特性包括：

- 使用可复用沙箱与 `vfork` 减少容器创建开销
- 使用 `cgroup` 和命名空间隔离与限制用户程序使用资源
- 使用 `mount.yaml` 自定义挂载命名空间的初始化
- 提供 `go-judge-shell` 用于调试沙箱内运行环境
- 使用文件缓存减少文件传输带来的开销
- 将资源初始化以及销毁包装成一次请求避免资源泄露
