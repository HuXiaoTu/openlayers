<template>
    <el-menu
        router
        :default-active="activeIndex"
        @select="handleSelect"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#1F6B75"
        text-color="#ffffff"
        active-text-color="#ffd04b"
    >
        <el-menu-item index="/">主页</el-menu-item>
        <el-sub-menu index="2">
            <template #title>OpenLayers</template>
            <el-menu-item index="/staticDisplay">展示</el-menu-item>
            <el-menu-item index="/staticDraw">绘制</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>
<script>
import { onMounted } from 'vue'
export default {
    data() {
        return {
            activeIndex: ''
        }
    },
    methods: {
        handleSelect() {

        }
    },
    mounted() {
        this.activeIndex = window.location.pathname;
    },
}
</script>
<style lang="scss">
.el-menu.el-menu--horizontal {
    border-bottom: none !important;
}
</style>