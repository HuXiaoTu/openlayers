<template>
    <!-- 静态显示页面 -->
    <div class="staticDisplayMenu">
        <!-- 绘制按钮列表 -->
        <div
            class="btnClick btnCss"
            v-for="(item, index) in btnList"
            :key="index"
            size="mini"
            type="primary"
            @click="btnClick(item)"
        >
            {{ item.name }}
        </div>
    </div>
</template>
<script>
import { staticDisplayList } from '../../assets/staticData/staticData.js';
import { drawFeatures } from './controlCenter/controlCenter.js';
import { getData } from '../../axios/axios/axiosList.js';
export default {
    data() {
        return {
            // 按钮列表 
            btnList: staticDisplayList
        }
    },
    methods: {
        btnClick({ name, type }) {
            // 根据类型 获取数据
            getData('/windTemperature', { type }).then(data => {
                console.info('>>>> ws >>>⚡⚡ data', data)
                drawFeatures({ type, data })
            })
        }
    }
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
        font-family: myIcon;
    }
}
</style>