# 其他 OJ 与相关项目

本页收录暂未单独撰写实现说明的 OJ、题库和竞赛辅助工具。项目活跃度、部署要求和授权条款会变化，使用前请阅读对应仓库的 README、发行说明与许可证。

Codeforces、AtCoder 等经典托管平台另见[经典 OJ 与竞赛平台](classic-platforms.md)。

## OJ 实现

- [QDUOJ](qduoj.md)：青岛大学开源 OJ；后端、前端、判题器、JudgeServer 和部署脚本分别维护。
- [HOJ](hoj.md)：Hcode Online Judge，Spring Cloud/Vue 分布式 OJ，提供多种题型和远程评测。
- [HUSTOJ](hustoj.md)：PHP/C++/MySQL/Linux 实现，常用于学校训练站和比赛。
- [VJudge](vjudge.md)：跨站虚拟评测和虚拟比赛服务，详见 [VJudge 页面](vjudge.md)。
- [常见高校 OJ](university-oj.md)：POJ、HDUOJ、ZOJ、SJTU ACMOJ 等题库/平台入口与开源状态说明。
- [VNOJ](https://github.com/VNOI-Admin/OJ)：基于 DMOJ 的 VNOI Online Judge。
- [GuOJ](https://github.com/guoj-dev)：开源 OJ 项目。
- [NOJ](https://github.com/ZsgsDesign/NOJ)：开源在线评测系统。
- [SDUOJ](https://github.com/SDUOJ/OnlineJudge)：开源 OJ 项目。
- [冬蚂蚁 OnlineJudge](https://github.com/winterant/OnlineJudge)：在线评测系统实现。
- [VOJ](https://github.com/simplefanC/voj)：在线评测系统项目。
- [MOJ](https://github.com/MonashAPS/MOJ)：TypeScript 实现的 OJ/竞赛平台，项目说明其与 DMOJ 评测端兼容。
- [HinataUOJ](https://github.com/ouuan/Hinata-Online-Judge)：UOJ 的衍生实现。

## 常见在线平台（不等同于开源实现）

- [HDU Online Judge](http://acm.hdu.edu.cn/)（HDUOJ/HDOJ）：杭州电子科技大学的在线评测服务，常用于多校训练和题目练习。它是广泛使用的平台/题库；在本次核对中未找到官方公开的服务端源码仓库，因此不应与 [HOJ](hoj.md) 或 QDUOJ 这类开源软件混为一谈。HOJ 等系统提供对 HDU 的远程评测支持。
- POJ、ZOJ 等也常作为题目来源或练习平台；题目站点本身与可自部署的开源 OJ 实现是不同概念。

## 评测、题目和竞赛工具

- [DMOJ judge-server](https://github.com/DMOJ/judge-server)：独立评测后端，详见 [DMOJ 页面](dmoj.md)。
- [UOJ-System](https://github.com/UniversalOJ/UOJ-System)：详见 [UOJ 页面](uoj.md)。
- [Universal Problem Set](https://github.com/UniversalOJ/UniversalProblemSet)：题目与数据集合。
- [SYZOJ](https://github.com/syzoj) 与 [Lyrio](https://github.com/lyrio-dev/lyrio)：详见 [SYZOJ 与 Lyrio 页面](lyrio.md)。
- [icpctools](https://github.com/icpctools/icpctools)：ICPC 比赛管理与现场赛辅助工具。
- [Kattis Problem Package Format](https://www.kattis.com/problem-package-format/)：竞赛题目包格式规范。
- [atcoder-testcases](https://github.com/conlacda/atcoder-testcases)：AtCoder 题目测试数据相关工具/集合；需自行确认数据来源与使用许可。
- [CMS（Contest Management System）](https://github.com/cms-dev/cms)：面向编程竞赛组织和评测的分布式系统，最初为 IOI 2012 设计，尤其适合 IOI/OI 风格赛事。
- [Mooshak 2](https://github.com/mooshak-dcc/mooshak-2)：Web 编程竞赛管理系统，支持自动评测、clarification 和 ICPC/OI 等赛事流程。
- [ejudge](https://github.com/blackav/ejudge)：开源竞赛管理与评测系统。
- [PC²](https://pc2ccs.github.io/)：Programming Contest Control System，侧重现场比赛团队提交、裁判处理、澄清和榜单管理；代码与下载见官网。

## 相关项目（非 OJ）

- [OIerDb](https://github.com/OIerDb-ng/OIerDb)：信息学竞赛相关数据库项目。
- [OI Wiki](https://github.com/OI-wiki/OI-wiki)：算法竞赛知识库。
- [BuildXL](https://github.com/microsoft/BuildXL)：Microsoft 的构建加速系统，不是 OJ；可能与编译任务缓存/构建基础设施研究相关。
- [NVIDIA Container Toolkit CDI 支持](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html)：容器环境中设备访问的官方文档。GPU 评测还需要单独设计资源隔离和公平性策略。
