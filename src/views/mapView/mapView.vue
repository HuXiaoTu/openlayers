<template>
    <!-- 内容区域  -->
    <div class="mapShowIndexCont">
        <!-- 地图展示 -->
        <div
            id="mapBox"
            class="map"
        ></div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { mountMap } from '../../commonTool/mapDrawHandle/core/mapTool.js';

onMounted(() => {
    // 挂载map
    mountMap('mapBox');
})
</script>
<style lang="scss" scoped>
.mapShowIndexCont {
    width: 100%;
    height: 100%;
    overflow: hidden;

    #mapBox {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: rgb(163, 215, 236);
    }
}
</style>