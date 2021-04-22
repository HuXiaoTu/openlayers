<template>
    <el-menu
        router
        :default-active="activeIndex"
        @select="handleSelect"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#ffffff"
        active-text-color="#ffd04b"
    >
        <el-menu-item index="/">主页</el-menu-item>
        <el-submenu index="2">
            <template #title>openlayers</template>
            <el-menu-item index="/home">选项1</el-menu-item>
            <el-menu-item index="#">选项2</el-menu-item>
            <el-menu-item index="#">选项3</el-menu-item>
        </el-submenu>
    </el-menu>
</template>
<script>
export default {
    data() {
        return {
            activeIndex: ''
        }
    },
    methods: {
        handleSelect() {

        }
    }
}
</script>