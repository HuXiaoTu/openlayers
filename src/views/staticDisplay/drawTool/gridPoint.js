
import CommonUtils from '../../../components/jsTool/CommonUtils.js';
import GridValue from '../../../components/jsTool/drawTool/GridValue.js';
/**
 * @description 绘制格点值
 */
export default class gridPoint extends GridValue {
    constructor() {
        super();
        this.featureType = 'gridPoint';//设置类型
        //风的格点值要素名称后端统一为u v 
        this.patternElementName = ['u', 'v'];
    }

    //子类继承后复写该方法,组织要显示的文字内容
    getShowText(element) {
        let sum = 0;
        for (let key of this.patternElementName) {
            sum += Number(element[key]) ** 2;
        }
        // 过滤无效数据
        if (Number.isNaN(Number(sum))) return "";
        if (Math.abs(Number(sum)) > 1000000) return "";
        return CommonUtils.round(Math.sqrt(sum), this.roundSize, "string");
    }

}
