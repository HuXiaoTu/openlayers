import { Map, View } from 'ol';
import { format } from "ol/coordinate";
import { OSM, Stamen, XYZ } from 'ol/source';
import { TileWMS } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import MousePosition from "ol/control/MousePosition.js";
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from "ol/source";

import { boundingExtent } from 'ol/extent';
import { fromLonLat, transformExtent } from 'ol/proj';


let map = null;
let view = null;

// 矢量图层
export const VectorLayerShow = new VectorLayer({
    renderMode: "image",
    source: new VectorSource({ wrapX: false }),
});


// 底图图层集合
export const dataOverlayGroup = new LayerGroup({
    groupName: "dataOverlayGroup",
    zIndex: 200,
    layers: [
        // new TileLayer({
        //     source: new TileWMS({
        //         url: 'http://10.2.17.102:8080/geoserver/camfp/wms',
        //         params: {
        //             FORMAT: 'image/png',
        //             tiled: true,
        //             LAYERS: '110m_coastline',
        //             STYLES: 'camfp:polygon_black_hd'
        //         },
        //         crossOrigin: 'anonymous', //支持跨域请求,
        //         wrapX: true
        //     }),
        //     layerType: 'baseMap',
        //     name: '高清黑白底图',
        //     zIndex: 0
        // })

        // 地图图层
        // new TileLayer({ source: new OSM() }),       
        // new TileLayer({source: new Stamen({ layer: 'toner', })}),
        new TileLayer({
            source: new XYZ({
                attributions:
                    'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                    'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                url:
                    'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                    'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                // 解决图片跨域问题
                crossOrigin: "Anonymous",
            }),
        })
    ]
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



/**
 * 初始化地图 
 * @param {*} target 目标Dom
 */
export const initialMap = (target = '') => {
    if (!target) return;

    //鼠标经过显示经纬度
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
    // let maxExtent = boundingExtent([[180, 90], [-180, -90]]);
    let maxExtent = boundingExtent([[0, 80], [120, -80]]);
    view = new View({
        projection: 'EPSG:4326',                    // 投影类型
        center: [100, 38],                          // 地图中心点经纬度
        zoom: 5,                                    // 地图缩放级别         
        minZoom: 3.5,
        extent: fromLonLat(maxExtent, 'EPSG:4326')
    })

    return map = new Map({
        layers: [dataOverlayGroup, dataOverlayDisplayGroup, dataOverlayDrawGroup],
        view,
        controls: [mousePositionControl],               // 插件导入
        target: 'mapBox'
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
export function getCurrentProjCode(map) {
    if (map) {
        return map.getView().getProjection().getCode();
    }
    return getCurrentMap().getView().getProjection().getCode();
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