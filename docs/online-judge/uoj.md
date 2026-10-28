# Universal Online Judge（UOJ）

[UOJ-System](https://github.com/UniversalOJ/UOJ-System) 是 Universal Online Judge 的社区版实现，提供题库、用户提交、比赛和评测相关功能。仓库包含 Web 应用及评测服务相关代码，项目文档和部署指北位于 [UniversalOJ GitHub 组织](https://github.com/UniversalOJ)。

## 架构与能力

UOJ 的应用端管理题目、提交和竞赛数据；评测端执行代码并将结果反馈给应用。题目可按不同评测需求配置标准 checker 或自定义评测程序。部署评测服务时需同时考虑题目数据、评测端口/通信凭据、编译器运行时和沙箱权限。

社区版有多个分支和部署方式，PHP、Web 服务和数据库依赖可能因分支而异。请优先跟随当前仓库的部署文档，而不要把旧版 Apache/PHP 安装命令复制到新环境。特别是 PHP 与系统库版本不兼容时，应先确认项目支持矩阵，再选择运行环境。

## 安全与运维

- 将评测机与 Web 服务、数据库分开运行，并限制评测机对内网和公网的访问。
- 使用非特权账号运行服务；题目数据、上传目录和运行时目录应分别设置最小权限。
- 在升级前备份数据库和题目数据，并在测试环境验证升级脚本、评测通信和常用题型。
- 评测机上线前验证沙箱对超时、内存、进程数和文件访问的限制。

## 参考

- [UOJ-System 源码](https://github.com/UniversalOJ/UOJ-System)
- [UniversalOJ 部署指北](https://github.com/UniversalOJ/UniversalOJ.github.io)
- [Universal Problem Set](https://github.com/UniversalOJ/UniversalProblemSet)
