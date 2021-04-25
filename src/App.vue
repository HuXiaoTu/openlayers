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
    </div>
</template>
<script>
import MapView from './views/mapView/mapView.vue';
import TopMenu from './views/components/topMenu/top.vue';
import LongitudinalBar from './views//components/toolBar/longitudinalBar.vue';

import { onMounted } from 'vue';
export default {
    components: {
        MapView,
        TopMenu,
        LongitudinalBar
    },
    setup() {
        onMounted(() => {
            // 动态设置 纵工具栏位置
            const longitudinal = document.querySelector('.longitudinal');
            // 选择需要观察变动的节点
            const targetNode = document.querySelector('.mapMenu');
            // 观察器的配置（需要观察什么变动）
            const config = { childList: true, };
            // 当观察到变动时执行的回调函数
            const callback = (mutationsList, observer) => {
                longitudinal.style.left = targetNode.clientWidth + 'px';
            };
            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver(callback);
            // 开始观察目标节点
            observer.observe(targetNode, config);
        })
    },
}

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
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
