<script setup lang="ts">
import { usePageData, usePageFrontmatter } from "vuepress/client";
import Line from './Line.vue'
import Photo from './Photo.vue'

const frontmatter = usePageFrontmatter();

const { name, birthday, phone, email, github, homepage, introduce, showBirthday, showGender } = frontmatter.value
const gender = (() => {
    const { gender } = frontmatter.value
    switch (gender) {
        case 'M':
        case 'Male':
        case 'Man':
            return 'male'
        case 'F':
        case 'Female':
        case 'Woman':
            return 'female'
        default:
            return gender
    }
})()

const age = (() => {
    const birth = new Date(birthday)
    const now = new Date()
    const age = now.getFullYear() - birth.getFullYear()
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
        return age - 1
    }
    return age
})()

function mergeTexts(texts: (string | number | undefined)[], delimiter = ' / ') {
    let result = ''
    for (const text of texts) {
        if (text) {
            if (result) {
                result += delimiter
            }
            result += text
        }
    }
    return result
}
const name_bold = '<b>' + name + '</b>'
const people: string = (() => {
    const texts = [name_bold, showBirthday ? age : undefined, showGender ? gender : undefined]
    return mergeTexts(texts)
})()
const school: string = (() => {
    const { school } = frontmatter.value
    return school ?? ''
})()
</script>

<template>
    <div class="info">
        <div class="text">
            <Line :class-name="'people ' + gender" :text="people" />
            <Line class-name="school" :text="school" />
            <Line class-name="phone" :href="'tel:' + phone.replace(/-/g, '')" :text="phone" />
            <Line class-name="email" :href="'mailto:' + email" :text="email" />
            <Line class-name="github" :href="'https://' + github" :text="github" />
            <Line class-name="homepage" :href="homepage" :text="homepage" />
            <Line class-name="introduce" :text="introduce" />
        </div>
        <ClientOnly class="photo">
            <Suspense>
                <Photo />
            </Suspense>
        </ClientOnly>
    </div>
</template>

<style scoped lang="scss">
@use "@sass-palette/hope-config";

.info {
    display: flex;
}

@media print {
    .info {
        align-items: center !important;
        flex-direction: row !important;
    }

    .photo {
        margin-left: auto !important;
        margin-right: 0 !important;
    }
}

@media (min-width: hope-config.$tablet) {
    .info {
        align-items: center;
        flex-direction: row;
    }
}

@media (max-width: hope-config.$tablet) {
    .info {
        align-items: flex-start;
        flex-direction: column-reverse;
    }

    .photo {
        margin: auto;
    }
}
</style>