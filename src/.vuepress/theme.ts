import { hopeTheme } from "vuepress-theme-hope";

import {enNavbar, zhNavbar} from "./navbar.js";
import {enSidebar, zhSidebar} from "./sidebar.js";

export default hopeTheme({
  hostname: "https://ruolin.wang",

  author: {
    name: "Ruolin Wang",
    url: "https://ruolin.wang",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "assets/icon/logo.png",

  repo: "Violin9906",

  docsDir: "src",

  locales: {
    "/": {
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,

      footer: "Powered by VuePress",

      displayFooter: true,
    },

    /* i18n */
    // "/zh/": {
    //   navbar: zhNavbar,
    //   sidebar: zhSidebar,
    //   footer: "Powered by VuePress",
    //   displayFooter: true,
    // }
  },

  blog: {
    description: "A Master's Student at USTC",
    intro: "/intro.html",
    avatar: "/assets/images/portrait.jpg",
    medias: {
      Email: "mailto:rl_wang@mail.ustc.edu.cn",
      GitHub: "https://github.com/Violin9906",
      Linkedin: "https://www.linkedin.com/in/ruolin-wang-631878206/",
      ORCiD: {
        icon: "https://orcid.org/assets/vectors/orcid.logo.icon.svg",
        link: "https://orcid.org/0009-0004-9053-8951",
      },
      GoogleScholar: {
        icon: "https://scholar.google.com/favicon.ico",
        link: "https://scholar.google.com/citations?user=VBOzYR0AAAAJ&hl=en",
      },
    },
  },

  editLink: false,

  metaLocales: {
    editLink: "Edit this page on GitHub",
  },

  // enable it to preview all changes in time
  // hotReload: true,

  // Encrypt some of your blogs by uncomment this
  encrypt: {
    config: {
      "/posts/Story": ["19990628"],
    },
  },

  plugins: {
    blog: true,

    // Uncomment this to enable comment
    // see https://giscus.app/
    comment: {
      provider: "Giscus",
      repo: "Violin9906/homepage-giscus-comments",
      repoId: "R_kgDOP4d0YQ",
      category: "Comments",
      categoryId: "DIC_kwDOP4d0Yc4Cv_nR",
      lazyLoading: true,
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    // These features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      footnote: true,
      plantuml: true,
      spoiler: true,
      sub: true,
      sup: true,
      tabs: true,
      tasklist: true,
      vPre: true,



      // install chart.js before enabling it
      chart: true,

      // insert component easily

      markmap: true,

      // install echarts before enabling it
      echarts: true,

      // install flowchart.ts before enabling it
      flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // install katex before enabling it
      // katex: true,

      // install mathjax-full before enabling it
      mathjax: true,

      // install mermaid before enabling it
      mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // install reveal.js before enabling it
      revealJs: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
        themes: ['white'],
      },

      // install @vue/repl before enabling it
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    shiki: {
      themes: {
        light: "one-light",
        dark: "one-dark-pro",
      }
    },

    searchPro: true,

    copyright: true,

    // install @vuepress/plugin-pwa and uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
},
{
  custom: true,
}
);
