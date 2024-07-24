import Text from "ol/style/Text";
import { drawTool } from "../../core/drawTool";
import { Style, Circle as CircleStyle, Stroke, Icon } from "ol/style";

export class pointDraw extends drawTool {
    constructor() {
        super()
        this.duration = 3000;
        // 绘制图形
        this.UnicodeIcon = null;
    }
    // 设置绘制图形
    setUnicodeIcon(fontUnicode) {
        fontUnicode = parseInt(fontUnicode, 16);
        this.UnicodeIcon = String.fromCharCode(fontUnicode);
        return this;
    }
    /**
     * 初始化绘制画笔
     * @param {*}  type         绘制类型：点、线、圆等
     * @param {*}  isAnimation  是否开启绘制完成的动画效果
     * @param {*}  callback     绘制完成后的回调
     */
    initDraw({ type = 'Point', isAnimation = true }) {
        // 创建 自定义交互
        this.addInteraction({
            type, isAnimation, callback: feature => {
                // 将点类符号 设置为可移动类型
                feature.set('f_function', { isMove: true }, false);
            }
        });
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
                    text: this.UnicodeIcon,
                }),
            }),
        ]
    }
}