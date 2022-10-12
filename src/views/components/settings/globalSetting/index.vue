<template>
    <!-- 全局设置 -->
    <el-drawer
        v-model="useApp.isShowSetting"
        show-close
        title="全局设置"
        size="20%"
    >
        <!-- 主题设置 -->
        <ThemeSetting />
        <!-- 更多设置 -->
        <MoreSetting />
    </el-drawer>
</template>

<script setup>
import ThemeSetting from './theme.vue';
import MoreSetting from './more.vue';
import { useAppStore } from '../../../../store/app';
const useApp = useAppStore();
</script>

<style lang="scss" >
.themeSetting {
    .layout-mode-item {
        width: 70px;
        height: 52px;
        display: inline-block;
        margin-right: 10px;
        border: 1px #e5e5e5 solid;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        border-radius: 1px;

        .mode-name {
            position: absolute;
            line-height: 55px;
            text-align: center;
            width: 100%;
            font-size: 12px;
            color: #bbb;
            transition: all 0.2s;
            text-indent: 1em;
        }
    }

    .layout-mode-item-active {
        border: 1px #2d8cf0 solid;
        box-shadow: 0 0 5px #a6c5e7 inset;

        .mode-name {
            color: #2d8cf0;
        }
    }
}
</style>