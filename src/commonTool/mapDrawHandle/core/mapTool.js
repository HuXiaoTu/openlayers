import { Map, View } from 'ol';
import { OSM, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from "ol/source";

import { format } from "ol/coordinate";
import { fromLonLat } from 'ol/proj';

import MousePosition from "ol/control/MousePosition.js";
import { DragRotateAndZoom, defaults as defaultInteractions, } from 'ol/interaction';
import { FullScreen, ScaleLine, defaults as defaultControls, OverviewMap } from 'ol/control';

import { InteractionsMethods, MapMethods } from './map_methods.js';

import { reactive, ref } from 'vue';


let map = null;
let view = null;
// 当前激活图层
let defaultLayer = VectorLayerData();
let activeLayerId = ref(defaultLayer.ol_uid);

// 图层------------------------------------------------------------------
// 矢量图层
function VectorLayerData(name = '') {
    return new VectorLayer({
        name,
        renderMode: "image",
        source: new VectorSource({ wrapX: false }),
    });
}
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
export const baseOverlayGroup = new LayerGroup({
    groupName: "baseOverlayGroup",
    zIndex: 200,
    layers: [XYZlayer]
});
// 数据绘制图层集合
export const dataOverlayGroup = reactive(new LayerGroup({
    groupName: "dataOverlayGroup",
    zIndex: 300,
    layers: [defaultLayer]
}));

// 地图插件---------------------------------------------------------------
// 按住Shift+Drag以围绕其中心旋转和缩放地图
const dragRotateAndZoomControl = () => {
    return new DragRotateAndZoom();
}
// 自定义 各符号的 点击、拖拽、移动等 交互事件
const interactions_methods = () => {
    return new InteractionsMethods();
}
// 自定义 各符号的 点击、拖拽、移动等 交互事件
const map_methods = (map) => {
    return new MapMethods(map);
}
//鼠标经过显示经纬度
const mousePositionControl = ({ target }) => {
    let parentDom = target;
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
        layers: [OSMlayer],
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
    })
}
//  全屏
const fullScreenControl = ({ target }) => {
    return new FullScreen({
        target,
        className: 'customBtn',
        tipLabel: '全屏'
    })
}

// 初始化---------------------------------------------------------------
// 初始化地图
export const initialMap = () => {
    let mapConfig = gbMap.mapConfig;
    view = new View({
        projection: 'EPSG:3857',                                // 投影类型
        center: fromLonLat(mapConfig.center, 'EPSG:3857'),      // 地图中心点经纬度
        zoom: mapConfig.zoom,                                   // 地图缩放级别         
        minZoom: mapConfig.minZoom,
        // extent: fromLonLat(boundingExtent([[0, 180], [180, -180]]), 'EPSG:3857'),    // 设置投影范围
        // extent: transformExtent([-30, -70, 180, 180], 'EPSG:4326', 'EPSG:3857'),    // 设置投影范围
    })

    map = new Map({
        layers: [baseOverlayGroup, dataOverlayGroup],
        view,
    });

    console.info('>>>> ws >>> 🐌💬 地图初始化完成，未挂载');
    return map;
}
/** 挂载 map
 * @param {*} target 目标Dom
 */
export const mountMap = (target = null) => {
    if (!target) return;

    // 组件 按钮追加到指定 dom
    let targetDom = document.querySelector('.longitudinalBarCenter');
    // 经纬度显示 追加到 指定 dom
    let targetDomLonLat = document.querySelector(`#${target}`);

    // 挂载map
    map.setTarget(target);
    console.info('>>>> ws >>> 🐌💬 地图挂载完成');

    // 插件注册
    let controls = [overviewMapControl(), mousePositionControl({ target: targetDomLonLat }), scaleLineControl(), fullScreenControl({ target: targetDom })]
    controls.forEach(ele => map.addControl(ele));

    // 交互事件注册
    let interactions = [dragRotateAndZoomControl(), interactions_methods()];
    // let interactions = [dragRotateAndZoomControl()];
    interactions.forEach(ele => map.addInteraction(ele));

    // map相关事件注册
    map_methods(map);
}


// 公共函数---------------------------------------------------------------
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
    return getCurrentMap().getView();
};
/**
* @description 获取当前地图投影code
* @returns 当前地图投影code
*/
export function getCurrentProjCode(mapObj = getCurrentMap()) {
    if (mapObj) mapObj?.getView()?.getProjection()?.getCode();
}

/**
 * 添加 图层
 * @param {*} name 图层名称
 */
export const addLayer = (name = '') => {
    let layer = VectorLayerData(name);
    dataOverlayGroup.getLayers().getArray().push(layer);
}
// 删除 图层
export const delLayer = (layer) => {
    if (!layer) return;
    if (layer.ol_uid === activeLayerId.value) return gbSa.error('无法删除当前激活图层');
    let layers = dataOverlayGroup.getLayers().getArray();
    let index = layers.findIndex(ele => ele.ol_uid === layer.ol_uid);
    if (index !== -1) dataOverlayGroup.getLayers().getArray().splice(index, 1);
    // 刷新地图
    map.render();
}

// 设置指定图成为 激活图层
export function setActiveLayerId(id) {
    activeLayerId.value = id;
    console.info('>>>> ws >>> 🐌💬 activeLayerId ', activeLayerId.value)
}
// 获取 激活图层
export function getActiveLayer() {
    let arr = dataOverlayGroup.getLayers().getArray();
    let layer = arr.find(ele => ele.ol_uid === activeLayerId.value);
    return layer;
}

export { activeLayerId }