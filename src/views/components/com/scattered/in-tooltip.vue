<template>
    <!-- 提示信息 -->
    <el-tooltip
        :placement="placement || settingStore.tipDirection"
        :enterable="enterable"
        :content="content"
        :disabled="disabled"
        :effect="effect || settingStore.theme"
    >
        <slot></slot>
    </el-tooltip>
</template>
<script setup name="tooltip">
import { useSettingStore } from "@/store/setting.js";
defineProps({
    // 显示的内容
    content: {
        type: String,
        default: '',
    },
    // Tooltip 组件出现的位置
    placement: {
        type: String,
        default: '',
    },
    // Tooltip 主题，内置了 dark / light 两种
    effect: {
        type: String,
        default: '',
    },
    // Tooltip 组件是否禁用
    disabled: {
        type: String,
        default: false
    },
    // 鼠标是否可进入到 tooltip 中
    enterable: {
        type: String,
        default: false
    }
})

const settingStore = useSettingStore();
</script>

<style lang="scss" scoped>

</style>