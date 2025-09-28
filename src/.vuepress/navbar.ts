import { navbar } from "vuepress-theme-hope";

const enNavbar = navbar([
  "/",
  "/intro",
  {
    text: "Blog",
    icon: "blog",
    link: "/article/",
  },
  {
    text: "Projects",
    icon: "bars-progress",
    prefix: "projects/",
    children: ["awesome-homepage"],
  },
  {
    text: "Publications",
    icon: "graduation-cap",
    link: "publications/",
  }
]);

/* i18n */

// const zhNavbar = navbar([
//   {
//     text: "主页",
//     icon: "home",
//     link: "/zh/",
//   },
//   {
//     text: "简历",
//     icon: "circle-info",
//     link: "/zh/intro",
//   },
//   {
//     text: "博客",
//     icon: "blog",
//     link: "/zh/article/",
//   },
//   {
//     text: "项目",
//     icon: "bars-progress",
//     prefix: "/zh/projects/",
//     children: ["dadsim"],
//   },
//   {
//     text: "出版物",
//     icon: "graduation-cap",
//     link: "/zh/publications/",
//   }
// ]);

export { enNavbar, /* zhNavbar */ };
