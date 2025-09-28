<template>
    <header :class="['vp-hero-info-wrapper', { fullscreen: isFullScreen }]">
        <slot name="bg" :bg="bg">
            <div v-if="bg.image" class="vp-hero-mask" :class="{ light: bg.imageDark }" :style="bgStyle">
                <div v-if="bg.imageDark" class="vp-hero-mask dark" :style="bgDarkStyle"></div>
            </div>
        </slot>
        <div class="vp-hero-info">
            <slot name="logo" :logo="logo">
                <DropTransition appear type="group">
                    <template v-slot:default>
                        <img v-if="logo.image" :key="'light'" class="vp-hero-image" :class="{ light: logo.imageDark }"
                            :style="logo.imageStyle" :src="logo.image" :alt="logo.alt" />
                        <img v-if="logo.imageDark" :key="'dark'" class="vp-hero-image dark" :style="logo.imageStyle"
                            :src="logo.imageDark" :alt="logo.alt" />
                    </template>
                </DropTransition>
            </slot>
            <slot name="info" :info="info">
                <div class="vp-hero-infos">
                    <DropTransition v-if="info.text" appear :delay="0.04">
                        <h1 id="main-title" class="vp-hero-title" :class="{'vp-hero-title-publication': info.publication}">{{ info.text }}</h1>
                    </DropTransition>
                    <DropTransition v-if="info.tagline" appear :delay="0.08">
                        <p id="main-description" v-html="info.tagline"></p>
                    </DropTransition>
                    <DropTransition v-if="info.authors.length > 0" appear :delay="0.08">
                        <p id="authors">
                            <span class="vp-hero-authors" v-for="(author, index) in info.authors" :key="index" >
                                <span v-html="author"></span>{{ index == info.authors.length-1?'':index == info.authors.length-2?' and ':', ' }}
                            </span>
                        </p>
                    </DropTransition>
                    <DropTransition v-if="actions.length" appear :delay="0.12">
                        <p class="vp-hero-actions">
                            <AutoLink v-for="(action, index) in actions" :key="index"
                                :class="['vp-hero-action', action.type ?? 'default', 'no-external-link-icon']"
                                :config="action">
                                <template v-if="action.icon" #before>
                                    <HopeIcon :icon="action.icon" />
                                </template>
                            </AutoLink>
                        </p>
                    </DropTransition>
                    <DropTransition v-if="info.abstract && info.abstract !== ''" appear :delay="0.20">
                        <p id="abstract" class="vp-hero-abstract" v-html="info.abstract"></p>
                    </DropTransition>
                </div>
            </slot>
        </div>
    </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { usePageFrontmatter, useSiteLocaleData, withBase } from 'vuepress/client';
import AutoLink from '@theme-hope/components/AutoLink';
import { DropTransition } from '@theme-hope/components/transitions/DropTransition';
import '@theme-hope/styles/hero-info.scss';
import { isString } from 'vuepress/shared';

const frontmatter = usePageFrontmatter();
const siteLocale = useSiteLocaleData();

const isFullScreen = computed(() => frontmatter.value.heroFullScreen ?? false);

const info = computed(() => {
    const { heroText, tagline } = frontmatter.value;
    return {
        text: heroText ?? '',
        tagline: tagline ?? '',
        isFullScreen: isFullScreen.value,
        publication: frontmatter.value.publication ?? false,
        authors: frontmatter.value.authors ?? [],
        abstract: frontmatter.value.abstract ?? '',
    };
});

const logo = computed(() => {
    const { heroText, heroImage, heroImageDark, heroAlt, heroImageStyle } = frontmatter.value;
    return {
        image: heroImage ? withBase(heroImage) : null,
        imageDark: heroImageDark ? withBase(heroImageDark) : null,
        imageStyle: heroImageStyle,
        alt: heroAlt ?? heroText ?? '',
        isFullScreen: isFullScreen.value,
    };
});

const bg = computed(() => {
    const { bgImage, bgImageDark, bgImageStyle } = frontmatter.value;
    return {
        image: isString(bgImage) ? withBase(bgImage) : null,
        imageDark: isString(bgImageDark) ? withBase(bgImageDark) : null,
        bgStyle: bgImageStyle,
        isFullScreen: isFullScreen.value,
    };
});

const actions = computed(() => frontmatter.value.actions ?? []);

const bgStyle = computed(() => [
    { 'background-image': `url(${bg.value.image})` },
    bg.value.bgStyle,
]);

const bgDarkStyle = computed(() => [
    { 'background-image': `url(${bg.value.imageDark})` },
    bg.value.bgStyle,
]);
</script>

<style scoped lang="scss">
@use "@sass-palette/hope-config";

.vp-hero-title-publication {
    font-size: 2em;
    font-family: 'Times New Roman', Times, serif;
}

.vp-hero-authors {
    font-size: 1.2em;
    font-family: 'Times New Roman', Times, serif;
}

@media (max-width: hope-config.$pad) {
    .vp-hero-title-publication {
        font-size: 1.5em;
    }
}

.vp-hero-info-wrapper {
    background-color: var(--theme-color-mask);
    padding-bottom: 1.8rem;
    padding-top: 1.2rem;
}

.vp-hero-abstract {
    text-align: left;
    font-size: 1em;
    font-family: 'Georgia', 'Times New Roman', Times, serif;
}

.vp-hero-abstract:first-letter {
    font-size: 2.9em;
    float: left;
    padding-right: 0.2em;
}
</style>