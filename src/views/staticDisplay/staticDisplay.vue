<template>
    <!-- 静态绘制页面 -->
    <div class="staticDisplayMenu">
        <div
            class="btnClick btnCss"
            v-for="(item,index) in btnList"
            :key="index"
            size="mini"
            type="primary"
            @click="btnClick(item)"
        >{{item.name}}</div>
    </div>
</template>
<script>
import { staticDisplayList } from '../../assets/staticData/staticData.js';
import { drawFeatures } from '../../components/jsTool/controlCenter.js';
export default {
    data() {
        return {
            // 按钮列表 
            btnList: staticDisplayList
        }
    },
    methods: {
        btnClick({ name, type }) {
            let message = {
                lon: [90, 95, 100],
                lat: [30, 35, 40],
                u: [10, 10, 10, 10, 10, 15],
                v: [10, 10, 10, 10, 10, 15],
                t: ['10', '10', '10', '10', '10', '15'],
            }
            drawFeatures({ type, data: message })
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
    }
}
</style>