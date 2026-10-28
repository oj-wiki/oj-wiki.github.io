# Linux 控制组（Linux cgroups）

**控制组（Control Groups, 简称 cgroups）** 是 Linux 内核提供的一种机制，用于将一组进程组织起来，并对它们使用的系统资源进行统一限制、隔离与监控。

它最初由 Google 开发，并于 2007 年合并进 Linux 内核（2.6.24）。cgroups 是容器技术（如 Docker、Kubernetes、LXC 等）实现资源管理的核心组件。

在沙箱实现中，最重要的功能包括：

- 资源使用统计：CPU 使用时间、内存峰值、I/O 和压力信息
- 资源使用限制：CPU 配额/权重、CPU 集合、内存、I/O 和进程数

新部署优先使用 cgroup v2。v1 的 `cpuacct`、`memory` 等控制器名称不适用于 v2：v2 通过 `cpu.stat`、`memory.current`、`memory.peak` 等接口提供统计。评测任务应为整个进程树建立专属 cgroup，并在任务完成或被取消时确保进程组被终止、cgroup 被回收。

在使用 `systemD` 的系统中，最佳实践是与 `systemd` 通过 `dbus` 交流并创建 [DELEGATION](https://systemd.io/CGROUP_DELEGATION/)

## cgroups 的核心能力

cgroups 提供了对以下几种资源的**精细化控制**：

| 资源类型        | 描述                   |
| ----------- | -------------------- |
| CPU         | 使用率、亲和性、实时调度比例等      |
| 内存（memory）  | 限制、软限制、OOM 行为等       |
| 进程数量（pids）  | 限制 fork 进程的数量        |
| I/O         | 磁盘读写带宽、IOPS          |
| 网络带宽        | （需配合 tc）             |
| HugeTLB     | 管理大页内存               |
| 设备访问控制      | 限制进程访问 block/char 设备 |
| freezer     | 挂起或恢复进程组             |
| perf\_event | 监控进程的性能事件            |

## v1 vs v2

### cgroup v1

[文档](https://docs.kernel.org/admin-guide/cgroup-v1/index.html)

- 每种资源子系统是**独立挂载点**（hierarchy）。
- 各子系统不协调，容易出现“层级不一致”问题。
- 灵活但难管理。

### cgroup v2

[文档](https://docs.kernel.org/admin-guide/cgroup-v2.html)

- 合并为**统一层级（single hierarchy）**。
- 子系统称为 **controllers**，如 `memory`, `cpu`, `io`。
- 以更严格的方式处理进程控制。
- 是现代 Linux 部署的首选统一层级；实际是否启用及哪些控制器可用，取决于内核启动参数、发行版和 systemd 配置。

| 对比项  | v1                       | v2                |
| ---- | ------------------------ | ----------------- |
| 结构   | 多个挂载点，多个层级               | 单一层级              |
| 控制器  | 独立控制器                    | 统一协调的控制器          |
| 支持粒度 | 细粒度但易冲突                  | 简化且一致性更强          |
| 示例路径 | `/sys/fs/cgroup/memory/` | `/sys/fs/cgroup/` |

注意在 v2 的实现中，

- 普通 domain cgroup 的控制器分配遵循 no-internal-process 约束：启用 domain 控制器的父节点通常不直接放置工作负载进程，应将任务放入子 cgroup；threaded cgroup 有不同规则
- 写入 `cgroup.subtree_control` 开启需要的控制器时，需要注意自身已经开启的控制器。通常需要自顶而下的配置
- 对于 `systemd` 管理的 v2 `cgroup`，需要和 `systemd` 通信创建自有 `cgroup` 层级，避免与其他组件冲突

## 基本结构

`cgroup` 的结构可以类比为一个**树形文件系统**。每个节点（目录）代表一个控制组。通过写入这些目录下的控制文件，可以控制该组内进程的资源使用。

```text
/sys/fs/cgroup/
└── mygroup/
    ├── cgroup.procs           # 成员进程 PID
    ├── memory.max             # 限制内存
    ├── cpu.max                # 限制 CPU
    └── io.max                 # 限制 IO
```

要把一个进程加入某个 `cgroup`，只需要把它的 PID 写入 `cgroup.procs`。

## 常用控制器

以 v2 为例。

### `cpu`

- `cpu.stat`：统计 CPU 使用时间和节流情况
- `cpu.max`：设置周期内配额，实现 CPU 带宽上限
- `cpu.weight`：在竞争时设置相对权重，不是硬上限

### `memory`

- `memory.max`：设置内存限制（bytes）
- `memory.current`：获取当前使用量
- `memory.peak`：获取最大使用量
- `memory.stat`：获取详细使用量
- `memory.events`：读取 `high`、`max`、`oom`、`oom_kill` 等事件计数

### `pids`

- `pids.max`：设置最大线程数限制
- `pids.current`：获取当前线程数
- `pids.peak`：获取最大使用线程数

### `cpuset`

- `cpuset.cpus`：设置程序能够使用的 CPU 核心。需要自上而下的初始化

## 清理进程树：`cgroup.kill`

cgroup v2 的非根 cgroup 提供只写文件 `cgroup.kill`（Linux 5.14 起）。向其中写入 `1` 会向该 cgroup 及其所有后代中的进程发送 `SIGKILL`。内核会处理清理期间并发发生的 fork，并防止进程迁移造成遗漏，因此比遍历 `cgroup.procs` 后逐个 `kill(pid)` 更适合评测超时和取消时清理整棵任务进程树。

```sh
printf '1\n' > /sys/fs/cgroup/oj/task-123/cgroup.kill
```

`cgroup.kill` 不会等待进程退出，也不会替代父进程的 `wait()`/`waitpid()` 回收；发出 kill 后仍需等待成员退出，通过 `cgroup.events` 的 `populated 0` 确认子树已空，再删除 cgroup。它只存在于非根 cgroup；threaded cgroup 写入会以 `EOPNOTSUPP` 失败。若内核早于 5.14 或该文件不可用，备用的 PID 枚举清理需要处理 fork/退出/PID 重用竞态，适宜使用冻结、同步协议或 pidfd 等措施，不能假设一次枚举就覆盖完整进程树。
