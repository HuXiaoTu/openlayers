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
            <!-- 内容区域 -->
            <div class="mapContainer">
                <MapView></MapView>
            </div>
        </div>
    </div>
</template>

<script setup>
import TopMenu from './components/topMenu/top.vue';
import MapView from './views/mapView/mapView.vue';

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
        display: flex;
        flex-direction: column;
        .header {
            height: 60px;
        }
        .contentBox {
            flex: 1;
            position: relative;
            .mapMenu {
                width: 300px;
                height: 100%;
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
