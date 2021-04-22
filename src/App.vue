<template>
    <!-- 主页 -->
    <div class="homePage">
        <!-- 导航栏 -->
        <div class="header">
            <TopMenu></TopMenu>
        </div>
        <!-- 内容部分 -->
        <router-view class="contentBox"></router-view>
    </div>
</template>

<script setup>
import TopMenu from './components/topMenu/top.vue';

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
        }
    }
}
</style>
