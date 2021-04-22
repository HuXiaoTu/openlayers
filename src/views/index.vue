<template>
    <!-- 地图展示 -->
    <div class="mapShowIndex">
        <!-- 侧边栏 -->
        <div class="mapShowIndexLeft"></div>
        <!-- 内容区域 -->
        <div class="mapShowIndexCont">
            <div id="mapBox">
                <!-- 经纬度坐标显示 -->
                <div id="mouse-position"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { Map, View } from 'ol';
import { format } from "ol/coordinate";
import OSM from 'ol/source/OSM';
import { TileWMS } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import MousePosition from "ol/control/MousePosition.js";

// import Map from 'ol/Map';
// import View from 'ol/View';
import 'ol/ol.css';
import MVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { get as getProjection } from 'ol/proj';

export default {

    mounted() {
        //鼠标经过显示经纬度
        let mousePositionControl = new MousePosition({
            coordinateFormat: (coordinate) => {
                return format(coordinate, "经度:{x}     纬度:{y}", 2);
            },
            projection: "EPSG:4326",
            target: 'mouse-position',
        });


        var key = 'Your Mapbox access token from https://mapbox.com/ here';

        // Calculation of resolutions that match zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
        var resolutions = [];
        for (var i = 0; i <= 8; ++i) {
            resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
        }
        // Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
        function tileUrlFunction(tileCoord) {
            return (
                'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
                '{z}/{x}/{y}.vector.pbf?access_token=' +
                key
            )
                .replace('{z}', String(tileCoord[0] * 2 - 1))
                .replace('{x}', String(tileCoord[1]))
                .replace('{y}', String(tileCoord[2]))
                .replace('{a-d}', 'abcd'.substr(((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4, 1));
        }

        new Map({
            layers: [
                new VectorTileLayer({
                    source: new VectorTileSource({
                        attributions:
                            '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
                            '© <a href="https://www.openstreetmap.org/copyright">' +
                            'OpenStreetMap contributors</a>',
                        format: new MVT(),
                        tileGrid: new TileGrid({
                            extent: getProjection('EPSG:3857').getExtent(),
                            resolutions: resolutions,
                            tileSize: 512,
                        }),
                        tileUrlFunction: tileUrlFunction,
                    }),
                    style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text),
                })],
            target: 'mapBox',
            view: new View({
                center: [0, 0],
                minZoom: 1,
                zoom: 2,
            }),
        });

        // new Map({
        //     layers: [
        //         // new TileLayer({ source: new OSM() }),       // 地图图层
        //         new TileLayer({
        //             source: new TileWMS({
        //                 url: 'http://10.2.17.102:8080/geoserver/camfp/wms',
        //                 params: {
        //                     FORMAT: 'image/png',
        //                     tiled: true,
        //                     LAYERS: '110m_coastline',
        //                     STYLES: 'camfp:polygon_black_hd'
        //                 },
        //                 crossOrigin: 'anonymous', //支持跨域请求,
        //                 wrapX: true
        //             }),
        //             layerType: 'baseMap',
        //             name: '高清黑白底图',
        //             zIndex: 0
        //         })
        //     ],
        //     view: new View({
        //         projection: 'EPSG:4326',                    // 投影类型
        //         center: [100, 38],                          // 地图中心点经纬度
        //         zoom: 5,                                    // 地图缩放级别         
        //     }),
        //     controls: [mousePositionControl],               // 插件导入
        //     target: 'mapBox'
        // });
    }
}
</script>
<style lang="scss">
.mapShowIndex {
    width: 100%;
    height: 100%;
    display: flex;
    .mapShowIndexLeft {
        width: 300px;
        height: 100%;
    }
    .mapShowIndexCont {
        flex: 1;
        #mapBox {
            width: 100%;
            height: 100%;
        }
    }
}
</style>