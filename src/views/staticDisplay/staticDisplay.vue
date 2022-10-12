<template>
    <!-- 静态显示页面 -->
    <div
        class="staticDisplayMenu"
        :style="{backgroundColor:useSetting.themeConfig.backgroundColor,color:useSetting.themeConfig.color}"
    >
        <!-- 绘制按钮列表 -->
        <div
            class="btnClick btnCss"
            :style="{backgroundColor:useSetting.themeConfig.btnBgColor,color:useSetting.themeConfig.color}"
            v-for="(item, index) in staticDisplayList"
            :key="index"
            size="mini"
            type="primary"
            @click="btnClick(item)"
        >{{ item.name }}</div>
    </div>
</template>
<script setup>
import { staticDisplayList } from '../../assets/staticData/staticData.js';
import { drawFeatures } from './controlCenter/controlCenter.js';
import { getData } from '../../axios/axios/axiosList.js';
import { useSettingStore } from '../../store/setting';

let useSetting = useSettingStore();

const btnClick = ({ name, type }) => {
    // 根据类型 获取数据
    getData('/windTemperature', { type }).then(data => {
        drawFeatures({ type, data })
    })
}
</script>
<style lang="scss" scoped>
.staticDisplayMenu {
    width: 300px;
    height: 100%;
    background-color: rgba(54, 54, 54, 0.8);
    color: #ffffff;
    padding: 5px;

    .btnCss {
        margin-bottom: 5px;
    }
}
</style>