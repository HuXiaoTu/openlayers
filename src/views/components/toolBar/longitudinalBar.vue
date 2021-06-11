<template>
    <!-- 纵 工具栏 -->
    <div class="longitudinalBar">
        <!-- 按钮区域 -->
        <div class="longitudinalBarCenter">
            <span class="longitudinalBarCenterBtn" title="回到中心" @click="goZoom">
                <i class="el-icon-s-home"></i>
            </span>
            <span class="longitudinalBarCenterBtn" title="清空数据" @click="clearLayer">
                <i class="el-icon-refresh"></i>
            </span>
            <span class="longitudinalBarCenterBtn" title="获取图片" @click="getCanvasMap">
                <i class="el-icon-picture"></i>
            </span>
            <!-- 有底图 动态追加到下面的按钮 -->
        </div>
        <!-- 伸缩按钮 -->
        <div class="longitudinalBarShow" @click="showList">
            <i class="el-icon-menu"></i>
        </div>
    </div>
</template>
<script>
import { saveAs } from 'file-saver';
import { onMounted, ref } from 'vue';
import { getCurrentMap } from '../../../components/jsTool/mapTool';
import { clearMapDraw } from '../../../components/jsTool/LayerTool';
import { viewAnimation } from '../../../components/jsTool/ViewTool';
import { currentProjCodefromLonLat } from '../../../components/jsTool/turf';
import { mapConfig } from '../../../components/commonSetting/config';
import { watchDomChange } from '../../../components/jsTool/CommonUtils';
export default {
    setup() {
        let heightContent = ref(0);
        // 回到中心
        let goZoom = () => {
            let { flyTo } = viewAnimation({ center: currentProjCodefromLonLat(mapConfig.center) });
            flyTo()
        }
        // 清空绘制数据
        let clearLayer = () => {
            clearMapDraw()
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
            // 伸缩 内容 高度
            heightContent,
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