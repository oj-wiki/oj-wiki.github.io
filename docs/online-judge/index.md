# 在线评测系统

在线评测系统（Online Judge，OJ）通过网站提供题目、接收程序提交，并在隔离环境中编译和运行程序，再把结果反馈给用户。竞赛型 OJ 还需要管理比赛时间、参赛资格、计分规则和实时榜单。

常见角色包括参赛者、题目作者、比赛管理员和系统运维人员。对应的核心能力通常有题库与题目数据管理、提交与评测、比赛和榜单、用户与权限，以及系统监控和备份。

## 典型架构

一个 OJ 通常由以下部分组成：

- **Web 应用**：题目、提交、比赛、榜单和管理界面。
- **业务后端**：持久化用户、题目、提交与比赛状态，管理权限和评测任务。
- **任务队列或调度器**：分发评测任务，处理重测、优先级和失败恢复。
- **评测机**：下载题目数据，在沙箱中编译、运行并比较结果，再回传评测状态。
- **数据库、缓存和文件存储**：保存业务数据、会话/队列状态、代码和测试数据。

一次常见的提交链路是：用户提交代码 → 后端保存提交并排队 → 调度器选择评测机 → 评测机获取题目数据并运行测试 → 结果回传并更新提交页与榜单。题目格式、评测协议和沙箱实现因项目而异，不能只替换 Web 应用就假定评测机兼容。

## 开源实现

以下页面优先介绍维护中的主流项目，并区分完整 OJ 平台与评测后端。部署前应以项目官方文档和当前版本要求为准。

| 项目 | 定位 | 适用侧重点 |
| --- | --- | --- |
| [Hydro](hydro.md) | 模块化、插件化的综合 OJ | 多空间、题库导入、教学与竞赛 |
| [DMOJ](dmoj.md) | 完整的题库与竞赛平台，评测机可横向扩展 | 多语言、复杂赛制和大规模竞赛 |
| [QDUOJ](qduoj.md) | Django/Vue 平台，评测器独立部署 | Docker 化部署、教学与竞赛 |
| [HOJ](hoj.md) | Spring Cloud/Vue 分布式平台 | 训练、比赛和远程评测 |
| [HUSTOJ](hustoj.md) | PHP/C++/MySQL 传统 OJ | 学校训练站和轻量自建 |
| [SJTU ACM Class OJ](university-oj.md) | 教学、作业与考试平台，其 TesutoHime 评测系统开源 | 课程评测和多组件评测架构 |
| [DOMjudge](domjudge.md) | 面向 ICPC/ICPC 风格比赛的平台 | 现场赛、队伍与裁判流程 |
| [UOJ](uoj.md) | 通用在线评测系统 | 传统 OJ、OI/竞赛题型和自定义题目 |
| [SYZOJ 与 Lyrio](lyrio.md) | SYZOJ 生态及其后续 Lyrio | 自建 OJ 与基于 simple-sandbox 的评测 |
| [NOJ](https://github.com/ZsgsDesign/NOJ) | 南京邮电大学 OJ，支持本地与虚拟评测 | 混合评测场景 |
| [VNOJ](https://github.com/VNOI-Admin/OJ) | 基于 DMOJ 的衍生平台 | VNOI 题库与竞赛 |
| [VJudge](vjudge.md) | 跨站题目聚合与虚拟比赛服务 | 组合多家 OJ 题目进行训练 |

更多项目和相关工具见[项目索引](misc.md)及[常见高校 OJ](university-oj.md)。HDUOJ 等常见在线服务也列在索引中，注意它们与开源实现的区别。评测机与沙箱的原理见[评测机章节](/system-architecture/judger)及[沙箱章节](/judge/sandbox/)；题目格式与评测数据见[题目章节](/problem/)。

常见全球竞赛平台与经典题库见[经典 OJ 与竞赛平台](classic-platforms.md)，包括 Codeforces、AtCoder、SPOJ、Kattis、Topcoder、UVa/Online Judge、Timus 和 CSES。
