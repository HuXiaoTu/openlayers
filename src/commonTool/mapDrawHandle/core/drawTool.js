import Draw from 'ol/interaction/Draw';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text, } from 'ol/style';
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
        this.draw = null;
        this.layer = VectorLayerDraw;
        this.imgClass = null;
        this.isAnimation = true;
    }

    // 设置layer
    setLayer(layer = VectorLayerDraw) {
        this.layer = layer;
        return this;
    }
    // 设置绘制图形
    setImg(imgClass) {
        this.imgClass = imgClass;
        return this;
    }
    // 初始化绘制程序
    initDraw({ type = 'Point', isAnimation = true }) {
        // 先获取当前显示地图备用
        this.map = getCurrentMap();
        // 如果有 清除上次 绘制交互
        this.clearInteraction();
        // 创建交互
        this.addInteraction(type, isAnimation);
    }

    // 创建交互
    addInteraction(type, isAnimation) {
        this.draw = new Draw({
            type,
            source: this.layer.getSource(),
        });
        // 自定义 交互类型 
        this.draw.set('custom', 'drawImgType');
        this.draw.on('drawend', (event) => {
            let feature = event.feature;
            feature.setStyle(this.initStyle(feature))
            if (isAnimation) this.flash(feature);
        })
        this.map.addInteraction(this.draw);
    }

    // 设置样式
    initStyle(f) {
        return []
    }

    // 清除交互
    clearInteraction(map = getCurrentMap()) {
        // 如果有 清除上次 绘制交互
        let drawList = map.getInteractions().getArray();
        let draw = drawList.find(ele => ele.get('custom') === 'drawImgType');
        if (draw) map.removeInteraction(draw);
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