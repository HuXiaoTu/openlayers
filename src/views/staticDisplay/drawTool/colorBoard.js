import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style } from "ol/style";

import { getData } from '../../../axios/axios/axiosList.js';
import { getCurrentProjCode } from "../../../components/jsTool/mapTool.js";
import FeatureTool from "../../../components/jsTool/FeatureTool.js";
import { transFeatureByProj } from "../../../components/jsTool/SymbolTool.js";

/**
 * @description 绘制色斑图
 */


const baseMax = 100000;//色斑图最多间隔数
const baseMin = 1;//色斑图最少间隔数

export default class colorBoard {
    /**
     * @description 数值预报-色斑图构造方法
     * @param {ol.layer.Base} layer 需要显示色斑图的图层
     */
    constructor() {
        this.layer;//色斑图所在图层
        this.type;//需要展示的类型,默认不指定  Temperature:温度 
        this.featureType = 'Contour';
        this.geoJSON = new GeoJSON();//解析geojson对象工具
        this.layerData = null;//请求色斑图数据
        this.styleData = null;
        this.ranges;//指定色斑图的值列表
    }
    /**
     * @description 设置色斑图界面交互属性
     * @param {*} styleData  色斑图界面交互属性 
     */
    setStyleData(styleData) {
        this.styleData = styleData;
        if (this.layer && this.layer.getSource()) {
            this.layer.getSource().refresh();
        }
        return this;
    }

    /**
     * 获取配置信息交互属性  
     * @param {*} colorId 色斑图配置id
     */
    getSettingData(data) {
        return new Promise((resolve, reject) => {
            // 请求新的色例配置
            getData('/getColorList').then(res => {
                resolve(res)
            })
        })

    }

    /**
     * @description 设置 色斑图 数据
     * @param {String} layerData  数据
     */
    setLayerData(layerData) {
        this.layerData = layerData;
        return this;
    }
    /**
     * @description 设置  数据
     * @param {String} data  请数据
     */
    setData(data) {
        return this;
    }

    /**
     * @description 根据接口查询到的json数据筛选组装features
     */
    readFeatures(data) {
        let features = [];//清空features
        let geoFeatures = this.geoJSON.readFeatures(data);
        if (!geoFeatures || geoFeatures.length == 0) {
            console.error(`未获取到色斑图数据~`);
            return features;
        }
        geoFeatures.forEach(element => {
            // element.getGeometry().getPolygons().forEach(geo => {
            // let coor = geo.getCoordinates()[0];
            // let arr = [coor[0], coor[coor.length - 1]]
            // let arr2 = [coor[1], coor[coor.length - 2]]
            // })
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
     * @description 查询色斑图数据
     */
    requestFeatures() {
        return new Promise((resolve, reject) => {
            // 色例配置查询
            this.getSettingData().then(settings => {
                this.styleData = settings;
                // 查询数据
                getData('/colorBoard').then(res => {
                    let data = JSON.stringify(res);
                    let features = this.readFeatures(data);
                    resolve(features);
                }).catch((err) => reject(err))
            })
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
            let features1 = this.layer.getSource().getFeatures();
            this.layer.getSource().addFeatures(features);
            features1.forEach(ele => {
                this.layer.getSource().removeFeature(ele);
            })
        });
    }

    //初始化feature和样式
    initFeatures() {
        return new Promise((resolve, reject) => {
            this.requestFeatures().then(features => {
                features.forEach(feature => {
                    feature.setStyle(() => this.getStyle(feature));
                })
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
     * @description 计算色斑图样式
     * @param {*} feature 
     */
    getStyle(feature) {
        let styles = new Array();
        let value = feature.get('endValue');
        let { ranges, colorList } = this.styleData;
        let index = ranges.findIndex((item, index) => {
            if (index != ranges.length - 1) {
                return ((value >= Number(item)) && (value < Number(ranges[index + 1])));
            } else {
                return value == Number(item);
            }
        })
        if (index === ranges.length - 1) index = colorList.length - 1;
        if (index >= 0) {
            styles.push(
                new Style({
                    fill: new Fill({
                        color: colorList[index]
                    }),
                })
            );
        } else {
            styles.push(
                new Style({
                    fill: null
                })
            );
        }

        return styles;
    }
}