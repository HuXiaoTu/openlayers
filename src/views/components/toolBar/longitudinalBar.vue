<template>
    <!-- 纵 工具栏 -->
    <div class="longitudinalBar">
        <!-- 按钮区域 -->
        <div class="longitudinalBarCenter">
            <span
                class="longitudinalBarCenterBtn"
                title="回到中心"
                @click="goZoom"
            >
                <home-filled />
            </span>
            <span
                class="longitudinalBarCenterBtn"
                title="清空数据"
                @click="clearLayer"
            >
                <refresh-left />
            </span>
            <span
                class="longitudinalBarCenterBtn"
                title="获取图片"
                @click="getCanvasMap"
            >
                <Picture />
            </span>
            <!-- 有底图 动态追加到下面的按钮 -->
        </div>
        <!-- 伸缩按钮 -->
        <div
            class="longitudinalBarShow"
            @click="showList"
        >
            <Menu />
        </div>
    </div>
</template>
<script>
import { saveAs } from 'file-saver';
import { onMounted, ref } from 'vue';

import { getActiveLayer, getCurrentMap } from '@/commonTool/mapDrawHandle/core/mapTool';
import { currentProjCodefromLonLat } from '@/commonTool/mapDrawHandle/core/turf';
import { watchDomChange } from '@/commonTool/commonUtil/domHandle.js';
export default {
    setup() {
        let heightContent = ref(0);
        // 回到中心
        let goZoom = () => {
            let view = getCurrentMap().getView();
            let { flyTo } = gbMap.viewAnimation({ view, center: currentProjCodefromLonLat(gbMap.mapConfig.center) });
            flyTo()
        }
        // 清空绘制数据
        let clearLayer = () => {
            getActiveLayer().getSource().clear();
            // 由于设置完成后,可能地图会不更新,需要手动触发地图更新
            getCurrentMap().render();
        }
        // 获取图片
        let getCanvasMap = () => {
            getCurrentMap().once('postcompose', function (event) {
                let canvas = event.context.canvas
                canvas.toBlob(function (blob) {
                    saveAs(blob, 'map2.png')
                })
            })
            getCurrentMap().renderSync()
        }

        // 点击伸缩按钮
        let showList = () => {
            let dom = document.querySelector('.longitudinalBarCenter');
            if (dom.style.height == '0px') dom.style.height = heightContent.value + 'px';
            else dom.style.height = '0';
        }
        // 伸缩 盒子
        let contentBoxHeight = () => {
            let dom = document.querySelector('.longitudinalBarCenter');
            dom.style.height = dom.clientHeight + 'px';
            heightContent.value = dom.clientHeight;
        }

        onMounted(() => {
            let targetNode = document.querySelector('.longitudinalBarCenter');
            // 绑定 dom 变化 监听事件
            watchDomChange({ targetNode, callback: contentBoxHeight });
        })
        return {
            goZoom,
            clearLayer,
            getCanvasMap,
            showList,
            contentBoxHeight
        }
    },
}
</script>
<style lang="scss" scoped>
.longitudinalBar {
    width: 35px;
    padding: 3px;

    .longitudinalBarCenter {
        width: 100%;
        overflow: hidden;
        transition: all 0.3s linear;

        .longitudinalBarCenterBtn {
            display: inline-block;
            width: 100%;
            text-align: center;
            cursor: pointer;
            font-size: 25px;
            margin-bottom: 3px;
            background-color: rgba(0, 60, 136, 0.5);
            color: #ffffff;
            border-radius: 3px;

            &:hover {
                background-color: rgba(0, 60, 136, 0.7);
            }
        }
    }

    .longitudinalBarShow {
        width: 100%;
        text-align: center;
        font-size: 28px;
        cursor: pointer;
    }
}
</style>