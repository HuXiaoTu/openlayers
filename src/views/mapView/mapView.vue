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
<script>
import { initialMap } from '../../commonTool/mapDrawHandle/core/mapTool.js';
export default {
    mounted() {
        let map = initialMap('mapBox');
    }
}
</script>
<style lang="scss">
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