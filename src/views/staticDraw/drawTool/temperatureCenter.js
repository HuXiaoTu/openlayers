import StyleTool from "../../../commonTool/mapDrawHandle/core/SymbolTool.js";
import DefaultOnlyDeleteMenu from "../../../commonTool/openlayerTool/menu/mailMenu.js";

// import BaseDrawPoint from "../../../utils/drawTool/BaseDrawPoint";
// import LeftRightDraw from "../../../utils/interacts/LeftRightDraw";
/**
 * @description 交互分析工具-温度中心
 */
export default class temperatureCenter extends BaseDrawPoint {
    constructor(layer) {
        super(layer);
        this.vector;//矢量图层
        this.featureType = 'TemperatureCenter';//符号类型 天气符号
        this.drawTool = new LeftRightDraw(this);//绘制交互工具
        this.showText = { left: 'W', right: 'C' };//显示的文本
        this.baseFontSize = 12;//基准字体大小
        this.styleData = {
            left: {
                color: '#ff0000',//颜色 默认红色
                size: 5,//符号大小
            },
            right: {
                color: '#0000ff',//颜色 默认蓝色
                size: 5,//符号大小
            }
        };
        this.clickType;//鼠标点击类型  left:左键  right:右键
        this.isNeedEndCall = false;//绘制结束后是否需要触发弹窗回调
    }


    initStyleData(styleData) {
        this.styleData = styleData || {
            left: {
                color: '#ff0000',//颜色 默认红色
                size: 5,//符号大小
            },
            right: {
                color: '#0000ff',//颜色 默认蓝色
                size: 5,//符号大小
            }
        };
        return this;
    }


    //设置鼠标点击类型
    setClickType(clickType) {
        this.clickType = clickType;
    }

    /**
     * @description 根据feature的styleData 计算样式初始化渲染feature
     * @param {ol/Feature} feature 
     */
    initStyle(feature) {
        this.feature = feature;
        this.initInteraction();
        feature.setStyle((feature) => this.getStyle(feature));
    }

    /**
     * @description 计算样式 尽量共用样式,节省内存
     * @param {*} feature 
     */
    getStyle(feature) {
        let showText = feature.get('showText');
        let clickType = feature.get('clickType');
        let styleData = feature.get('styleData');
        if (styleData) {
            this.styleData = styleData;
        }
        let option = {
            showText: showText,
            color: this.styleData[clickType].color,
            fontSize: this.baseFontSize,
            scale: this.getScaleValue(this.styleData[clickType].size)
        }
        return StyleTool.getPointTextStyle(option);
    }

    setLayer(layer) {
        this.vector = layer;
        this.drawTool.setLayer(layer);
        return this;
    }

    /**
     * 初始化菜单方法
     */
    getItemFunction() {
        return (contextmenu) => {
            new DefaultOnlyDeleteMenu(contextmenu);
        };
    }

}


