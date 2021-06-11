import Draw from 'ol/interaction/Draw';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, Text, } from 'ol/style';

import { VectorLayerDraw, getCurrentMap } from "../mapTool";
import { Feature } from 'ol';
import Point from 'ol/geom/Point';

// 初始化 画笔
export class drawTool {
    constructor() {
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
        console.info('>>>> ws >>>⚡⚡ this.map', this.map.interactions.getArray())
        if (this.draw) this.map.removeInteraction(this.draw);
        // 创建交互
        this.addInteraction(type);
    }

    // 创建交互
    addInteraction(type) {
        this.draw = new Draw({
            type,
            source: this.layer.getSource(),
        });
        this.draw.on('drawend', (event) => {
            let feature = event.feature;
            feature.setStyle(this.initStyle(feature))
        })
        this.map.addInteraction(this.draw);
    }

    // 设置样式
    initStyle(f) {
        return [
            new Style({
                // fill: new Fill({
                //     color: 'rgba(255, 255, 255, 0.2)',
                // }),
                // stroke: new Stroke({
                //     color: '#ffcc33',
                //     width: 2,
                // }),
                // image: new CircleStyle({
                //     radius: 7,
                //     fill: new Fill({
                //         color: '#ffcc33',
                //     }),
                // }),

                text: new Text({
                    font: '20px myIcon',
                    text: this.imgClass
                }),
            }),
        ]
    }

    // 清除交互
    clearInteraction() {
        // 如果有 清除上次 绘制交互
        if (this.draw) this.map.removeInteraction(this.draw);
    }
}