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
      { text: '代码执行', link: '/code-execution/' },
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
        ]
      }],
      '/contest/': [{
        text: '比赛',
        items: [
          { text: '简介', link: '/contest/' },
        ]
      }],
      '/problem/': [{
        text: '题目',
        items: [
          { text: '简介', link: '/problem/' },
        ]
      }],
      '/system-architecture/': [{
        text: '系统架构',
        items: [
          { text: '简介', link: '/system-architecture/' },
          { text: '前端', link: '/system-architecture/front-end' },
        ]
      }],
      '/judge/': [{
        text: '评测',
        items: [
          { text: '简介', link: '/judge/' },
        ]
      }],
      '/code-execution/': [{
        text: '代码执行',
        items: [
          { text: '简介', link: '/code-execution/' },
          { text: '创建子进程（fork + exec）', link: '/code-execution/fork-exec' },
          { text: '命名空间（namespace）', link: '/code-execution/namespace' },
          { text: '控制组（cgroup）', link: '/code-execution/control-group' },
          { text: '资源限制（rlimit）', link: '/code-execution/rlimit' },
          { text: '安全计算（seccomp）', link: '/code-execution/seccomp' },
          { text: '调试（ptrace）', link: '/code-execution/ptrace' },
        ]
      },
      {
        text: '编译器',
        items: [
          { text: 'C/C++ 编译器', link: '/code-execution/c' },
          { text: 'Python 编译器', link: '/code-execution/python' },
          { text: 'Java 编译器', link: '/code-execution/java' },
          { text: 'Go 编译器', link: '/code-execution/go' },
          { text: 'Rust 编译器', link: '/code-execution/rust' },
          { text: '其他编译器', link: '/code-execution/other-language' },
        ]
      },
      {
        text: '开源实现',
        items: [
          { text: 'go-judge', link: '/code-execution/go-judge' },
        ]
      }],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/oj-wiki/oj-wiki' }
    ]
  }
})
