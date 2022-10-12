<template>
    <!-- 主页 -->
    <div class="homePage">
        <!-- 导航栏 -->
        <div class="header">
            <TopMenu></TopMenu>
        </div>
        <!-- 内容部分 -->
        <div class="contentBox">
            <!-- 侧边栏 -->
            <div class="mapMenu">
                <router-view></router-view>
            </div>
            <!-- 纵 工具栏 -->
            <div class="longitudinal">
                <LongitudinalBar></LongitudinalBar>
            </div>
            <!-- 内容区域 -->
            <div class="mapContainer">
                <MapView></MapView>
            </div>
        </div>

        <!-- 全局设置 -->
        <GlobalSetting />
    </div>
</template>
<script setup>
import TopMenu from './components/topMenu/top.vue';
import LongitudinalBar from './components/toolBar/longitudinalBar.vue';
import GlobalSetting from './components/settings/globalSetting/index.vue';
import MapView from './mapView/mapView.vue';
import { watchDomChange } from '../commonTool/commonUtil/domHandle.js';

import { onMounted } from 'vue';

onMounted(() => {
    // 动态设置 纵工具栏位置
    const longitudinal = document.querySelector('.longitudinal');
    // 选择需要观察变动的节点
    const targetNode = document.querySelector('.mapMenu');
    // 当观察到变动时执行的回调函数
    const callback = () => {
        longitudinal.style.left = targetNode.clientWidth + 'px';
    };

    // 绑定 dom 监听事件
    watchDomChange({ targetNode, callback });
})
</script>

<style lang="scss">
#app {
    height: 100%;
    width: 100%;

    .homePage {
        height: 100%;
        width: 100%;

        .header {
            height: 60px;
        }

        .contentBox {
            height: calc(100% - 60px);
            position: relative;

            .mapMenu {
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
            }

            .longitudinal {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
            }

            .mapContainer {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
