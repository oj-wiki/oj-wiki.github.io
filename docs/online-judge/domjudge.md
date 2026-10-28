# DOMjudge

[DOMjudge](https://github.com/DOMjudge/domjudge) 是面向 ICPC 及其区域赛的竞赛管理与评测系统。它覆盖队伍提交、评测、计分榜、裁判与赛事管理流程，常用于现场赛和在线 ICPC 风格比赛。

## 组件

部署通常包含 **domserver**（网站与赛事管理、提交和评测协调）、数据库、**judgehost**（执行提交的评测节点），以及供队伍和裁判使用的 Web 界面。队伍提交进入服务端后由 judgehost 处理，结果和计分状态回到比赛页面。多台 judgehost 可并行处理评测任务。

DOMjudge 的核心设计围绕 ICPC 竞赛流程；若需要面向日常刷题的题库社区、复杂 OI/IOI 部分分数规则或丰富的题目作者工作流，应先核对当前版本是否满足要求。

## 题目包

DOMjudge 支持 ICPC Problem Package Format（Problem Package Format），便于在赛事工具之间交换题目包。题目包通常包含题面、输入输出样例、测试数据及校验/生成相关文件。参见 [Kattis Problem Package Format](https://www.kattis.com/problem-package-format/) 与 DOMjudge 官方文档中的题目格式说明。

## 部署

安装依赖和服务配置随 DOMjudge 版本及 Linux 发行版变化。请从[官方安装文档](https://www.domjudge.org/docs/manual/)选择与目标版本对应的 domserver、judgehost 安装步骤。旧笔记中固定的 Apache、PHP、MySQL 命令可能与当前版本不兼容，不能直接作为通用安装脚本。

比赛上线前应演练队伍端提交、裁判端操作、封榜/解封、重测和备份恢复；评测节点应隔离运行，并确认节点与 domserver 间的网络和认证配置。

## 参考

- [DOMjudge 源码](https://github.com/DOMjudge/domjudge)
- [DOMjudge 下载与文档](https://www.domjudge.org/download)
- [icpctools](https://github.com/icpctools/icpctools)：ICPC 赛事周边工具
