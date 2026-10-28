# SYZOJ 与 Lyrio

## SYZOJ

[SYZOJ](https://github.com/syzoj) 是一套开源 OJ 项目生态，曾被学校和训练平台用于题库、作业与比赛。其 Web/业务服务和评测服务分开部署；评测端通过队列或服务协议获取任务，使用独立的沙箱执行提交。SYZOJ 的不同分支、部署脚本和依赖版本差异较大，部署前应先确认选用仓库的维护状态与文档版本。

可从 [SYZOJ GitHub 组织](https://github.com/syzoj)查看相关仓库。不要把旧教程中的 Node.js、数据库或沙箱版本当作当前通用要求。

## Lyrio

[Lyrio](https://github.com/lyrio-dev/lyrio) 是 SYZOJ 生态中的后续实现，项目介绍其评测能力基于 [simple-sandbox](https://github.com/lyrio-dev/simple-sandbox)。它采用 Node.js 服务栈，并将 Web 服务与评测执行分层。实际模块边界、配置格式与部署方式应以当前仓库的 README 和配置样例为准。

评测链路可概括为：站点接收提交并创建任务 → 评测服务编译、运行测试点 → 沙箱限制程序的系统资源与可访问范围 → 评测结果写回站点。将评测服务与 Web 服务分离，可以独立配置运行时和扩展计算资源；题目数据与任务协议则必须在各服务间保持一致。

## 部署与安全

请按目标分支的官方文档完成部署。部署评测节点时，应先在目标内核上验证沙箱实际限制，检查编译器及运行时版本，并通过恶意/超限样例验证超时、内存限制和文件访问边界。不要仅凭进程能启动就认为沙箱配置有效。

## 参考

- [SYZOJ 组织与项目](https://github.com/syzoj)
- [Lyrio 源码](https://github.com/lyrio-dev/lyrio)
- [simple-sandbox](https://github.com/lyrio-dev/simple-sandbox)
