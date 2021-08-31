import { Feature } from "ol";
import { LineString, Point, Polygon } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";

import CommonUtils from '../../core/CommonUtils.js';
import { coordinate2Coordinate, getDeviationAngle } from '../../core/SymbolTool.js';
import { getCurrentMap, getCurrentProjCode } from "../../core/mapTool.js";
import FeatureTool from "../../core/FeatureTool.js";

import GridValue from "../GridValue.js";

/**
 * @description 绘制风温
 */

export default class windTemperature extends GridValue {
    constructor() {
        super()
        this.featureType = 'windTemperature';//设置类型
        this.roundSize = 0;//保留小数位数 0为整数
        this.needMonitor = false;//是否需要自动抽析
        //风的格点值要素名称后端统一为u v 
        this.patternElementName = ['u', 'v', 't'];
    }
    initFeatures() {
        // 储存类型
        let res = [];
        // 解析U V T 数据
        let arr = CommonUtils.getLonLatMatrix({ data: this.layerData, option: this.patternElementName });
        // 循环设置 添加图形和 样式
        let point;
        arr.forEach(item => {
            if (Math.abs(Number(item.lat)) == 90) return;
            if (Number(item.lat) > 90 || Number(item.lat) < -90) return
            if (Number(item.lon) > 180) item.lon -= 360;
            if (Number(item.lon) < -180) item.lon += 360;
            // if (!item.u && !item.v) return
            if (Math.abs(item.lat) > 85) return;
            try {
                point = fromLonLat([Number(item.lon), Number(item.lat)], getCurrentProjCode());
            } catch (error) {
                console.error("经纬度异常:", item)
                return false
            }
            let styleData = item.t != null && item.t != undefined ? { t: item.t, u: item.u, v: item.v } : { u: item.u, v: item.v };
            let img = new Feature({
                geometry: new Point(point),
                featureType: 'drawWind',
                styleData,
                lon: Number(item.lon),
                lat: Number(item.lat)
            })
            // 设置样式
            img.setStyle(() => this.getStyle(img))
            // 禁用交互
            FeatureTool.setFeatureNotDragable(img);
            res.push(img);
        });
        return res;
    }
    getStyle(img) {
        let { t, u, v } = img.getProperties().styleData;

        // 绘制风羽规则 [三角，长杆，短杆]
        let ranges = [50, 10, 5]

        let Linestart = img.getGeometry().getCoordinates();
        let temperature = '', arr = [];
        if (t) {
            // 计算摄氏度
            temperature = t.toString();
            temperature = Number.isNaN(temperature) ? "" : CommonUtils.round(temperature, this.roundSize, "string");//保留到整数
            let flg = temperature.indexOf('-');
            if (flg == 0) {
                temperature = temperature.substr(1);
            }
            if (flg == -1) {
                temperature = '+' + temperature;
            }
        }
        // 获取风向（windA） 和 风速（windB）
        let { windA, windB, dir } = this.compoted_u_v(u, v);
        if (windA == null || windB == null || dir == null) return [];
        // 风雨符号之间间隔
        let step = 4;

        // 每个风雨符号 所绘制的数量
        let fifty = parseInt(windB / ranges[0]);
        let ten = parseInt((windB - fifty * ranges[0]) / ranges[1]);
        // 介于  < = range[1]  > range[2] 之间的 画短杆 小于 range[2]的不需要画
        let five = windB % ranges[1] !== 0 ? (windB % ranges[1] >= ranges[2] ? 1 : 0) : 0;

        let lengthAll = (fifty + ten + five) * step, length;
        if (lengthAll > 20) {
            length = lengthAll;
        } else if (lengthAll <= 20 && lengthAll >= 7) {
            length = 20;
        } else if (lengthAll < 7 && lengthAll > 2) {
            length = 17;
        } else {
            length = 0;
        }

        // 获取终点坐标
        let lineEnd = coordinate2Coordinate(Linestart, dir, length);
        // 获取偏移角度
        let angle = getDeviationAngle(Linestart);
        // 将角度转化为Π
        let rad = CommonUtils.angle2Rad(angle);
        // 获取风雨样式表
        let addwind = this.getWindDrying(-windA + rad, windB, lineEnd, 1, 'black', 4, 8, getCurrentMap(), img, ranges);

        let lineEndLength = 0;
        // 当风雨符号 没有三角且大于一个短杆 时 需要往后一个 间隔
        if (length >= 20) lineEndLength = length - step;
        // 当风雨符号 只有一个短杆时 此时 正常绘制
        if (length >= 17 && length < 20) lineEndLength = length;
        // 当风雨符号 有三角时 此时 正常绘制
        if (fifty != 0) lineEndLength = length;

        // console.info('>>>> ws >>> 风杆需要绘制的长度（像素）', lineEndLength, Linestart)

        // 终点坐标做处理
        lineEnd = coordinate2Coordinate(Linestart, dir, lineEndLength)
        // 设置温度的坐标
        let wendu = coordinate2Coordinate(Linestart, 180 + dir, 6)

        // 添加摄氏度
        let addText = new Style({
            geometry: new Point(wendu),
            text: new Text({
                font: `normal normal 700 11px Bahnschrift`, //文字样式
                text: temperature.toString(), //文本内容
                fill: new Fill({
                    //文本填充样式（即文字颜色）
                    color: 'black'
                }),
            })
        });

        if (fifty !== 0 || ten !== 0 || five !== 0) {
            // 添加线段
            let addLine = new Style({
                geometry: new LineString([Linestart, lineEnd]),
                stroke: new Stroke({
                    color: 'black',
                    width: 1,
                })
            });
            arr.push(addLine)
        }
        // 当没有 风速 风向的时候 绘制个 圆
        if (fifty == 0 && ten == 0 && five == 0) {
            let empty = new Style({
                image: new CircleStyle({
                    stroke: new Stroke({
                        color: 'black',
                        width: 1,
                    }),
                    radius: 1,
                    fill: new Stroke({
                        color: 'black',
                    })
                }),
            })
            arr.push(empty);
        }

        if (addwind) {
            arr.push(addText, ...addwind);
        }
        return arr;
    }
    compoted_u_v(u, v) {
        if (u == 0 && v == 0) {
            return { windA: 0, windB: 0, dir: 0 }
        }
        else if (Math.abs(u) > 10000 || Math.abs(v) > 10000) {
            return { windA: null, windB: null, dir: null }
        }
        let dir = CommonUtils.getUVAngle(u, v);
        // 风向
        let windA = CommonUtils.getUVRad(u, v);
        // 风速  计算单位 m/s
        let windB = CommonUtils.getUVSpeed(u, v);

        return { windA, windB, dir }
    }
    /**
     * 
     * @param {*} windDirection 风向（windA） 
     * @param {*} windSpeed 风速（windB）
     * @param {*} orgin 原点 中心点 绘制的基点
     * @param {*} scale 缩放等级
     * @param {*} color 颜色
     * @param {*} step  每个字符间 的间隔
     * @param {*} height 高度
     * @param {*} map   当前地图
     * @param {*} feature   当前feature
     * @param {*} range  风羽三个线型所代表的数值 : [三角 长线 短线]
     */
    getWindDrying(windDirection, windSpeed, orgin, scale = 1, color = 'black', step = 4, height = 8, map = getCurrentMap(), feature, range = [50, 10, 5]) {
        if (!orgin || !orgin[0] || !orgin[1]) return null;
        try {
            let index = 0;
            let styles = [];
            let lonlat = [feature.get("lon"), feature.get("lat")];//坐标点的经纬度
            // let proj = map.getView().getProjection().getCode();
            // let lonlat = toLonLat(orgin, proj);//坐标点的经纬度
            let isSouth = lonlat[1] < 0 ? -1 : 1;//-1代表是南半球 1代表是北半球
            // 风向（windA） 风速（windB）
            let fifty = parseInt(windSpeed / range[0]);
            let ten = parseInt((windSpeed - fifty * range[0]) / range[1]);
            // let five = windSpeed % range[1] == 0 ? 0 : 1;
            // 介于  < = range[1]  > range[2] 之间的 画短杆 小于 range[2]的不需要画
            let five = windSpeed % range[1] !== 0 ? (windSpeed % range[1] >= range[2] ? 1 : 0) : 0;

            // 三角
            for (let i = 0; i < fifty; i++) {
                let p1 = CommonUtils.transPointByXY(orgin, map, 0, -(step * index));
                let p2 = CommonUtils.transPointByXY(orgin, map, 0, -(step * (index + 1)));
                let p3 = CommonUtils.transPointByXY(orgin, map, height * isSouth, -(step * index));
                let p1r = CommonUtils.rotatePoint(p1, orgin, windDirection);
                let p2r = CommonUtils.rotatePoint(p2, orgin, windDirection);
                let p3r = CommonUtils.rotatePoint(p3, orgin, windDirection);
                let p = new Polygon([[p1r, p2r, p3r, p1r]]);//50风速的三角
                styles.push(new Style({
                    geometry: p,
                    stroke: new Stroke({ color, width: 1 }),
                    fill: new Fill({ color })
                }));
                index++;
            }
            step = step * 0.8;
            //长杆
            for (let i = 0; i < ten; i++) {
                let p1 = CommonUtils.transPointByXY(orgin, map, 0, -(step * (index + 1)));
                let p2 = CommonUtils.transPointByXY(orgin, map, height * isSouth, -(step * index));
                let p1r = CommonUtils.rotatePoint(p1, orgin, windDirection);
                let p2r = CommonUtils.rotatePoint(p2, orgin, windDirection);
                let p = new LineString([p1r, p2r]);//10风速的长线
                styles.push(new Style({
                    geometry: p,
                    stroke: new Stroke({ color, width: 1 * scale })
                }));
                index++;
            }
            //短杆
            for (let i = 0; i < five; i++) {
                let p1 = CommonUtils.transPointByXY(orgin, map, 0, -(step * (index + 1)));
                let p2 = CommonUtils.transPointByXY(orgin, map, (height + 2) * isSouth, -(step * index));
                let p3 = CommonUtils.transPointByXY(p2, map, -0.6 * (height + 2) * isSouth, -0.6 * step);
                let p1r = CommonUtils.rotatePoint(p1, orgin, windDirection);
                let p2r = CommonUtils.rotatePoint(p3, orgin, windDirection);
                let p = new LineString([p1r, p2r]);//5风速的长线
                styles.push(new Style({
                    geometry: p,
                    stroke: new Stroke({ color, width: 1 * scale })
                }));
                index++;
            }
            return styles;
        } catch (error) {
            console.error("🚀 ~ file: StyleTool.js ~ line 541 ~ StyleTool ~ getWindDrying ~ error", error)
            return null;
        }
    }
}