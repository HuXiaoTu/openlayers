// 自定义 各符号的 点击、拖拽、移动等 事件
import Feature from 'ol/Feature.js';
import { LineString, Point, Polygon } from 'ol/geom.js';
import { Pointer as PointerInteraction } from 'ol/interaction.js';

import { createContextMenu } from '@/commonTool/commonUtil/domHandle';

// ---------------------------------------------------- 交互相关事件绑定------------------------------------------------
export class InteractionsMethods extends PointerInteraction {
    constructor() {
        super();
        // super({
        //     handleDownEvent: handleDownEvent,
        //     handleDragEvent: handleDragEvent,
        //     handleMoveEvent: handleMoveEvent,
        //     handleUpEvent: handleUpEvent,
        // });

        // 当前符号
        this.feature_ = null;
        // 当前符号的坐标点
        this.coordinate_ = null;
    }
    // 鼠标点击事件
    handleDownEvent(evt) {
        const map = evt.map;
        // 根据 当前坐标点 获取相匹配的符号
        const feature = map.forEachFeatureAtPixel(evt.pixel, moveFeature);
        if (feature) {
            this.coordinate_ = evt.coordinate;
            this.feature_ = feature;
        }
        return !!feature;
    }
    // 拖拽事件
    handleDragEvent(evt) {
        if (!this.feature_) return;
        // 获取鼠标点击时的坐标位置，减去当前坐标位置 = 将要移动的距离
        const deltaX = evt.coordinate[0] - this.coordinate_[0];
        const deltaY = evt.coordinate[1] - this.coordinate_[1];
        // 获取当前 符号 进行移动
        const geometry = this.feature_.getGeometry();
        geometry.translate(deltaX, deltaY);
        // 更新移动过后的坐标点为 当前坐标点
        this.coordinate_[0] = evt.coordinate[0];
        this.coordinate_[1] = evt.coordinate[1];
    }
    // 鼠标在地图上移动事件
    handleMoveEvent(evt) {
        const map = evt.map;
        const feature = map.forEachFeatureAtPixel(evt.pixel, moveFeature);
        const element = evt.map.getTargetElement();

        // 当鼠标移入符号上时 显示小手鼠标样式
        const cursor = feature?.get('f_function')?.cursor;
        if (feature && cursor) {
            if (element.style.cursor != cursor) element.style.cursor = cursor;
        }
        // 未移入到符号上时 显示默认鼠标样式
        else {
            element.style.cursor = 'auto';
        }
    }
    // 鼠标抬起事件
    handleUpEvent() {
        this.coordinate_ = null;
        this.feature_ = null;
        return false;
    }
}

// ---------------------------------------------------- 全局map相关事件绑定------------------------------------------------
export class MapMethods {
    constructor(map) {
        this.map = map;

        // 右键菜单注册
        this.contextMenu();
    }
    // 右键菜单注册
    contextMenu() {
        console.info('>>>> ws >>> 🐌💬 我注册了地图点击事件',)
        this.map.getViewport().addEventListener('contextmenu', (e) => {
            event.preventDefault(); // 阻止默认的右键菜单

            // let coordinate = this.map.getEventCoordinate(e);
            let pixel = this.map.getEventPixel(e);
            const feature = this.map.forEachFeatureAtPixel(pixel, feature => feature);
            if (!feature) return;

            let { clientY, clientX } = e;
            let styleCustom = {
                left: clientX + 'px',
                top: clientY + 'px',
            }
            let menuList = [
                {
                    icon: { name: '&#xe67a;', color: 'black', },
                    name: '菜单1',
                    callBack: () => { }
                }
            ]
            // 生成 自定义右键菜单
            createContextMenu(styleCustom, menuList);
        })
    }
}



















// ---------------------------------------------------- 功能函数------------------------------------------------
// 筛选可移动的feature图形
function moveFeature(feature) {
    let f_function = feature.get('f_function');
    if (f_function?.isMove) {
        // 如果未设置鼠标样式 设置移动的默认鼠标样式
        feature.set('f_function', Object.assign({ cursor: 'move' }, f_function));
        return feature;
    }
    return null;
}
