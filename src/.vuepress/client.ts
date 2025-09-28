import "vuepress-theme-hope/presets/round-blogger-avatar.scss"
import { defineClientConfig } from 'vuepress/client'
import Resume from "./layouts/Resume.vue"

export default defineClientConfig({
  enhance({ app, router, siteData }) {},
  setup() {},
  rootComponents: [],
  layouts: {
    Resume,
  },
})