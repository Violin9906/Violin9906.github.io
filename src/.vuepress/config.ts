import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

import { getDirname, path } from "vuepress/utils";

import { registerComponentsPlugin } from '@vuepress/plugin-register-components'

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",

  /* i18n */

  lang: "en-US", // comment this line if you wanna enable i18n

  // locales: {
  //   "/": {
  //     lang: "en-US",
  //   },
  //   "/zh/": {
  //     lang: "zh-CN",
  //   },
  // },
  
  title: "Awesome Homepage",
  description: "A homepage template based on vuepress and theme-hope",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,

  alias: {
    "@theme-hope/components/HeroInfo": path.resolve(
      __dirname,
      "./components/HeroInfo.vue",
    ),
    "@theme-hope": "vuepress-theme-hope",
  },

  plugins: [
    registerComponentsPlugin({
      components: {
        FlexSpan: path.resolve(__dirname, "./components/FlexSpan.vue"),
        NewPage: path.resolve(__dirname, "./components/NewPage.vue")
      }
    }),
  ],

});
