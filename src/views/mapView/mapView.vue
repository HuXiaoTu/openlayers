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
    flex: 1;
    #mapBox {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #000000;
        #mouse-position {
            position: absolute;
            right: 5px;
            bottom: 10px;
            z-index: 10;
        }
    }
}
</style>