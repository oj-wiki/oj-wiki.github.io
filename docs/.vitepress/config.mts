import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OJ Wiki",
  description: "Wiki for open source online judges with their technology and specification",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '在线评测系统', link: '/online-judge/' },
      { text: '比赛', link: '/contest/' },
      { text: '题目', link: '/problem/' },
      { text: '系统架构', link: '/system-architecture/' },
      { text: '评测', link: '/judge/' },
    ],

    sidebar: {
      '/online-judge/': [{
        text: '简介',
        items: [
          { text: '在线评测系统', link: '/online-judge/' },
        ]
      }, {
        text: '开源 OJ',
        items: [
          { text: 'Hydro', link: '/online-judge/hydro' },
          { text: 'UOJ', link: '/online-judge/uoj' },
          { text: 'LOJ', link: '/online-judge/lyrio' },
          { text: 'DomJudge', link: '/online-judge/domjudge' },
          { text: 'Misc', link: '/online-judge/misc' },
        ]
      }],
      '/contest/': [{
        text: '比赛赛制',
        items: [
          { text: '简介', link: '/contest/' },
        ]
      },
      {
        text: '比赛流程管理',
        items: [
          { text: '管理', link: '/contest/management' },
        ]
      }],
      '/problem/': [{
        text: '题目描述',
        items: [
          { text: '简介', link: '/problem/' },
          { text: '元数据', link: '/problem/metadata' },
        ]
      },
      {
        text: '题目类型',
        items: [
          { text: '题型', link: '/problem/category' },
        ]
      },
      {
        text: '测试数据',
        items: [
          { text: '数据类型', link: '/problem/test-data' },
          { text: 'SPJ', link: '/problem/spj' },
          { text: '记分策略', link: '/problem/scoring' },
        ]
      },
      {
        text: '交换格式',
        items: [
          { text: '交换格式', link: '/problem/exchange-format' },
        ]
      },
      {
        text: '出题工具',
        items: [
          { text: 'testlib', link: '/problem/testlib' },
        ]
      }],
      '/system-architecture/': [{
        text: '系统架构',
        items: [
          { text: '简介', link: '/system-architecture/' },
          { text: '前端', link: '/system-architecture/front-end' },
          { text: '后端', link: '/system-architecture/back-end' },
          { text: '任务调度', link: '/system-architecture/queue' },
          { text: '评测机', link: '/system-architecture/judger' },
          { text: '数据存储', link: '/system-architecture/storage' },
        ]
      },
      {
        text: '扩展',
        items: [
          { text: '缓存管理', link: '/system-architecture/cache' },
          { text: '可观测化', link: '/system-architecture/observability' },
          { text: '水平扩展', link: '/system-architecture/scale' },
        ]
      }],
      '/judge/': [{
        text: '评测',
        items: [
          { text: '简介', link: '/judge/' },
        ]
      },
      {
        text: '沙箱',
        items: [
          { text: '简介', link: '/judge/sandbox/' },
          { text: '创建子进程（fork + exec）', link: '/judge/sandbox/fork-exec' },
          { text: '命名空间（namespace）', link: '/judge/sandbox/namespace' },
          { text: '控制组（cgroup）', link: '/judge/sandbox/control-group' },
          { text: '资源限制（rlimit）', link: '/judge/sandbox/rlimit' },
          { text: '安全计算（seccomp）', link: '/judge/sandbox/seccomp' },
          { text: '调试（ptrace）', link: '/judge/sandbox/ptrace' },
          { text: '常见恶意代码', link: '/judge/sandbox/malicious-code' },
        ]
      },
      {
        text: '编译器',
        items: [
          { text: 'C/C++ 编译器', link: '/judge/compiler/c' },
          { text: 'Python 编译器', link: '/judge/compiler/python' },
          { text: 'Java 编译器', link: '/judge/compiler/java' },
          { text: 'Go 编译器', link: '/judge/compiler/go' },
          { text: 'Rust 编译器', link: '/judge/compiler/rust' },
          { text: '其他编译器', link: '/judge/compiler/other-language' },
        ]
      },
      {
        text: '开源实现',
        items: [
          { text: 'go-judge', link: '/judge/sandbox/go-judge' },
          { text: 'misc', link: '/judge/sandbox/misc' },
        ]
      }],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/oj-wiki/oj-wiki' }
    ]
  }
})
