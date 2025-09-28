<template>
    <div class="new-page-divider"></div>
</template>

<style scoped lang="scss">
.new-page-divider {
    display: block;
    width: 100%;
    height: 0;
}

@media print {
    .new-page-divider {
        page-break-before: always;
    }
}
</style>