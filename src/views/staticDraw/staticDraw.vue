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
            ></DrawComponents>
        </div>
    </div>
</template>
<script>
import { onBeforeUnmount, reactive } from 'vue';
import { drawTool } from '../../commonTool/mapDrawHandle/core/drawTool.js';
import DrawComponents from './components/commonDraw.vue';
import { spotList } from '../../assets/staticData/staticData.js';
export default {
    components: {
        DrawComponents,
    },
    setup() {
        // 绘制类
        let drawToolHandel = new drawTool();
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
                symbolList: reactive([])
            },
        ]);
        // 卸载前
        onBeforeUnmount(() => {
            // 取消绘制状态
            drawToolHandel.clearInteraction();
        })
        return {
            // 数据列表
            dataList,
            // 绘制类
            drawToolHandel,
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
            .settingBtn {
                cursor: pointer;
            }
        }
    }
    .staticDrawMenuBtns {
        padding: 5px;
        overflow: hidden;
        .staticDrawMenuSpot {
            .staticDrawMenuSpotTitle {
                margin-bottom: 5px;
                font-size: 14px;
            }
            .staticDrawMenuBtn {
                cursor: pointer;
                display: inline-block;
                padding: 4px 0;
                font-size: 25px;
                width: 12%;
                text-align: center;
                border-radius: 5px;
                .icon {
                    border-radius: 5px;
                    border: 1px solid #ccc;
                }
            }
            .animationOperate {
                animation: editAnimation 0.3s linear infinite;
            }
        }
    }
}
</style>