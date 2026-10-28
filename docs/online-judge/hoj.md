# HOJ（Hcode Online Judge）

[HOJ](https://github.com/HimitZH/HOJ) 是一套基于 Spring Boot、Spring Cloud Alibaba 和 Vue 的前后端分离 OJ。仓库包含后端、前端和 sandbox 等目录，项目文档提供部署与配置说明。

## 特点

- 支持标准、Special Judge、交互、子任务和文件输入输出等评测模式。
- 支持训练、团队和讨论等功能，以及 ICPC 比赛榜单操作。
- 提供 Remote Judge，对接 HDU、POJ、Codeforces、AtCoder、SPOJ、Libre 等外部平台；远程评测依赖上游网站接口和策略，可能随对方变化而失效。
- 采用分布式服务设计，评测服务可与 Web/业务服务分开部署。

## 部署与注意事项

HOJ 的服务较多，部署时应按官方文档配置数据库、注册/配置中心、消息或缓存服务、前端、后端和 JudgeServer，避免只启动 Web 层就认为系统完整。评测机运行不可信代码，应单独隔离并验证 sandbox 的资源与系统调用限制。

系统要求、部署方式和配置项以[官方文档](https://docs.hdoi.cn/)及[仓库](https://github.com/HimitZH/HOJ)当前版本为准。仓库采用 MIT 许可证；若修改或再分发，应仍核对仓库中的许可证和商标/署名要求。

## 参考

- [HOJ 源码](https://github.com/HimitZH/HOJ)
- [HOJ 文档](https://docs.hdoi.cn/)
