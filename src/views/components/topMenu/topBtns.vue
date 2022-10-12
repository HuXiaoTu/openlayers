<template>
    <!-- top栏  右侧按钮部分 -->
    <div
        class="btnRight"
        :style="{color:useSetting.themeConfig.color}"
    >
        <!-- 全局设置 -->
        <div @click="useApp.isShowSetting = !useApp.isShowSetting">
            <Setting class="btn" />
        </div>
    </div>

</template>

<script setup>
import { useSettingStore } from '../../../store/setting';
import { useAppStore } from '../../../store/app';

const useSetting = useSettingStore();
const useApp = useAppStore();

</script>

<style lang="scss" scoped>
.btnRight {
    width: 100%;
    height: 100%;
    padding: 5px 0;
    text-align: right;

    >div {
        width: 60px;
        height: 100%;
        margin-left: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 5px;

        .btn {
            width: 20px;
            height: 20px;
        }
    }

    >div:hover {
        background-color: #dcdcdc4c;
    }
}
</style>