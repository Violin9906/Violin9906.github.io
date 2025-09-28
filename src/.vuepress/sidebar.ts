import { sidebar } from "vuepress-theme-hope";

const enSidebar = sidebar({
    "/": [
      {
        text: "Articles",
        icon: "book",
        prefix: "posts/",
        children: "structure",
      },
      {
        text: "Projects",
        icon: "bars-progress",
        prefix: "projects/",
        children: "structure",
      },
      {
        text: "Publications",
        icon: "graduation-cap",
        prefix: "publications/",
        link: "publications/",
        children: "structure",
      },
    ],
  });

/* i18n */
// const zhSidebar = sidebar({
//     "/": [
//       {
//         text: "Articles",
//         icon: "book",
//         prefix: "zh/posts/",
//         children: "structure",
//       },
//       {
//         text: "Projects",
//         icon: "bars-progress",
//         prefix: "zh/projects/",
//         children: "structure",
//       },
//       {
//         text: "Publications",
//         icon: "graduation-cap",
//         prefix: "publications/",
//         link: "publications/",
//         children: "structure",
//       },
//     ],
//   });

export {enSidebar, /* zhSidebar */};