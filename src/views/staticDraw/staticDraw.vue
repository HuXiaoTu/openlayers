<template>
    <!-- 点形状绘制页面 -->
    <div class="staticDrawMenu">
        <!-- 按钮 展示列表 -->
        <div class="staticDrawMenuBtns">
            <!-- 点类 符号绘制 -->
            <DrawComponents
                v-for="(item,index) in dataList"
                :key="index"
                :title="item.title"
                :symbolList="item.symbolList"
                :drawToolHandel="drawToolHandel"
                @drawBtnClick="drawBtnClick"
            ></DrawComponents>
        </div>
    </div>
</template>
<script>
import { onBeforeUnmount, reactive } from 'vue';
import DrawComponents from './components/commonDraw.vue';
import { lineList, spotList } from '../../assets/staticData/staticData.js';
import { drawTool } from '../../commonTool/mapDrawHandle/core/drawTool.js';
import { pointDraw } from '../../commonTool/mapDrawHandle/drawTool/drawList/point.js';
import { lineStringDraw } from '../../commonTool/mapDrawHandle/drawTool/drawList/lineString.js';
export default {
    components: {
        DrawComponents,
    },
    setup() {
        // 绘制 基础类
        let drawToolHandel = new drawTool();
        // 点类 绘制
        let point = new pointDraw();
        // 点类 绘制
        let line = new lineStringDraw();

        // 数据列表
        let dataList = reactive([
            // 点类符号
            {
                title: "点类 符号绘制",
                symbolList: reactive(spotList)
            },
            // 线类符号
            {
                title: "线类 符号绘制",
                symbolList: reactive(lineList)
            },
        ]);
        // 卸载前
        onBeforeUnmount(() => {
            // 取消绘制状态
            drawToolHandel.clearInteraction();
        })

        // 选中按钮触发
        let drawBtnClick = ({ fontFamily, type }) => {
            let complexGraphics = ['LineString', 'Polygon', 'Circle'];
            // 开始绘制
            if (type === 'Point') {
                point.setImg(fontFamily).initDraw({ type });
            } else if (complexGraphics.includes(type)) {
                line.initDraw({ type });
            }
        }
        return {
            // 数据列表
            dataList,
            // 绘制类
            drawToolHandel,
            // 子组件  选中按钮触发
            drawBtnClick,
        }
    },
}
</script>
<style lang="scss" >
.staticDrawMenu {
    width: 300px;
    height: 100%;
    background-color: rgba(54, 54, 54, 0.8);
    color: #ffffff;
    padding: 5px;
    .staticDrawMenuTop {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .staticDrawMenuSpotTitle {
            width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .staticDrawMenuSpotTitleBtn {
            width: 50%;
            text-align: right;
        }
    }
    .staticDrawMenuBtns {
        padding: 5px;
        overflow: hidden;
    }
}
</style>