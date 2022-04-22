import Draw from 'ol/interaction/Draw';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text, } from 'ol/style';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';

import { VectorLayerDraw, getCurrentMap } from "./mapTool.js";

// 初始化 画笔
export class drawTool {
    constructor() {
        if (drawTool.instance) return drawTool.instance;
        this.draw = null;
        this.map = getCurrentMap();
        this.layer = VectorLayerDraw;
        this.imgClass = null;
        if (this.layer);
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
    initDraw({ type = 'Point' }) {
        // 如果有 清除上次 绘制交互
        this.clearInteraction();
        // 创建交互
        this.addInteraction(type);
    }

    // 创建交互
    addInteraction(type) {
        this.draw = new Draw({
            type,
            source: this.layer.getSource(),
        });
        // 自定义 交互类型 
        this.draw.set('custom', 'drawImgType');
        this.draw.on('drawend', (event) => {
            let feature = event.feature;
            feature.setStyle(this.initStyle(feature))
        })
        this.map.addInteraction(this.draw);
    }

    // 设置样式
    initStyle(f) {
        return []
    }

    // 清除交互
    clearInteraction() {
        // 如果有 清除上次 绘制交互
        let drawList = this.map.interactions.getArray();
        let draw = drawList.find(ele => ele.get('custom') === 'drawImgType');
        if (draw) this.map.removeInteraction(draw);
    }
}