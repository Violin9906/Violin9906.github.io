<template>
    <SkipLink />
    <CommonWrapper noToc="true" noSidebar="true">
        <div class="vp-page">
            <div class="resume-container">
                <ResumeInfo />
                <!-- <hr class="resume-hr" /> -->
                <Content class="resume" />
            </div>
        </div>
    </CommonWrapper>
</template>

<style lang="scss">
@use "@sass-palette/hope-config";

.resume-container {
    margin: 1.5rem 1rem;
    position: relative;
}

@media (min-width: hope-config.$pad) {
    .resume-container {
        width: hope-config.$pad;
        margin: 1.5rem auto;
    }
}

@media print {

    @page {
        margin: 1cm;
    }

    .resume-container {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* 2. 这里的 hr 如果太宽太黑，可以调淡或缩小间距 */
    .resume-hr hr {
        margin: 0.8rem 0 !important; // 缩小分割线上下间距
        opacity: 0.5;
    }

    .resume {
        font-size: 8pt !important; // 打印常用字号（约14px）
        line-height: 1.0 !important;

        /* 3. 针对你设计的 h2 (技能标签样式) 进行优化 */
        h2 {
            margin-top: 0.6rem !important; // 缩小标题上方的空白
            padding: 0.2rem 0.8rem !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        /* 4. 针对 h3 (项目/工作标题) */
        h3 {
            margin-top: 0.5rem !important;
            margin-left: 0.5rem !important; // 减少缩进让空间更充裕
        }

        /* 5. 针对列表和段落 (最占地方的部分) */
        ul {
            margin-top: 0.3rem !important;
            margin-bottom: 0.3rem !important;
        }

        li {
            margin-top: 0.2rem !important; // 缩小列表项之间的行距
        }

        p {
            margin-left: 1rem !important; // 减少缩进
            margin-top: 0.2rem !important;
        }
    }
}

.resume-hr hr {
    margin: 1.5rem 0;
    border: none;
    border-top: 1px solid var(--border-color);
}

.resume {
    --tag-background: var(--text-color);
    --tag-color: #FFFFFF;
    --tag-hole-color: var(--tag-color);
    --tag-line-color: var(--tag-background);

    font-size: 0.9rem;

    /* link */
    a {
        color: unset;
        text-decoration: unset;
    }

    h1 {
        display: none;
    }

    /* tag (title) */
    h2 {
        display: flex;
        margin-block: unset;
        margin-inline: unset;
        unicode-bidi: unset;
        margin-top: 0.5em;
        padding: 0.3em;
        padding-left: 1em;
        width: fit-content;
        border-radius: 1.05em;
        background: var(--tag-background);
        color: var(--tag-color);
        align-items: center;
    }

    /* tag hole */
    h2::after {
        content: '';
        display: inline-block;
        margin: 0 0.35em;
        width: 0.8em;
        height: 0.8em;
        border-radius: 50%;
        background: var(--tag-hole-color);
        z-index: 1;
    }

    /* tag line */
    h2::before {
        content: '';
        position: absolute;
        display: inline-block;
        width: 100%;
        width: -moz-available;
        width: -webkit-fill-available;
        width: stretch;
        height: 2px;
        background: var(--tag-line-color);
        z-index: 0;
    }

    /* subtitle */
    h3 {
        margin-block: unset;
        margin-inline: unset;
        unicode-bidi: unset;
        margin-top: 1em;
        margin-left: 1em;
    }

    h2 {
        font-size: 1em;

        @media (max-width: hope-config.$mobile) {
            font-size: 1em;
        }
    }

    h3 {
        font-size: 1em;

        @media (max-width: hope-config.$mobile) {
            font-size: 1em;
        }
    }

    /* technology stack*/
    code {
        margin-left: 1em;
        padding: 0.15em 0.5em;
        font-family: unset;
        font-weight: normal;
        border-radius: 0.5em;
        background: #EEEEEE;
    }

    /* list */
    ul {
        list-style-type: disc;
        margin-left: 2em;
        margin-block: unset;
        margin-inline: unset;
        unicode-bidi: unset;
    }

    /* list item */
    li {
        margin-top: 0.5em;
        align-items: baseline;
    }

    /* list item prefix */
    // li::before {
    //     content: '\2022';
    //     display: inline;
    //     font-weight: bolder;
    //     margin: 0 0.5em 0 1em;
    // }

    /* text */
    p {
        margin-block: unset;
        margin-inline: unset;
        unicode-bidi: unset;
        margin-left: 2em;
    }
}
</style>

<script setup>
import { Content } from "vuepress/client";
import { computed, defineComponent, h, resolveComponent } from "vue";
import { usePageData, usePageFrontmatter } from "vuepress/client";
import { RenderDefault } from "vuepress-shared/client";
import CommonWrapper from "@theme-hope/components/CommonWrapper";
import SkipLink from "@theme-hope/components/SkipLink";
import { usePure, useThemeData, useThemeLocaleData, useWindowSize } from "@theme-hope/composables/index";

import ResumeInfo from "../components/ResumeInfo.vue";

const themeData = useThemeData();
const themeLocale = useThemeLocaleData();
const page = usePageData();
const frontmatter = usePageFrontmatter();
const isPure = usePure();
const { isMobile } = useWindowSize();
</script>