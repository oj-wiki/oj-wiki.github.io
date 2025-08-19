# 评测流程

评测流程包括

- 获取提交
- 获取评测提交所需的各种文件
  - 题目的配置
  - 题目的测试点
  - 题目的附加文件，例如 SPJ
- 根据题目配置文件评测提交
  - 根据编程语言配置编译代码
  - 运行编译可执行文件
  - 对比测试点输出
- 上传运行结果

## 常用评测状态

- AC (Accepted)：评测代码通过所有测试点
- WA (Wrong Answer)：评测代码运行通过，但是存在未通过的测试点
- CE (Compilation Error)：评测代码编译失败
- TLE (Time Limit Exceeded)：评测代码运行超过时间限制
- MLE (Memory Limit Exceeded)：评测代码运行时使用内存超过限制
- OLE (Output Limit Exceeded)：评测代码输出内容超过限制
- RE (Runtime Error)：评测代码产生运行时错误，例如非法内存访问，非 0 返回值
- IE (Internal Error)：评测系统的内部错误，和评测代码无关，例如
  - 错误的题目配置，例如 SPJ ， 交互器
- 可能的其他结束状态包括
  - Banned Syscall：评测代码尝试访问特权系统调用
  - Cancelled：评测进程被取消
- 可能的中间状态包括
  - Submitted / Waiting：代码已提交，正在等待空闲评测机
  - Compiling：评测机正在编译提交代码
  - Judging：评测机正在运行评测任务

通常来说，评测状态的转换可以使用有限状态机来描述。
