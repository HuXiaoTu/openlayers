
import GeoJSON from "ol/format/GeoJSON";
import { Stroke, Style } from "ol/style";
import { getData } from '../../../axios/axios/axiosList.js';
import { getCurrentProjCode } from "../../../components/jsTool/mapTool.js";
import CommonUtils from '../../../components/jsTool/CommonUtils.js';
import FeatureTool from "../../../components/jsTool/FeatureTool.js";
import { transFeatureByProj } from "../../../components/jsTool/SymbolTool.js";
/**
 * @description 绘制等值线
 */
// https://cn.pornhub.com/

export default class isoLine {
    constructor() {
        this.layer;//等值线所在图层
        this.type;//需要展示的类型,默认不指定  Temperature:温度 
        this.featureType = 'isoLine';
        this.geoJSON = new GeoJSON();//解析geojson对象工具
        // this.data = null;//等值线数据 json对象
        // this.features = [];//等值线所有的feature
        this.layerData = null;//请求等值线数据
        this.styleData = null;
        this.ranges;//指定等值线的值列表
        this.roundSize = 0;//保留的小数位数

        // 初始化样式配置
        this.initStyleData();
    }

    // 设置保留的小数位数
    setRoundSize(roundSize) {
        this.roundSize = roundSize;
        return this;
    }

    /**
     * @description 设置等值线界面交互属性
     * @param {*} styleData  等值线界面交互属性 
     */
    setStyleData(styleData) {
        this.styleData = styleData;
        if (this.layer && this.layer.getSource()) {
            this.layer.getSource().refresh();
        }
        return this;
    }
    /**
     * @description 初始化默认样式
     */
    initStyleData(styleData) {
        this.styleData = styleData || {
            minRange: 200, maxRange: 300, step: 5, //最小值 最大值 间隔
            range: "appoint",//取值方式 appoint代表直接用appointList指定的值,其余的类型用minRange maxRange step做计算
            appointList: [],
            width: 1,//线宽
            dash: [],//实线
            color: 'black',
            size: 12,//字号
            align: ['center']//对齐方式 center left  right  both
        };
        return this;
    }
    /**
     * @description 请求 等值线 数据
     * @param {String} layerData  请求数据
     */
    setLayerData(layerData) {
        this.layerData = layerData;
        return this;
    }
    /**
     * @description 设置 等值线 数据
     */
    setData() {
        return this;
    }

    /**
     * @description 根据接口查询到的json数据筛选组装features
     */
    readFeatures(data) {
        let features = [];//清空features
        let geoFeatures = this.geoJSON.readFeatures(data);
        if (!geoFeatures || geoFeatures.length == 0) {
            console.error(`未获取到等值线数据~`);
            return features;
        }
        geoFeatures.forEach(element => {
            //经纬度转化为地图坐标
            transFeatureByProj(element, 'EPSG:4326', getCurrentProjCode());
            element.setProperties({ featureType: this.featureType }, true);
            element.setProperties({ selected: false }, true);
            FeatureTool.setFeatureNotDragable(element);//设置不可拖动
            features.push(element);
        });
        return features;
    }


    /**
     * @description 查询等值线数据
     */
    requestFeatures() {
        return new Promise((resolve, reject) => {
            getData('/isoLine').then(res => {
                let data = JSON.stringify(res);
                let features = this.readFeatures(data);
                resolve(features);
            }).catch((err) => reject(err))
        })
    }
    //设置features的样式
    initStyle(feature) {
        feature.setStyle((feature) => this.getStyle(feature));
    }
    //清空图层
    clear() {
        this.layer.getSource().clear();
        return this;
    }
    //请求数据、解析为features，并将features添加显示在layer上
    show(type) {
        this.type = type;//需要展示的类型，默认可不传，目前仅有温度类型的
        this.initFeatures().then(features => {
            if (!features || features.length == 0) return;
            this.clear();
            this.layer.getSource().addFeatures(features);
        });
    }

    //初始化feature和样式
    initFeatures() {
        return new Promise((resolve, reject) => {
            this.requestFeatures()
                .then(features => {
                    if (features && features.length > 0) {
                        features.forEach(f => this.initStyle(f));
                    }
                    resolve(features);
                }).catch(err => reject(err))
        });
    }

    //刷新图层 删除原features 重新添加到图层上
    refresh() {
        return new Promise((resolve) => {
            this.requestFeatures().then(() => {
                this.show();
                resolve(this);
            })
        })
    }
    /**
     * @description 计算等值线样式
     * @param {*} feature 
     */
    getStyle(feature) {
        let styles = new Array();
        // 判断鼠标是否悬浮
        let isMovingOn = feature.get("is_moving_on");
        let color = this.styleData.color;
        if (isMovingOn) {
            color = color != "#FF0000" ? "#FF0000" : "#00FF00";
        }
        styles.push(
            new Style({
                stroke: new Stroke({
                    color,
                    width: this.styleData.width,
                    lineDash: this.styleData.dash
                })
            })
        );
        if (!this.styleData || !this.styleData.align) return styles;
        //计算等值线标值的位置 
        let showText = feature.get('Counter').toString(); //文本内容
        //如果是温度 并且单位是开氏度,需要转换为摄氏度 并保留两位小数
        if (this.type == 'Temperature' && !isNaN(Number(showText)) && Number(showText) > 200) {
            showText = Number(showText) - 273.15;
        }
        showText = Number.isNaN(Number(showText)) ? "" : CommonUtils.round(showText, this.roundSize, 'string');
        //样式参数
        let option = {
            feature: feature,
            align: this.styleData.align,
            showText: showText,
            color,
            fontSize: this.styleData.size,
        };
        // let style = StyleTool.getContourLineMarkStyle(option);
        // return styles.concat(style);
        return styles;
    }
}