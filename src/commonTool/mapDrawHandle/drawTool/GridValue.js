import Feature from 'ol/Feature';
import { Point } from "ol/geom";
import { unByKey } from 'ol/Observable';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Fill, Stroke, Style, Text } from "ol/style";
import CircleStyle from 'ol/style/Circle';

import { getCurrentMap, getCurrentProjCode } from '../core/mapTool.js';
import CommonUtils from "../core/CommonUtils.js";
import FeatureTool from '../core/FeatureTool.js';

/**
 * 展示格点值的父类  带自动抽析监听的
 */
export default class GridValue {
    constructor(map) {
        this.featureType = 'GridValue';//设置类型
        this.data;//格点值组装后的数据
        this.patternElementName = ['u', 'v'];//所有要素key
        this.features = [];//所有的feature
        this.styles = [];
        this.styleData = {
            width: 1,//线宽 字的线宽
            // dash: [5, 5], //虚线
            // dash: [5, 5, 1, 5],//点线
            // dash: [],//实线
            color: 'black',//字体颜色
            size: 12,//字体大小
        };
        this.pointStyle = new Style({
            image: new CircleStyle({
                radius: 1,
                // stroke: new Stroke({
                //     color: this.styleData.color
                // }),
                fill: new Fill({ color: this.styleData.color }),
            }),
        });
        this.strokeStyle = new Stroke({
            color: this.styleData.color,
            width: 0.5
        });
        this.fillStyle = new Fill({
            color: this.styleData
        });
        this.features = [];
        this.currentStep = 1;//当前抽析间隔
        this.layerData;//格点原始数据{lon:[],lat:[],u:[],v:[]}
        this.showHandle;//定时句柄
        this.mapMonitor;//地图监听
        this.roundSize = 0;//保留小数位数 0为整数
        this.needMonitor = true;//是否需要自动抽析
        this.pixel = 25;//自动抽析两个符号之间的距离 数值越小越密集
    }


    // 设置保留的小数位数
    setRoundSize(roundSize) {
        this.roundSize = roundSize;
        return this;
    }
    // 设置是否需要自动抽析
    setNeedMonitor(needMonitor) {
        this.needMonitor = needMonitor;
        return this;
    }

    /**
     * @description 设置原始数据
     * @param {*} originalData 
     */
    setOriginalData(originalData) {
        let { layerData, patternElementName } = originalData;
        this.layerData = layerData;
        this.patternElementName = patternElementName.toString().split(",");
        return this;
    }
    /**
     * @description 设置数据
     * @param {*} originalData 
     */
    setData(layerData) {
        this.layerData = layerData;
        return this;
    }

    /**
     * @description 设置要素的集合
     * @param {*} option ['u','v']
     */
    setPatternElementName(patternElementName) {
        this.patternElementName = patternElementName;
        return this;
    }

    /**
     * 设置类型
     * @param {*} featureType 
     */
    setFeatureType(featureType) {
        this.featureType = featureType;
        return this;
    }

    /**
     * @description 设置等值线界面交互属性
     * @param {*} styleData  等值线界面交互属性 styleData已做深拷贝
     */
    setStyleData(styleData) {
        if (styleData) {
            this.styleData = { ...styleData };
            this.pointStyle = new Style({
                image: new CircleStyle({
                    radius: 1,
                    fill: new Fill({ color: this.styleData.color }),
                }),
            });
            this.strokeStyle = new Stroke({
                color: this.styleData.color,
                width: 0.5
            });
        }
        return this;
    }

    // 显示格点数据
    show() {
        this.clear();
        this.initFeatures();
        this.layer.getSource().addFeatures(this.features);
        if (this.needMonitor) {
            this.startMonitor();//开启监听
        }
        return this;
    }

    // 添加监听自动数据抽析
    startMonitor() {
        if (!this.mapMonitor) this.mapMonitor = this.map.on("moveend", (evt) => {
            // 加延时 防止移动放大缩小过程中计算多次
            clearTimeout(this.showHandle);
            this.showHandle = setTimeout(() => {
                this.show();
            }, 200);
        });
        return this;
    }
    // 停止监听自动数据抽析
    stopMonitor() {
        clearTimeout(this.showHandle);
        if (this.mapMonitor) {
            unByKey(this.mapMonitor);
            this.mapMonitor = null;
        }
        // 清空数据
        this.layerData = null;
        this.data = null;
        this.features = [];
        return this;
    }

    //构建所有的feature
    initFeatures() {
        try {
            this.features = [];
            if (this.needMonitor) {
                // 按照间隔和可视区域过滤数据
                this.data = this.getExtentData({ data: this.layerData, map: this.map, patternElementName: this.patternElementName });
            } else {
                // 不过滤
                let latEnd = this.layerData.lat.length, lonEnd = this.layerData.lon.length;
                this.data = this.getLonLatValue({
                    data: this.layerData,
                    patternElementName: this.patternElementName,
                    step: 1,
                    lonStart: 0,
                    lonEnd,
                    latStart: 0,
                    latEnd
                });
            }
            console.log("initFeatures --------filter Sum------->", this.data.length)
            let proj = getCurrentProjCode();
            let coor, lontlat, showText, f;
            if (this.data && this.data.length > 0) {
                this.data.forEach(element => {
                    lontlat = this.fixLonLat([element.lon, element.lat]);
                    if (Number.isNaN(element.lon) || Number.isNaN(element.lat)) {
                        console.error(element)
                        return;
                    }
                    if (!lontlat) return;
                    coor = fromLonLat(lontlat, proj);
                    showText = this.getShowText(element) || "";
                    f = new Feature({
                        geometry: new Point(coor),
                        featureType: this.featureType,
                        showText: showText,//显示的文字
                        elements: element, //所有要素数据
                        lon: Number(element.lon),
                        lat: Number(element.lat),
                    });
                    FeatureTool.setFeatureNotDragable(f);
                    // 自动抽析时样式不需要动态渲染  不自动抽析时需要动态渲染
                    // if (this.needMonitor) {
                    //     f.setStyle(this.getStyle(f));
                    // } else {
                    //     f.setStyle(() => this.getStyle(f));
                    // }
                    this.initStyle(f);
                    this.features.push(f);
                });
            }
            this.data = null;//帮助释放内存
        } catch (error) {
            console.error("initFeatures -> error", error)
        }
        return this.features;
    }
    /**
     * @description 计算地图当前视图范围下的最大最小经纬度范围
     * @param {*} map 地图对象
     * @param {*} proj 地图对象
     * @returns 最大最小经纬度范围[minLon, maxLon, minLat, maxLat] 
     */
    calcExtent({ map, proj }) {
        let view = map.getView();
        let size = map.getSize();
        // 地图坐标范围
        let [minX, minY, maxX, maxY] = view.calculateExtent(size);
        const width = maxX - minX;
        const height = maxY - minY;

        const countX = 200, countY = 100;//可视区域取点
        const deltaX = Math.abs(width) / countX;
        const deltaY = Math.abs(height) / countY;
        let [minLon, minLat] = toLonLat([minX, minY], proj);
        let [maxLon, maxLat] = toLonLat([maxX, maxY], proj);
        // fix lon lat
        if (minLon < -180) minLon = -180;
        if (maxLon > 180) maxLon = 180;
        if (maxLon < -180) maxLon = -180;
        if (maxLon > 180) maxLon = 180;

        if (minLat <= -90) minLat = -89.9;
        if (minLat >= 90) minLat = 89.9;
        if (maxLat <= -90) maxLat = -89.9;
        if (maxLat >= 90) maxLat = 89.9;

        if (minLon > maxLon) {
            let temp = maxLon;
            maxLon = minLon;
            minLon = temp;
        }
        if (minLat > maxLat) {
            let temp = maxLat;
            maxLat = minLat;
            minLat = temp;
        }

        // 筛选屏幕可视区域的经纬度范围
        for (let j = 0; j < countY; j++) {
            for (let i = 0; i < countX; i++) {
                const coor = [minX + i * deltaX, minY + deltaY * j];
                // console.log("getExtent -> coor", coor);
                const [lon, lat] = toLonLat(coor, proj);
                if (lon < -180 || lon > 180 || lat <= -90 || lat >= 90) continue;
                if (lon < minLon) minLon = lon;
                if (lat < minLat) minLat = lat;
                if (lon > maxLon) maxLon = lon;
                if (lat > maxLat) maxLat = lat;
            }
        }
        return [minLon, maxLon, minLat, maxLat];
    }
    //修复异常经纬度
    fixLonLat(lonlat) {
        if (Number.isNaN(lonlat[0]) || Number.isNaN(lonlat[1])) {
            return undefined;
        }
        lonlat[0] = Number(lonlat[0]) > 180 ? Number(180 - lonlat[0]) : Number(lonlat[0]);
        lonlat[0] = Number(lonlat[0]) < -180 ? Number(lonlat[0] + 360) : Number(lonlat[0]);
        return lonlat;
    }

    // 按照可视区域和当前缩放级别自动计算数据显示间隔
    getExtentData({ data, map = getCurrentMap(), patternElementName }) {
        let proj = map.getView().getProjection().getCode();
        const step = calcStep({ data, map, pixel: this.pixel });
        this.currentStep = step;
        // 最小最大经纬度范围
        let extent = this.calcExtent({ map, proj })
        // 格点数据取值经纬度范围
        let [lonStart, lonEnd, latStart, latEnd] = this.findGridExtent(data, extent);
        let dataList = this.getLonLatValue({ data, patternElementName, step, lonStart, lonEnd, latStart, latEnd });
        return dataList;

    }

    // 根据经纬度范围和间隔筛选组合数据
    getLonLatValue({ data, patternElementName, step = 1, lonStart, lonEnd, latStart, latEnd }) {
        try {
            if (!data || data.length == 0 || !patternElementName) return;
            if (step <= 0) return;
            if (patternElementName.length == 0) return;

            let lat = data.lat, lon = data.lon;
            let result = [];
            for (let i = latStart; i <= latEnd; i += step) {
                for (let j = lonStart; j <= lonEnd; j += step) {
                    let listObj = {};
                    // 修正经度范围
                    if (lon[j] > 180) lon[j] = (lon[j] - 360).toString();
                    if (lon[j] < -180) lon[j] = (lon[j] + 360).toString();

                    patternElementName.forEach(key => {
                        listObj[key] = data[key][i * lon.length + j];
                    });

                    listObj.lat = lat[i];
                    listObj.lon = lon[j];
                    result.push(listObj)
                }
            }
            return result;
        } catch (error) {
            console.error(error)
        }
    }


    //子类继承后复写该方法,组织要显示的文字内容
    getShowText(element) {
        let result = '';
        if (this.patternElementName && this.patternElementName.length == 1) {
            result = element[this.patternElementName[0]];
            // 过滤无效数据
            if (Number.isNaN(Number(result))) return "";
            if (Math.abs(Number(result)) > 1000000) return "";
            return CommonUtils.round(result, this.roundSize, 'string');
        } else {
            for (let key in this.patternElementName) {
                if (Object.prototype.hasOwnProperty.call(this.patternElementName, key)) {
                    result += `${key}:${CommonUtils.round(element[key], this.roundSize, 'string')},`;
                }
            }
            return result.slice(0, result.length - 1);//去掉最后一个,
        }
    }

    //设置features的样式
    initStyle(f) {
        f.setStyle(this.getStyle(f));
        return this;
    }

    /**
     * @description 计算等值线样式
     * @param {*} feature 
     */
    getStyle(feature) {
        let styles = [];
        let showText = feature.get('showText');
        let styleData = feature.get('styleData');
        this.styleData = styleData || this.styleData;
        showText = showText ? showText : "";
        let style = new Style({
            text: new Text({
                textAlign: 'center', //对齐方式
                textBaseline: 'top', //基准线
                offsetY: 4,
                font: `normal ${Number(this.styleData.size) * 0.8}px `,
                text: showText.toString(), //文本内容
                // stroke: new Stroke({
                //     color: this.styleData.color,
                //     width: 0.5
                // }),
                fill: new Fill({
                    color: this.styleData.color
                })
            })
        });

        styles.push(this.pointStyle);
        styles.push(style);
        return styles;
    }
    /**
     * @description 在数组arr中查询最接近target值的数组下标
     * @param {*} arr 有序数组
     * @param {*} target 目标值
     */
    findNearestTargetIndex(arr, target) {
        let clone = [...arr];
        let sort = arr[0] < arr[1] ? "asc" : "desc";//升序asc 降序desc
        if (sort === "desc") {
            clone.reverse();
        }
        if (target >= clone[clone.length - 1]) {
            return sort === "asc" ? arr.length - 1 : 0;
        }
        if (target <= clone[0]) {
            return sort === "asc" ? 0 : arr.length - 1;
        }
        for (let i = 0; i < clone.length - 1; i++) {
            const start = clone[i];
            const end = clone[i + 1];
            if (target >= start && target < end) {
                return sort === "asc" ? i : arr.length - 1 - i;
            }
        }
    }

    /**
     * @description 根据最大最小经纬度范围获取格点数据的经纬度起始值
     * @param {*} data 
     * @param {*} minLon 最小经度
     * @param {*} maxLon 最大经度
     * @param {*} minLat 最小纬度
     * @param {*} maxLat 最大纬度
     */
    findGridExtent(data, [minLon, maxLon, minLat, maxLat]) {
        // console.log("findNearestGridExtent ->  minLon, maxLon, minLat, maxLat", minLon, maxLon, minLat, maxLat);
        let lonList = data.lon;
        let latList = data.lat;
        let lonStart = this.findNearestTargetIndex(lonList, CommonUtils.round(minLon, 3));
        let lonEnd = this.findNearestTargetIndex(lonList, CommonUtils.round(maxLon, 3));
        let latStart = this.findNearestTargetIndex(latList, CommonUtils.round(minLat, 3));
        let latEnd = this.findNearestTargetIndex(latList, CommonUtils.round(maxLat, 3));
        if (lonStart > lonEnd) {
            let temp = lonEnd;
            lonEnd = lonStart;
            lonStart = temp;
        }
        if (latStart > latEnd) {
            let temp = latEnd;
            latEnd = latStart;
            latStart = temp;
        }
        // console.log("findNearestGridExtent -> lonStart", lonStart, ":", lonList[lonStart])
        // console.log("findNearestGridExtent -> lonEnd", lonEnd, ":", lonList[lonEnd])
        // console.log("findNearestGridExtent -> latStart", latStart, ":", latList[latStart])
        // console.log("findNearestGridExtent -> latEnd", latEnd, ":", latList[latEnd])
        return [lonStart, lonEnd, latStart, latEnd];

    }

}


function findNearestTargetIndex(arr, target) {
    let arr_ = [...arr]
    let mid;
    let l = 0;
    let r = arr_.length - 1;
    // 保证指针最终停留在相邻的两个数,所以这里是判断是否大于1
    while (r - l > 1) {
        mid = Math.floor((l + r) / 2);
        // 如果目标数比中间小，所以范围在左边
        if (target < arr_[mid]) {
            r = mid;
        } else {
            l = mid;
        };
    };
    // 最后比较这两个数字的绝对差大小即可。
    let result = Math.abs(target - arr_[l]) <= Math.abs(target - arr_[r]) ? l : r;
    return result;
    // return Math.abs(target - arr[l]) <= Math.abs(target - arr[r]) ? arr[l] : arr[r];
}
/**
 * @description 根据屏幕中心点附近的格点间屏幕像素距离自动计算间隔
 * @param {*} data 格点数据
 * @param {Map} map 地图对象
 * @param {*} proj 投影
 * @param {Number} pixel 最小像素间隔
 */
function calcStep({ data, map = getCurrentMap(), pixel = 25 }) {
    let step;
    let view = map.getView();
    let proj = view.getProjection().getCode();
    let center = view.getCenter();
    const centerLonlat = toLonLat(center, proj);
    if (data.lon && data.lon.length > 1) {
        const stepLon = Math.abs(data.lon[1] - data.lon[0]);
        const deltaCenterLeft = [centerLonlat[0] - stepLon / 2, centerLonlat[1]];
        const deltaCenterRight = [centerLonlat[0] + stepLon / 2, centerLonlat[1]];
        const centerLeftPixel = map.getPixelFromCoordinate(fromLonLat(deltaCenterLeft, proj));
        const centerRightPixel = map.getPixelFromCoordinate(fromLonLat(deltaCenterRight, proj));
        const lengthPixle = CommonUtils.getP2PDistance(centerLeftPixel, centerRightPixel);
        step = parseInt(pixel / lengthPixle) + 1;
    } else {
        step = 1;//不抽析
    }
    return step;
}