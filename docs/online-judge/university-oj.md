# 常见高校 OJ

高校 OJ 通常是大学课程、校队训练或区域赛的在线服务。很多站点有知名题库，但站点服务与可自部署的开源实现是两回事：下面标注“开源实现”的才有对应公开代码；其他条目作为题库、历史平台或服务入口记录。入口和提交能力可能迁移，使用前应查看各站公告。

## 中国高校

| 平台 | 学校/定位 | 现状与代码 |
| --- | --- | --- |
| [POJ](http://poj.org/) | 北京大学 JudgeOnline，经典英文题库 | 北京大学仍有[POJ 系统介绍](https://center.pku.edu.cn/zxts/pojxt/index.htm)；该站点是大学提供的在线服务，未找到官方公开的服务端源码仓库。北京大学团队还运营 [OpenJudge / 百炼](https://openjudge.cn/)及[百炼题库](http://bailian.openjudge.cn/)，用于课程和题库练习。 |
| [OpenJudge / 百炼](https://openjudge.cn/) | 北京大学团队提供的课程和题库平台 | 与 POJ 相关但为不同服务入口；可见[百炼题库](http://bailian.openjudge.cn/)。 |
| [HDUOJ / HDOJ](http://acm.hdu.edu.cn/) | 杭州电子科技大学 OJ，多校训练题库 | 常见题库与评测服务；未找到官方公开服务端源码仓库。 |
| [ZOJ](https://acm.zju.edu.cn/) | 浙江大学 Online Judge，历史悠久的题库和竞赛平台 | 官方主页仍发布公告和题目/竞赛信息；其公告说明代码提交已迁移到 [Pintia](https://zoj.pintia.cn/)。未找到官方公开的服务端源码仓库。 |
| BNUOJ | 北京师范大学在线评测系统（历史项目） | 有公开的[旧版代码仓库](https://github.com/51isoft/bnuoj)及衍生项目；当前官方服务和维护状态应以学校公告为准，不建议仅凭旧仓库部署生产服务。 |
| [THUOJ](https://dsa.cs.tsinghua.edu.cn/oj/) | 清华大学计算机系课程作业平台 | 当前主要用于课程教学；未找到该站官方公开的完整服务端源码。 |
| [SJTU ACM Class OJ](https://acm.sjtu.edu.cn/OnlineJudge/) | 上海交通大学 ACM 班课程、作业、考试和竞赛 | 运行中的教学平台；其实现 [TesutoHime](https://github.com/ACMClassOJ/TesutoHime) 公开源码，采用独立 Web、Scheduler 和 Judger 组件，并使用 nsjail 限制评测程序。 |
| [VNOJ](https://oj.vnoi.info/) | VNOI 的题库和竞赛平台 | 使用 DMOJ 衍生代码；见 [VNOI-Admin/OJ](https://github.com/VNOI-Admin/OJ)。 |
| [UOJ](https://uoj.ac/) | 通用 OJ，举办 OI/竞赛题目和比赛 | 社区服务对应的开源实现见 [UOJ 页面](uoj.md)。 |
| [HydroOJ](https://hydro.ac/) | Hydro 项目的官方 OJ 服务 | 与开源平台项目相对应，见 [Hydro 页面](hydro.md)。 |

## 其他地区高校

- [Aizu Online Judge](https://judge.u-aizu.ac.jp/)：日本会津大学的在线评测平台，包含课程和竞赛题目。
- [NTHUOJ](https://acm.cs.nthu.edu.tw/)：国立清华大学（台湾）的训练与竞赛平台；公开的个人题解仓库不等于平台源码。
- [Normal-OJ](https://github.com/Normal-OJ)：台湾师范大学资工系维护的 OJ 项目，GitHub 组织公开了平台和 sandbox 相关仓库。

## 选型提示

若目标是引用题目或了解传统题库，直接使用高校 OJ 的题库入口即可；若目标是自建系统，应检查该校是否公开可部署的软件、许可证、最近维护情况和评测端实现。也可以使用 [VJudge](vjudge.md) 或开源平台中的 Remote Judge 功能组织跨站训练，但需考虑上游服务可用性和规则限制。
