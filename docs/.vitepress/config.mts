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
          { text: '命名空间', link: '/code-execution/namespace' },
          { text: '控制组', link: '/code-execution/control-group' },
        ]
      },
      {
        text: '开源实现',
        items: [
          { text: '简介', link: '/code-execution/' },
        ]
      }],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/oj-wiki/oj-wiki' }
    ]
  }
})
