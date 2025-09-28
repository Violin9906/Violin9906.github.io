<script setup lang="ts">
import { usePageData, usePageFrontmatter } from "vuepress/client";

const frontmatter = usePageFrontmatter();

interface Line {
    className?: string
    href?: string
    text?: string
}

let { className } = defineProps<Line>()

const classes = (() => {
    const { icon } = frontmatter.value
    if (icon != 'black and white') {
        return 'colour ' + ( className || '' )
    }
    return className
})()
</script>

<template>
    <template v-if="text">
        <a v-if="href" :href="href" rel="noopener noreferrer" target="_blank">
            <div class="line" :class="classes" v-html="text"></div>
        </a>
        <div v-else class="line" :class="classes" v-html="text"></div>
    </template>
</template>

<style scoped lang="scss">
@use "sass:color";
@use "@sass-palette/helper";
@use "@sass-palette/hope-config";

/* icon font */
@font-face {
    font-family: icon;
    src: url('../assets/fonts/icon.woff2');
}

/* info text line */
div {
    margin-top: 0.5em;
    font-size: 1em;
}

div::before {
    font-family: icon;
    margin-right: 0.5em;
}

// .colour::before[data-theme=light] {
//     --school-color: #252525;
//     --phone-color: #42B983;
//     --email-color: #FFC310;
//     --github-color: #1F2328;
//     --gitee-color: #C71D23;
// }

// .colour::before[data-theme=dark] {
//     --school-color: #DADADA;
//     --phone-color: #42B983;
//     --email-color: #FFC310;
//     --github-color: #1F2328;
//     --gitee-color: #C71D23;
// }

.colour.male::before {
    --people-color: #6FB3EE;
}

.colour.female::before {
    --people-color: #FF54AF;
}

.people::before {
    content: '\e600';
    color: var(--people-color);
}

.school::before {
    content: '\e601';
    color: var(--school-color);
}

.phone::before {
    content: '\e602';
    color: var(--phone-color);
}

.email::before {
    content: '\e603';
    color: var(--email-color);
}

.github::before {
    content: '\e604';
    color: var(--github-color);
}

.gitee::before {
    content: '\e605';
    color: var(--gitee-color);
}

.homepage::before {
    content: '\e606';
    color: var(--homepage-color);
}

a {
    color: unset;
    text-decoration: unset;
    font-weight: unset;
}
</style>