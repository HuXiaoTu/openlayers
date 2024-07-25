<template>
    <router-view></router-view>
</template>

<script setup>
import { initialMap } from '@/commonTool/mapDrawHandle/core/mapTool';

// 初始化map对象
initialMap();
</script>

<style lang="scss" scoped></style>