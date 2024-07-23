import Text from "ol/style/Text";
import { drawTool } from "../../core/drawTool";
import { Style, Circle as CircleStyle, Stroke } from "ol/style";


export class pointDraw extends drawTool {
    constructor() {
        super()
        this.duration = 3000;
        // 绘制图形
        this.imgClass = null;
    }
    // 设置绘制图形
    setImg(imgClass) {
        this.imgClass = imgClass;
        return this;
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