import Draw from 'ol/interaction/Draw';
import DragPan from 'ol/interaction/DragPan.js';

import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle as CircleStyle, Stroke, Style } from 'ol/style';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { getVectorContext } from 'ol/render.js';
import { VectorLayerDraw, getCurrentMap } from "./mapTool.js";
import { easeOut } from 'ol/easing';
import { unByKey } from 'ol/Observable';


// 初始化 画笔
export class drawTool {
    constructor() {
        this.map = null;
        if (drawTool.instance) return drawTool.instance;
        // 绘制交互
        this.draw = null;
        // 绘制图层
        this.layer = VectorLayerDraw;
        // 是否需要绘制动画
        this.isAnimation = true;
    }
    // 设置layer
    setLayer(layer = VectorLayerDraw) {
        this.layer = layer;
        return this;
    }
    /**
     * 初始化绘制画笔
     * @param {*}  type         绘制类型：点、线、圆等
     * @param {*}  isAnimation  是否开启绘制完成的动画效果
     * @param {*}  callback     绘制完成后的回调
     */
    initDraw({ type = 'Point', isAnimation = true, callback = null }) {
        // 先获取当前显示地图备用
        this.map = getCurrentMap();
        // 创建 自定义交互
        this.addInteraction({ type, isAnimation, callback });
    }
    // 创建 自定义交互
    addInteraction({ type, isAnimation, callback = null }) {
        this.draw = new Draw({
            type,
            source: this.layer.getSource(),
            // 停止在绘图期间触发点击、单击和双击事件
            stopClick: true,
        });

        // 设置 自定义交互类型 
        this.draw.set('custom', 'drawImgType');

        this.draw.on('drawend', (event) => {
            let feature = event.feature;
            // 设置 绘制图形样式
            if (typeof this.initStyle === 'function') feature.setStyle(this.initStyle(feature));
            // 设置 添加动画
            if (isAnimation === true) this.flash(feature);
            // 回调
            if (typeof callback === 'function') callback(feature);
        })
        this.map.addInteraction(this.draw);
    }
    // 添加动画功能
    flash(feature) {
        const start = Date.now();
        const flashGeom = feature.getGeometry().clone();

        let animate = (event) => {
            const frameState = event.frameState;
            const elapsed = frameState.time - start;
            if (elapsed >= this.duration) {
                unByKey(listenerKey);
                return;
            }
            const vectorContext = getVectorContext(event);
            const elapsedRatio = elapsed / this.duration;
            const radius = easeOut(elapsedRatio) * 25 + 5;
            const opacity = easeOut(1 - elapsedRatio);

            const style = new Style({
                image: new CircleStyle({
                    radius: radius,
                    stroke: new Stroke({
                        color: 'rgba(255, 0, 0, ' + opacity + ')',
                        width: 0.25 + opacity,
                    }),
                }),
            });

            vectorContext.setStyle(style);
            vectorContext.drawGeometry(flashGeom);
            this.map.render();
        }
        const listenerKey = this.layer.on('postrender', animate);
    }
}

/**
 * 交互切换(清除当前自定义绘制交互)
 * @param {*} map    当前交互地图实例
 * @param {*} active 开启||关闭 当前地图操作交互 不传默认不操作 
 */
export const switchInteraction = ({ map = getCurrentMap(), active = null }) => {
    // 获取当前地图 所有交互
    let drawList = map.getInteractions().getArray();

    // 如果有 清除上次 自定义交互类型
    let draw = drawList.find(ele => ele.get('custom') === 'drawImgType');
    if (draw) map.removeInteraction(draw);

    // 禁用 地图操作
    if (typeof active === 'boolean') drawList.forEach(ele => {
        // 禁用 拖拽
        if (ele instanceof DragPan) ele.setActive(active);
    });
}