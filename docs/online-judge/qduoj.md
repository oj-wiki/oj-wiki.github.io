# QDUOJ（QingdaoU Online Judge）

[QDUOJ](https://github.com/QingdaoU/OnlineJudge) 是青岛大学开源的 OJ，采用 Python/Django 后端与 Vue 前端，并将判题服务拆成独立组件。项目的 2.0 组件包括 [OnlineJudge](https://github.com/QingdaoU/OnlineJudge)、[OnlineJudgeFE](https://github.com/QingdaoU/OnlineJudgeFE)、[Judger](https://github.com/QingdaoU/Judger) 和 [JudgeServer](https://github.com/QingdaoU/JudgeServer)；部署配置由 [OnlineJudgeDeploy](https://github.com/QingdaoU/OnlineJudgeDeploy) 管理。

## 特点与架构

- Web 后端管理用户、题目、提交、比赛及数据；前端独立构建和部署。
- JudgeServer 负责与后端通信并调用 Judger；Judger 在 Linux 上使用系统资源限制和 seccomp 等机制约束提交程序。
- 支持 ACM/OI 赛制、实时或赛后榜单、多语言和题目模板。
- 通过 Docker Compose 部署多个服务，便于快速搭建，但生产环境仍需配置 HTTPS、密钥、数据持久化、日志和备份。

## 部署与维护

项目提供独立的部署仓库和文档。请确认使用的分支/版本（例如 2.0 分支）与后端、前端、JudgeServer 镜像相互匹配。不要直接使用仓库或旧教程中的默认管理员密码；部署后立即设置强密码，并检查公开端口、内部服务网络与挂载卷权限。

线上评测前应验证目标内核下 Judger 的沙箱能力、语言运行时、文件权限和资源限制；题目数据和数据库应纳入备份与恢复演练。

## 参考

- [QDUOJ 后端](https://github.com/QingdaoU/OnlineJudge)
- [QDUOJ 前端](https://github.com/QingdaoU/OnlineJudgeFE)
- [JudgeServer](https://github.com/QingdaoU/JudgeServer)
- [Judger](https://github.com/QingdaoU/Judger)
- [部署仓库](https://github.com/QingdaoU/OnlineJudgeDeploy)
- [项目文档](https://opensource.qduoj.com/)
