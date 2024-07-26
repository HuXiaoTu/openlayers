import { defineStore } from 'pinia';

import { Map, View } from 'ol';
import { Tile as TileLayer, Group as LayerGroup, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, OSM, XYZ } from "ol/source";
import { format } from "ol/coordinate";
import { fromLonLat } from 'ol/proj';
import MousePosition from "ol/control/MousePosition.js";
import { DragRotateAndZoom, defaults as defaultInteractions, } from 'ol/interaction';
import { FullScreen, ScaleLine, defaults as defaultControls, OverviewMap } from 'ol/control';

// 图层------------------------------------------------------------------
// 矢量图层
const VectorLayerDraw = new VectorLayer({
    renderMode: "image",
    source: new VectorSource({ wrapX: false }),
});
// 地图图层 XYZ
const XYZlayer = new TileLayer({
    source: new XYZ({
        attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' + 'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        // 解决图片跨域问题
        crossOrigin: "Anonymous",
        // 当加载出错时 使用临时磁贴
        useInterimTilesOnError: true,
    }),
})
// 地图图层 OSM
const OSMlayer = new TileLayer({
    source: new OSM({
        // 解决图片跨域问题
        crossOrigin: "Anonymous",
    }),
})

// 图层组-----------------------------------------------------------------
// 底图基础信息图层集合
const baseOverlayGroup = new LayerGroup({
    groupName: "baseOverlayGroup",
    zIndex: 200,
    layers: [XYZlayer]
});
// 数据图层集合
const dataOverlayGroup = new LayerGroup({
    groupName: "dataOverlayGroup",
    zIndex: 300,
    layers: [VectorLayerDraw]
});


export const useMap = defineStore({
    id: 'map',
    state: () => {
        return {
            // 数据图层集合
            dataOverlayGroup,
            // 底图基础信息图层集合
            baseOverlayGroup,

            // 底图相关图层
            XYZlayer,
            OSMlayer,
        }
    },
    actions: {
        // 获取数据图层组
        getDataGroup: function () {
            return this.dataOverlayGroup;
        },
        // 获取数据图层列表
        getDataLayers: function () {
            return this.dataOverlayGroup.getLayers().getArray();
        },
        // 追加数据图层
        addDataLayer: function (layer, name = '') {
            let layer = VectorLayerDraw;
            if (name) layer.set('name', name);
            this.dataOverlayGroup.getLayers().getArray().push(layer);
        }

        // 获取底图图层组
        getBaseGroup: function () {
            return this.baseOverlayGroup;
        },

    }
})
