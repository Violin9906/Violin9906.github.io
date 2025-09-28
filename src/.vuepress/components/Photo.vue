<script setup>
import { usePageData, usePageFrontmatter } from "vuepress/client";

const frontmatter = usePageFrontmatter();

const photo = (() => {
    return frontmatter.value.photo
})()

const alt = (() => {
    return "photo"
})()
</script>

<template>
    <img v-if="photo" class="photo" :src="photo" :alt="alt">
</template>

<style>
.photo {
    margin-left: auto;
    border-radius: 50%;
    height: 8rem;
    width: 8rem;
    object-fit: cover;
}
</style>