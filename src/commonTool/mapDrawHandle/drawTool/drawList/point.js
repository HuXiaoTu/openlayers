import Text from "ol/style/Text";
import { drawTool } from "../../core/drawTool";

import { Style, Circle as CircleStyle, Stroke } from "ol/style";
import { easeOut } from 'ol/easing';
import { unByKey } from 'ol/Observable';

export class pointDraw extends drawTool {
    constructor() {
        super()
        this.duration = 3000;
    }
    flash(feature) {
        const start = Date.now();
        const flashGeom = feature.getGeometry().clone();
        let animate = (event) => {
            console.info('>>>> ws >>> 🐌💬 触发动画执行',)
            const frameState = event.frameState;
            const elapsed = frameState.time - start;
            if (elapsed >= this.duration) return unByKey(listenerKey);
            const vectorContext = event.vectorContext;
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
        const listenerKey = this.map.on('postcompose', animate);
    }
    initStyle() {
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
}