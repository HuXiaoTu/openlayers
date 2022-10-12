<template>
    <div
        class="menuBox"
        :style="{backgroundColor:useSetting.themeConfig.topBackgroundColor}"
    >
        <!-- 菜单列表 -->
        <el-menu
            router
            :default-active="activeIndex"
            @select="handleSelect"
            class="menuLeft"
            mode="horizontal"
            :background-color="useSetting.themeConfig.topBackgroundColor"
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
        <!-- 按钮列表 -->
        <div class="menuRight">
            <TopBtns />
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import TopBtns from './topBtns.vue';
import { useSettingStore } from '../../../store/setting';

const useSetting = useSettingStore();

// 当前选中的菜单
let activeIndex = ref('');
onMounted(() => {
    activeIndex.value = window.location.pathname;
})

const handleSelect = () => {

}
</script>
<style lang="scss">
.menuBox {
    width: 100%;
    height: 100%;
    display: flex;

    .menuLeft {
        flex: 1;
    }

    .menuRight {
        width: 200px;
        height: 100%;
    }
}

.el-menu.el-menu--horizontal {
    border-bottom: none !important;
}
</style>