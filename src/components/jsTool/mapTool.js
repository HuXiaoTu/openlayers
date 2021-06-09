import 'ol/ol.css';
import { Map, View } from 'ol';
import { OSM, Stamen, XYZ } from 'ol/source';
import { TileWMS } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from "ol/source";

import Stroke from 'ol/style/Stroke';

import { format } from "ol/coordinate";
import { boundingExtent } from 'ol/extent';
import { fromLonLat, transformExtent } from 'ol/proj';

import MousePosition from "ol/control/MousePosition.js";
import { DragRotateAndZoom, defaults as defaultInteractions, } from 'ol/interaction';
import { FullScreen, ScaleLine, OverviewMap, defaults as defaultControls } from 'ol/control';

import { mapConfig } from '../commonSetting/config';


let map = null;
let view = null;

// 图层------------------------------------------------------------------
// 矢量图层
export const VectorLayerShow = new VectorLayer({
    renderMode: "image",
    source: new VectorSource({ wrapX: false }),
});
// 地图图层 XYZ
export const XYZlayer = new TileLayer({
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
export const OSMlayer = new TileLayer({
    source: new OSM({
        // 解决图片跨域问题
        crossOrigin: "Anonymous",
    }),
})


// 图层组-----------------------------------------------------------------
// 底图图层集合
export const dataOverlayGroup = new LayerGroup({
    groupName: "dataOverlayGroup",
    zIndex: 200,
    layers: [XYZlayer]
});
// 数据展示图层集合
export const dataOverlayDisplayGroup = new LayerGroup({
    groupName: "dataOverlayDisplayGroup",
    zIndex: 200,
    layers: [VectorLayerShow]
});
// 数据绘制图层集合
export const dataOverlayDrawGroup = new LayerGroup({
    groupName: "dataOverlayDrawGroup",
    zIndex: 300,
});

// 地图插件---------------------------------------------------------------
// 按住Shift+Drag以围绕其中心旋转和缩放地图
const dragRotateAndZoomControl = () => {
    return new DragRotateAndZoom({
        className: 'dragRotateAndZoom',
    })
}
//鼠标经过显示经纬度
const mousePositionControl = (target) => {
    let parentDom = document.querySelector(`#${target}`);
    let lonLatShowDom = document.createElement('div');
    lonLatShowDom.setAttribute('id', 'mouse-position');
    parentDom.appendChild(lonLatShowDom);
    let mousePositionControl = new MousePosition({
        coordinateFormat: (coordinate) => {
            return format(coordinate, "经度:{x}     纬度:{y}", 2);
        },
        projection: "EPSG:4326",
        target: 'mouse-position',
    });
    return mousePositionControl
}
// 可视化小窗
const overviewMapControl = () => {
    return new OverviewMap({
        className: 'ol-overviewmap ol-custom-overviewmap',
        layers: [XYZlayer],
        collapseLabel: '\u00BB',
        label: '\u00AB',
        collapsed: false,
        rotateWithView: true,
    });
}
//  比例尺
const scaleLineControl = () => {
    // metric       ——    通用的，以千米为单位
    // us           ——    美国单位
    // nautical     ——    航海单位
    // imperial     ——    英制单位
    // degrees      ——    以度、分、秒为单位
    return new ScaleLine({
        units: 'metric',
        bar: true,
        steps: 4
    })
}
//  全屏
const fullScreenControl = () => {
    // metric    ——    通用的，以千米为单位
    // us    ——    美国单位
    // nautical    ——    航海单位
    // imperial    ——    英制单位
    // degrees    ——    以度、分、秒为单位
    return new FullScreen()
}


/**
 * 初始化地图 
 * @param {*} target 目标Dom
 */
export const initialMap = (target = '') => {
    if (!target) return;

    view = new View({
        projection: 'EPSG:3857',                                // 投影类型
        center: fromLonLat(mapConfig.center, 'EPSG:3857'),      // 地图中心点经纬度
        zoom: mapConfig.zoom,                                   // 地图缩放级别         
        minZoom: mapConfig.minZoom,
        // extent: fromLonLat(boundingExtent([[0, 180], [180, -180]]), 'EPSG:3857'),    // 设置投影范围
        // extent: transformExtent([-30, -70, 180, 180], 'EPSG:4326', 'EPSG:3857'),    // 设置投影范围
    })

    return map = new Map({
        layers: [dataOverlayGroup, dataOverlayDisplayGroup, dataOverlayDrawGroup],
        view,
        target: 'mapBox',
        // 插件注册
        controls: defaultControls().extend([overviewMapControl(), mousePositionControl(target), scaleLineControl(), fullScreenControl()]),
        // 按住Shift+Drag以围绕其中心旋转和缩放地图
        interactions: defaultInteractions().extend([dragRotateAndZoomControl()]),
    });
}

/**
 *获取当前map 
 */
export const getCurrentMap = () => {
    return map;
};
/**
 *获取当前view 
 */
export const getCurrentView = () => {
    return view;
};

/**
* @description 获取当前地图投影code
* @returns 当前地图投影code
*/
export function getCurrentProjCode(map = null) {
    if (map) {
        return map.getView().getProjection().getCode();
    }
    return getCurrentMap().getView().getProjection().getCode();
}

/**
 * 给入经纬度坐标点 返回当前投影坐标点
 * @param {*} coordinate 经纬度坐标点
 * @returns 当前投影坐标点
 */
export function currentProjCodefromLonLat(coordinate) {
    return fromLonLat(coordinate, getCurrentProjCode())
}

/**
* @description 清空 绘制图层数据
*/
export const clearMapDraw = () => {
    let groupObj = map.getLayerGroup();
    let groupList = groupObj.getLayers();
    let groupArray = groupList.getArray();
    // 循环所有 group
    groupArray.forEach(ele => {
        let name = ele.get('groupName');
        // 跳过 底图 group
        if (name === 'dataOverlayGroup') return;
        let arr = ele.getLayersArray();
        // 跳过空 group
        if (arr.length === 0) return;
        // 获取group 所有layer 执行 清空layer操作
        arr.forEach(item => item.getSource().clear());
    });
}