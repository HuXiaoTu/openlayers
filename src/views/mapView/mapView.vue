<template>
    <!-- 内容区域  -->
    <div class="mapShowIndexCont">
        <!-- 地图展示 -->
        <div id="mapBox"></div>
    </div>
</template>
<script>
import { initialMap } from '../../components/jsTool/mapTool.js'
export default {
    mounted() {
        let map = initialMap('mapBox');
        console.info('>>>> ws >>>⚡⚡ initialMap', map)
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
        #mouse-position {
            position: absolute;
            right: 5px;
            bottom: 10px;
            z-index: 10;
        }
    }
}
</style>