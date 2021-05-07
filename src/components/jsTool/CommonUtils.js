/** 
* @Description 通用工具类 
    将项目中公用的方法提到本类中,需要添加方法的注解(必填项：方法功能说明、输入输出说明、作者,有重大修改时添加修改说明.示例如下：)
* @createDate 2019年2月11日
* @version 1.0
*/
import { Feature } from 'ol';
import LineString from "ol/geom/LineString";
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { getDistance } from "ol/sphere";
import { fromLonLat } from 'ol/proj';

export default class CommonUtils {
    constructor() {
    }
    /**
     * @description 求两点连线与x轴夹角的弧度
     * @param {*} startPoint 起始点
     * @param {*} endPoint 结束点
     * @returns 夹角弧度值
     * @author WeiQingYong
     */
    static getRotation(startPoint, endPoint) {
        return Math.atan2(endPoint[1] - startPoint[1], endPoint[0] - startPoint[0]);
    }

    /**
     * 将点按照中心点旋转某一角度后生成另外一个点(ps:像素坐标为顺时针，正坐标系为逆时针)
     * @param {number[]} point 旋转点
     * @param {number[]} center 旋转中心
     * @param {number} angle 旋转角度
     */
    static rotatePoint(point, center, angle) {
        let baseAngle = this.getRotation(center, point);
        let totalAngle = angle + baseAngle;
        let distance = this.getP2PDistance(point, center);
        let result = [center[0] + distance * Math.cos(totalAngle), center[1] + distance * Math.sin(totalAngle)];
        return result;
    }

    /**
     * 计算点到点的距离
     * @param {number[]} p1 pointB 两点坐标
     * @return {number} 两点之间的距离
     */
    static getP2PDistance(p1, p2) {
        return Math.sqrt(
            (p1[0] - p2[0]) * (p1[0] - p2[0])
            + (p1[1] - p2[1]) * (p1[1] - p2[1])
        );
    }

    /**
     * 计算两个坐标点在当前地图投影下的屏幕距离
     * @param {number[]} c1 coordinate坐标
     * @param {number[]} c2 coordinate坐标
     * @return {number} 两点之间的屏幕距离
     */
    static getP2PDistanceFromPixel(c1, c2, map) {
        let p1 = map.getPixelFromCoordinate(c1);
        let p2 = map.getPixelFromCoordinate(c2);
        return CommonUtils.getP2PDistance(p1, p2);
    }

    /**
     * @description 已知点p,沿x轴水平方向,以r为半径逆时针旋转rotation弧度,求旋转后的点
     * @param {*} p 点
     * @param {*} r 旋转半径
     * @param {*} rotation 旋转弧度
     * @returns 旋转后的点
     * @author WeiQingYong
     */
    static getRotationPoint2(p, r, rotation) {
        if (!p || !r || !rotation) {
            return null;
        } else {
            return [p[0] - (r - r * Math.cos(rotation)), p[1] + r * Math.sin(rotation)];
        }
    }

    /**
     * @description 已知圆心o和圆上一点p,p点沿着圆旋转rotation弧度,求旋转后的点
     * @param {*} p 原来的点
     * @param {*} o 旋转的圆心
     * @param {*} rotation 旋转的角度
     * @author WeiQingYong add since 2019-02
     */
    static getRotationPoint(p, o, rotation) {
        if (!p || !o || !rotation) {
            return null;
        } else {
            return [(p[0] - o[0]) * Math.cos(rotation) - (p[1] - o[1]) * Math.sin(rotation) + o[0],
            (p[1] - o[1]) * Math.cos(rotation) + (p[0] - o[0]) * Math.sin(rotation) + o[1]];
        }
    }

    /**
     * @description 对带控制点的feature进行平滑处理
     * @param {Feature} feature 
     */
    static toSmoothFeature(feature) {
        let geometry = feature.getGeometry();
        if (geometry instanceof Point) {
            return feature;
        } else if (geometry instanceof LineString) {
            if (feature.get("isSmooth") == true) {
                let vertex = feature.get("vertex");
                feature.getGeometry().setCoordinates(this.getSmoothCoordinates(new LineString(vertex)));
            }
        } else if (geometry instanceof Polygon) {
            if (feature.get("isSmooth") == true) {
                let vertex = feature.get("vertex");
                feature.getGeometry().setCoordinates(this.getSmoothCoordinates(new Polygon([vertex])));
            }
        } else {
            console.error("MultiString和MultiPolygon暂未处理");
            return feature;
        }
        return feature;
    }

    /**
    * @description 将feature转换为平滑的feature
    * @param {Feature} feature 
    */
    static changeToSmoothFeature(feature) {
        let geometry = feature.getGeometry();
        if (geometry instanceof Point) {
            return feature;
        } else if (geometry instanceof LineString) {
            feature.getGeometry().setCoordinates(this.getSmoothCoordinates(geometry));
        } else if (geometry instanceof Polygon) {
            feature.getGeometry().setCoordinates(this.getSmoothCoordinates(geometry));
        } else {
            console.error("MultiString和MultiPolygon暂未处理");
            return feature;
        }
        return feature;
    }

    /**
     * @description 平滑算法(原来CDM项目的算法),求平滑后的坐标点
     * @param {*} geometry 需要平滑的图形
     * @returns 平滑后的坐标点数组
     * @author WeiQingYong add since 2019-02-27
     * @modify 修改平滑算法改用CatmullRom cardinal算法 since 2019年4月1日
     */
    static getSmoothCoordinates(geometry) {
        /* if (geometry instanceof LineString) {
            let coords = geometry.getCoordinates();
            let smooth = new NatCubic();
            return smooth.getPointValues(coords, 0, 1);
        } else if (geometry instanceof Polygon) {
            let coords = geometry.getCoordinates()[0];
            coords.pop();//去掉重复点
            let smooth = new NatCubicClosed();
            return smooth.getPointValues(coords, 0, 1);
        } else if (geometry instanceof Point) {
            let coords = geometry.getCoordinates();
            return coords;
        } */
        if (geometry instanceof LineString) {
            let coords = geometry.getCoordinates();
            let first = geometry.getFirstCoordinate();
            let last = geometry.getLastCoordinate();
            let isClose = false;
            if (this.isSameArray(first, last)) {//如果是闭合的直线,按闭合处理
                if (!coords) return;
                coords.pop();//去掉重复点
                isClose = true;
            }
            let smoothArray = this.smooth(coords, isClose);
            return smoothArray;
        } else if (geometry instanceof Polygon) {
            let coords = geometry.getCoordinates()[0];
            if (!coords) return;
            coords.pop();//去掉重复点
            let smoothArray = this.smooth(coords, true);
            return [smoothArray];
        } else if (geometry instanceof Point) {
            let coords = geometry.getCoordinates();
            return coords;
        }
    }

    /**
     *判断两个一维数组是否完全相等
     * @param {*} a1 数组1
     * @param {*} a2 数组2
     */
    static isSameArray(a1, a2) {
        return JSON.stringify(a1) === JSON.stringify(a2);
    }

    /**
     * @description 将geometry直接平滑处理(原来CDM项目的算法),使用平滑算法后的坐标点代替原来的坐标点
     * @param {*} geometry 需要平滑的图形
     * @author WeiQingYong add since 2019-02-27
     */
    static toSmoothGeometry(geometry) {
        geometry.setCoordinates(this.getSmoothCoordinates(geometry));
    }

    /**
     * @description 获取一个等腰三角形
     * @param {*} point 三角形底边中点或者顶点，默认底边中点
     * @param {*} width 三角形底边宽度
     * @param {*} angel 三角形底角的度数
     * @param {*} rotation 三角形以底边中点为中心点的旋转弧度
     * @param {*} isTop 是否为顶点
     * @returns {ol.geom.Polygon}
     * @author WeiQingYong add since 2019-02-27
     */
    static getTrianglePolygon(point, width, angle, rotation, isTop) {
        let p1, p2, p3;//三角形顶点 旋转前
        let height = 0;
        let height3 = width * 0.5 * Math.tan(this.angle2Rad(angle));
        if (isTop) {
            height = -height3;
            height3 = 0
        }
        p1 = [point[0] - width * 0.5, point[1] + height];
        p2 = [point[0] + width * 0.5, point[1] + height];
        p3 = [point[0], point[1] + height3];
        let geoPolygon = new Polygon([
            [p1, p2, p3, p1]
        ]);
        //旋转
        geoPolygon.rotate(rotation - Math.PI / 2, point);
        return geoPolygon;
    }

    /**
     * @description 获取一个等腰三角形，两边
     * @param {*} point 三角形底边中点
     * @param {*} widthBase 三角形底边宽度
     * @param {*} angel 三角形底角的度数
     * @param {*} rotation 三角形以底边中点为中心点的旋转弧度
     * @returns {ol.geom.Polygon}
     * @author WeiQingYong add since 2019-02-27
     */
    static getTrianglePolygonWind(point, widthBase, angle, rotation) {
        let p1, p2, p3;//三角形顶点 旋转前

        let width = widthBase * 1;
        p1 = [point[0] - width, point[1]];
        p2 = [point[0] + width, point[1]];
        p3 = [point[0], point[1] + width * Math.tan(this.angle2Rad(angle))];
        let lineString = new LineString([p2, p3, p1]);
        //旋转
        lineString.rotate(rotation - Math.PI / 2, point);
        return lineString;
    }

    /**
    * @description 获取一个正方形
    * @param {*} point 正方形的中心点
    * @param {*} width 正方形宽度
    * @param {*} rotation 正方形以中心点的旋转弧度
    * @returns {ol.geom.Polygon}
    */
    static getSquarePolygon(point, width, rotation) {
        let p1, p2, p3, p4;//正方形顶点 旋转前
        p1 = [point[0] - width * 0.5, point[1] - width * 0.5];
        p2 = [point[0] - width * 0.5, point[1] + width * 0.5];
        p3 = [point[0] + width * 0.5, point[1] + width * 0.5];
        p4 = [point[0] + width * 0.5, point[1] - width * 0.5];
        let geoPolygon = new Polygon([
            [p1, p2, p3, p4, p1]
        ]);
        //旋转
        geoPolygon.rotate(rotation, point);
        return geoPolygon;
    }

    /**
     * @description 角度转换弧度
     * @param {*} angle 角度
     * @author WeiQingYong
     */
    static angle2Rad(angle) {
        if (angle) {
            return angle * Math.PI / 180.0;
        } else {
            return null;
        }
    }

    /**
     * @description 弧度转换角度
     * @param {*} rad 弧度
     * @author WeiQingYong
     */
    static rad2Angle(rad) {
        if (rad) {
            return rad * 180.0 / Math.PI;
        } else {
            return null;
        }
    }

    /**
     * @description 返回 LineString or Polygon GeoJSON 的交点.
     * @param {*} line1 any LineString or Polygon
     * @param {*} line2 any LineString or Polygon
     */
    // static lineIntersect(geo1, geo2) {
    //     let g1, g2;
    //     if (geo1 instanceof LineString) {
    //         g1 = turf.lineString([geo1.getCoordinates()]);
    //     } /* else if (geo1 instanceof Polygon) {
    //     }  */
    //     else {
    //         return new Promise((resolve, reject) => {
    //             reject(`Error: this methode does not support the type of : ${geo1}`);
    //         });
    //     }
    //     if (geo2 instanceof LineString) {
    //         g2 = turf.lineString([geo2.getCoordinates()]);
    //     } /* else if (geo1 instanceof Polygon) {
    //     }  */else {
    //         return new Promise((resolve, reject) => {
    //             reject(`Error: this methode does not support the type of : ${geo2}`);
    //         });
    //     }

    //     let intersects = turf.lineIntersect(g1, g2);
    //     // eslint-disable-next-line no-console
    //     console.log(intersects);
    // }

    /**
     * @description 创建一个等腰三角形
     * @param {*} center 底边中心，及旋转时的旋转中心
     * @param {*} bottom 底边边长
     * @param {*} height 高
     * @param {*} rotation 旋转角度
     */
    static getTrianglePolygon2(center, bottom, height, rotation) {
        let a, b, c;
        let points = [];
        a = [center[0] - (bottom / 2), center[1]];
        b = [center[0] + (bottom / 2), center[1]];
        c = [center[0], (center[1] + height)];
        points.push(a);
        points.push(b);
        points.push(c);
        let element = new Polygon([points]);
        element.rotate(rotation, center);
        return element;
    }

    /**
     * 矫正经纬度值
     * @param {[number]} lonLat 
     */
    static correctLonLat(lonLat) {
        if (!lonLat) {
            return lonLat;
        }
        let lon = lonLat[0] % 180;
        let lat = lonLat[1] % 90;
        return [lon, lat];
    }


    /**
     * 矫正经纬度数组
     * @param {[[number]]} lonLats 
     */
    static correctLonLats(lonLats) {
        if (!lonLats) {
            return lonLats;
        }
        let arr = [];
        lonLats.forEach(lonLat => {
            arr.push(this.correctLonLat(lonLat));
        });
        return arr;
    }


    /**
     * 创建由两个等长线段构成的60度较折线，并以形成的三角形中点为参考点，旋转
     * @param {*} center 由折线段围成的三角形的中点
     * @param {*} width 线段长
     * @param {*} rotation 以中点为参考点旋转的角度
     */
    static createAngle_60(center, width, rotation) {
        let height = Math.sin(Math.PI / 3) * width;
        let a, b, c;
        let points = [];
        a = [center[0] - (width / 2), center[1] - (height / 2)];
        b = [center[0] + (width / 2), center[1] - (height / 2)];
        c = [center[0], center[1] + (height / 2)];
        points.push(a);
        points.push(c);
        points.push(b);

        let element = new LineString(points);
        element.rotate(rotation, center);
        return element;
    }

    /**
     * @description 创建一个扇形
     * @param {*} origin 圆心
     * @param {*} radius 半径
     * @param {*} sides 边数（弧度颗粒度）
     * @param {*} r 弧对应的角度(用角度值，取值 0<r<= 360 整圆360)  
     * @param {*} rotation 旋转角度
     */
    static createRegularPolygonCurve(origin, radius, sides, r, rotation) {
        let points = this.getRegularPoints(origin, radius, sides, r);
        if (r < 360) {
            // 若等于360度则说明是整圆，则不需要添加圆心
            points.push(origin);
        }
        let element = new Polygon([points]);
        element.rotate(rotation, origin);
        return element;
    }

    /**
     * 创建一个半圆
     * @param {*} start 半圆起点
     * @param {*} end 半圆终止点
     * @param {*} sides 边数
     */
    static createSemicircle(start, end, sides) {
        // 求与X轴的夹角
        let origin = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2] // 
        let radius = this.getTwoPointDistance(start, end) / 2;
        let r = 180;
        let rotation = this.getRotation(start, end);
        let line = new LineString(this.getRegularPoints(origin, radius, sides, r, rotation));
        line.rotate(rotation, origin);
        return line;
    }

    /**
     * calculate points for arc
     * @module shape-points/arc
     * @param {number} [x,y] 圆心
     * @param {number} start 起始弧度 (radians)
     * @param {number} end 结束弧度 (radians)
     * @param {number} radius 半径
     * @param {number} [pointsInArc=5] 边数
     * @returns {array} [[x1, y1], [x2, y2], ...[ xn, yn]]
     */
    static getArcPoints([x, y], start, end, radius, pointsInArc) {
        pointsInArc = pointsInArc || 5;
        const points = [];
        let angle = start;
        const interval = (end - start) / pointsInArc;
        for (let count = 0; count < pointsInArc; count++) {
            points.push([x + radius * Math.cos(angle), y + radius * Math.sin(angle)])
            angle += interval;
        }
        return points;
    }

    /**
     * @description 获得一段圆弧的采样点
     * @param {*} origin 圆心
     * @param {*} radius 半径
     * @param {*} sides 边数（弧度颗粒度,弧线上等分成多少个小线段）
     * @param {*} r 弧对应的角度(用角度值，取值 0<r<= 360 整圆360)     
     */
    static getRegularPoints(origin, radius, sides, r) {
        let x, y;
        let points = [];
        for (let i = 0; i <= sides; i++) {
            let rotatedAngle = i * Math.PI * 2 * r / (360 * sides);//获取相对于x正方向的偏转角
            x = origin[0] + (radius * Math.cos(rotatedAngle));
            y = origin[1] + (radius * Math.sin(rotatedAngle));
            points.push([x, y]);
        }
        return points;
    }

    /**
     * 数组转换为点xy坐标的形式 [num,num,num,num] => [[num,num],[num,num]]
     * @param {*} array  [x,y,x,y]
     * @returns points [[x,y],[x,y]]
     * @author WeiQingYong add since 2019-04-01
     */
    static arrayToPoints(array) {
        let points = []
        array.map((x, i, arr) => {
            if (i % 2) {
                points.push([arr[i - 1], x])
            }
        })
        return points
    }

    /**
     * 点xy坐标转换为数组的形式  [[num,num],[num,num]]=> [num,num,num,num]
     * @param points [[x,y],[x,y]]
     * @returns  array  [x,y,x,y]
     * @author WeiQingYong add since 2019-04-01
     */
    static pointsToArray(points) {
        let array = [];
        points.forEach(p => {
            array.push(p[0]);
            array.push(p[1]);
        });
        return array
    }

    static getTwoPointDistance(pointA, pointB) {
        return Math.sqrt(
            (pointA[0] - pointB[0]) * (pointA[0] - pointB[0])
            + (pointA[1] - pointB[1]) * (pointA[1] - pointB[1])
        );
    }

    /**
     * 求点到线段的垂线段的长度，若没有垂点，则不返回未定义
     * @param {*} lineStart 
     * @param {*} lineEnd 
     * @param {*} point 
     */
    static getDistance(lineStart, lineEnd, point) {
        let x1 = lineStart[0];
        let y1 = lineStart[1];
        let x2 = lineEnd[0];
        let y2 = lineEnd[1];
        let x0 = point[0];
        let y0 = point[1];
        let a = y1 - y2;
        let b = x2 - x1;

        if ((x0 - x1) * (x0 - x2) > 0 || (y0 - y1) * (y0 - y2) > 0) {
            return undefined;
        }

        if (a == 0 && b == 0) {
            return Math.sqrt((y0 - y1) * (y0 - y1) + (x0 - x1) * (x0 - x1));
        } else {
            let c = x1 * y2 - y1 * x2;
            return Math.abs(a * x0 + b * y0 + c) / Math.sqrt(a * a + b * b);
        }

    }

    /**
     * 将svg节点序列化
     * @param  svg svg节点
     */
    static svgSerialize(svg) {
        let xmlns = "http://www.w3.org/2000/xmlns/";
        let xlinkns = "http://www.w3.org/1999/xlink";
        let svgns = "http://www.w3.org/2000/svg";
        svg = svg.cloneNode(true);
        let fragment = window.location.href + "#";
        let walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT, null, false);
        while (walker.nextNode()) {
            for (let attr of walker.currentNode.attributes) {
                if (attr.value.includes(fragment)) {
                    attr.value = attr.value.replace(fragment, "#");
                }
            }
        }
        svg.setAttributeNS(xmlns, "xmlns", svgns);
        svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
        let serializer = new window.XMLSerializer;
        let string = serializer.serializeToString(svg);
        return string;
    }


    /**
     * @description 计算line相对于正北方向的旋转角度
     * @param {ol/geom/LineString} line 只有两个点的直线段
     * @returns {number} 弧度值
     */
    static getLineRotationAngle(line) {
        let coor = line.getCoordinates();
        // console.info('this.getRotation(coor[0], coor[1]);-->', this.getRotation(coor[0], coor[1]));
        return this.getRotation(coor[0], coor[1]) - Math.PI * 0.5;
    }

    /**
     * @description 判断一个点是否在一条线上
     * @param {[]} p 坐标点[] 
     * @param {ol/geom/LineString} line 线 
     * @returns boolean true:在线上 false:不在线上
     */
    // static isPointOnLine(p, line) {
    //     let r = false;
    //     line.forEachSegment((start, end) => {
    //         let line = turf.lineString([start, end]);
    //         let b = turf.booleanPointOnLine(this.point, line);
    //         if (b) {
    //             console.info('data-->', start, end);
    //         }
    //     })
    //     return r;
    // }

    /**
     * @description 获取点在lineString上的位置百分比;所在的线段;线段在原lineString的index
     * @param {*} point 点
     * @param {*} line 线
     */
    static getPositionAndLine(point, line) {
        let coords = line.getCoordinates();
        let index = 0;//记录添加的点在原lineString的位置
        let min = CommonUtils.getP2PDistance(point, line.getFirstCoordinate());
        for (let i = 0; i < coords.length - 1; i++) {
            let closedPoint = new LineString([coords[i], coords[i + 1]]).getClosestPoint(point);//求每条线段上与点closestCoordinate的最近点
            let distance = CommonUtils.getP2PDistance(point, closedPoint);
            if (distance < min) {
                min = distance;
                index = i;
            }
        }
        //构造原LineString起点到需要添加点的新LineString
        let lineTempArray = [];
        for (let i = 0; i < index; i++) {
            lineTempArray.push(coords[i]);
        }
        lineTempArray.push(point);
        let lineTemp = new LineString(lineTempArray);
        //计算添加点在原LineString的位置百分比
        let position = (lineTemp.getLength() / line.getLength()).toFixed(2);
        let lineAdd = new LineString([coords[index], coords[index + 1]]);
        return { "position": position, "lineAdd": lineAdd, "index": index };
    }

    /**
     * @description 计算点到线的最近距离
     * @param {Point} point 
     * @param {LineString} line 
     * @param {String} units (ex: degrees, radians, miles, or kilometers)
     * @param {String} method "geodesic" wether to calculate the distance based on geodesic (spheroid) or planar (flat) method. Valid options are 'geodesic' or 'planar'.
     */
    static getPoint2LineDistance(point, line, units = "degrees", method = "geodesic") {
        // let line_ = turf_lineString(line.getCoordinates());
        // let point_ = turf_point(point.getCoordinates());
        // let length = pointToLineDistance(point_, line_, { units, method });
        // return length;
        const p1 = point.getCoordinates();
        const p2 = line.getClosestPoint(p1);
        return this.getP2PDistance(p1, p2);
    }

    /**
    * @description 点p在水平方向平移x像素,竖直方向平移y像素后的点坐标
    * @param {[]} p 坐标点[] 
    * @param {ol.map} map 地图容器 
    * @param {number} x 水平方向移动量  单位：像素 正数代表右移 负数代表左移
    * @param {number} y 竖直方向移动量  单位：像素 正数代表上移 负数代表下移
    * @returns {[]} 移动后的坐标点
    */
    static transPointByXY(p, map, x, y) {
        return [p[0] + Number(x) * map.getView().getResolution(), p[1] + Number(y) * map.getView().getResolution()];
    }


    /**
     * @description 解决elementUI下拉点击空白处不消失 下拉类菜单，点击目标元素之外，收起菜单
     */
    static outBlur(tag, class_tag, e, total, ultag) {//tag为自己给元素起的class名字，class_tag为eleUI下拉菜单的class名字，total为自己加的标识，ultag为el-dropdown-menu的标识
        let class_name = "el-dropdown-link el-dropdown-selfdefine";
        let eles = document.getElementsByClassName(tag);//获取所有el-dropdown-menu
        let menus = document.getElementsByClassName(class_tag);//获取所有的menu如地理信息
        if (!(e.target.className == "el-dropdown" || e.target.className.replace(/\s*/g, "") == class_name.replace(/\s*/g, ""))) {
            for (let i = 0; i <= eles.length - 1; i++) {
                if (eles[i].style.display != "none") {//没点到目标元素，筛选style不同
                    let ultagName = eles[i].getAttribute(ultag);
                    for (let j = 0; j <= menus.length - 1; j++) {
                        if (menus[j].getAttribute(total) == ultagName) {
                            menus[j].children[0].click();
                        }
                    }
                }
            }
        }
    }

    /**
     * 
     * @param {*} data  数据集合
     * @param {*} option  解析数据列表 lon,lat(无需传入) 例['u','v','t']
     */
    static getLonLatMatrix({ data, option }) {
        let lat = data.lat, lon = data.lon;
        let arr = [], count = 0;

        for (let i = 0; i < lat.length; i++) {
            for (let j = 0; j < lon.length; j++) {

                let listObj = {};
                if (lon[j] > 180) lon[j] = (lon[j] - 360).toString()

                option.forEach(ele => {
                    listObj[ele] = data[ele][count];
                });

                listObj.lat = lat[i];
                listObj.lon = lon[j];

                // if (listObj.lat >= 39 && listObj.lat <= 41 && listObj.lon >= 115 && listObj.lon <= 116) {
                //     console.log(listObj);
                // }

                arr.push(listObj)
                count++;
            }
        }
        return arr;
    }

    /**
     * @description 根据纬度自动组装抽取数据 主要用于极射投影和兰伯特投影
     * @param {*} data  数据集合
     * @param {*} option  解析数据列表 lon,lat(无需传入) 例['u','v','t']
     * @param {Map} map  地图对象
     * @param {Number} symbolLength  符号像素长度
     */
    static getLonLatMatrixAuto({ data, option, map = getCurrentMap(), symbolLength }) {
        try {
            // 需要自动抽取的投影 "EPSG:102012", 
            const needHandleProj = ["EPSG:3574", "EPSG:35711", "EPSG:35712", "EPSG:3996"];
            let lat = data.lat, lon = data.lon;
            let arr = [], count = 0;
            //经度间隔
            let deltaLon = Math.abs(lon[1] - lon[0]);
            //每10度经度有几个风羽符号
            let num = 10 / deltaLon;
            //每10度经度的屏幕距离可以放下风羽符号的数量
            let pixelNum;
            // 当前纬度圈上10个度经度的屏幕像素距离
            let pixel10Lon;
            // 抽析最大经度范围
            const maxNum = 20;
            const maxInterval = maxNum / deltaLon;
            let proj = map.getView().getProjection().getCode();
            let start, end;
            let interval;//取点的间隔
            for (let i = 0; i < lat.length; i++) {
                if (lat[i] > 85 || lat[i] < -85) continue;//过滤极射投影会出问题的纬度

                start = [80, lat[i]];
                end = [90, lat[i]];
                pixel10Lon = getLonLatLength(start, end, map);
                pixelNum = pixel10Lon / symbolLength;

                for (let j = 0; j < lon.length; j++) {
                    let listObj = {};
                    if (lon[j] > 180) lon[j] -= 360
                    if (lon[j] < -180) lon[j] += 360
                    option.forEach(ele => {
                        listObj[ele] = data[ele][count];
                    });
                    listObj.lat = lat[i];
                    listObj.lon = lon[j];
                    count++;
                    // 当10经度放不下当前的间隔时
                    if (pixelNum < num && needHandleProj.includes(proj)) {
                        interval = parseInt(num / pixelNum) * 2;
                        interval = interval <= maxInterval ? interval : maxInterval;
                        if (j % interval == 0) {
                            arr.push(listObj)
                        }
                    } else {
                        arr.push(listObj)
                    }
                }
            }
            return arr;
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * @description 生成一个uuid
     */
    static getUuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";// bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);// bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    }
    /**
     * @description 四舍五入保留n位小数
     * @param data 要四舍五入的数字
     * @param n 要四舍五入保留小数的位数 (只能是0,1,2...的自然数,0代表四舍五入到个位数)
     * @param type 设定返回的数据类型为数值型或者字符型 'number'或者'string'默认'number',只有设定为'string'才会返回13.00这样的数据,否则只返回数值13
     * @return String类型的数字
     */
    static round(data, n, type = 'number') {
        n = Number(n);
        if (n < 0 || !Number.isInteger(n)) {
            console.error('四舍五入位数必须为自然数');
            return;
        }
        let numbers = '';
        // 保留几位小数后面添加几个0
        for (let i = 0; i < n; i++) {
            numbers += '0';
        }
        let num = Number("1" + numbers);
        let value = Math.round(Number(data) * num) / num;
        let str = value.toString();
        let rs = str.indexOf('.');
        if (n == 0) {
            if (type == 'string') {
                return data < 0 && Number(str) == 0 ? "-" + str : str;
            } else {
                return Number(str);
            }
        }
        //保留几位小数如果位数不够的需要补0
        if (rs < 0) {
            rs = str.length;
            str += '.';
        }
        while (str.length <= rs + n) {
            str += '0';
        }
        if (type == 'string') {
            return data < 0 && Number(str) == 0 ? "-" + str : str;//四舍五入后值为0的根据四舍五入前是负数的需要返回“-0”
        } else {
            return Number(str);
        }
    }
    /**
     * @param  val 要获取的时间列表类型 例： H：小时  M：分钟
     */
    static getTimeList(val) {
        if (val == "H") {
            let arr = [];
            for (let i = 1; i <= 23; i++) {
                arr.push({ value: i, lable: i });
            }
            return arr;
        }
        else if (val == "Hh") {
            let arr = [];
            for (let i = 1; i <= 23; i++) {
                arr.push({ value: ("0" + i).slice(-2), lable: ("0" + i).slice(-2) });
            }
            return arr;
        }
        else if (val == "M") {
            let arr = [];
            for (let i = 0; i < 60; i++) {
                arr.push({ value: ("0" + i).slice(-2), lable: ("0" + i).slice(-2) });
            }
            return arr;
        }
        else if (val == "Mm") {
            let arr = [];
            for (let i = 1; i < 60; i++) {
                arr.push({ value: ("0" + i).slice(-2), lable: ("0" + i).slice(-2) });
            }
            return arr;
        }
        else if (val == "Mm-d") {
            let arr = [];
            for (let i = 1; i <= 20; i++) {
                arr.push({ value: ("0" + i).slice(-2), lable: ("0" + i).slice(-2) + '分钟' });
            }
            return arr;
        }
        else if (val == "XXXX") {
            let arr = [];
            for (let i = 0; i <= 23; i++) {
                arr.push({ value: ("0" + i + "00").slice(-4), lable: ("0" + i + "00").slice(-4) });
            }
            return arr;
        }
        else if (val == "XX") {
            let arr = [];
            for (let i = 1; i <= 6; i++) {
                arr.push({ value: (i + "0"), lable: (i + "0") });
            }
            return arr;
        }
    }
    /**
     * @description 将多个逗号分隔的数组拆分重新组装为新对象组成的数组 转换示例==>[{A:1,B:'aa'},{A:2,B:'bb'},{A:3,B:'cc'},]{"A":'1,2,3',"B":"aa,bb,cc"}
     *          注意!!! 纯数字的属性即使传入的是字符串,结果返回的也会返回数值型
     * @param obj {elementName1:arrayString1,[elementName2:arrayString2]} 例{"A":'1,2,3',"B":"aa,bb,cc"}
     * @return {Array} 重新组装好的入口  例[{A:1,B:'aa'},{A:2,B:'bb'},{A:3,B:'cc'},]
     */
    static makeArrayByElement(obj) {
        if (!obj) {
            console.error('参数不正确:', obj);
            return false;
        }
        let keys = Object.keys(obj);
        if (!keys) {
            console.error('参数不正确:', obj);
            return false;
        }
        let tempArray = {};
        let isNumKeys = [];//记录是纯数字的要素
        for (let key of keys) {
            let element = obj[key];
            tempArray[key] = element.split(',');
            //粗略判断数组每个要素是否都为数字
            let regPos = /^\d+$/;
            if (regPos.test(element.replace(/,/g, '').replace(/\./g, ''))) {
                isNumKeys.push(key);
            }
        }
        let result = [];
        let arrayLength = obj[keys[0]].split(',').length;
        for (let index = 0; index < arrayLength; index++) {
            let obj = {};
            for (let key of keys) {
                if (isNumKeys.includes(key)) {
                    obj[key] = Number(tempArray[key][index]);
                } else {
                    obj[key] = tempArray[key][index];
                }
            }
            result.push(obj);
        }
        return result;
    }

    /**
     * @description 将对象组成的数组重新组装成逗号分隔的字符串组成的对象  转换示例[{A:1,B:'aa'},{A:2,B:'bb'},{A:3,B:'cc'}]==>{"A":'1,2,3',"B":"aa,bb,cc"}
     * @param array {elementName1:arrayString1,[elementName2:arrayString2]}  例[{A:1,B:'aa'},{A:2,B:'bb'},{A:3,B:'cc'}]
     * @return {Object} 重新组装好的入口 例{"A":'1,2,3',"B":"aa,bb,cc"}
     */
    static makeElementByArray(array) {
        if (!array || !array.length) {
            console.error('参数不正确:', array);
            return false;
        }
        //获取所有属性名
        let keys = Object.keys(array[0]);
        if (!keys || !keys.length) {
            console.error('数据结构不正确:', array);
            return false;
        }
        let result = {};
        let tempArra = {}
        //初始化
        for (let key of keys) {
            tempArra[key] = [];
        }
        //解构 组装
        for (let obj of array) {
            for (let key of keys) {
                tempArra[key].push(obj[key])
            }
        }
        for (let key of keys) {
            result[key] = tempArra[key].toString();
        }
        return result;
    }

    static addGeometryToMap(map, geometry) {
        // if (geometry instanceof LineString) {
        // } else if (geometry instanceof Polygon) {
        // } else if (geometry instanceof Point) {
        // }
        let f = new Feature({ geometry: geometry });
        let layer = new VectorLayer({
            source: new VectorSource({ wrapX: false })
        });
        layer.getSource().addFeature(f);
        map.addLayer(layer);
    }


    /**
     * @description 格式化经纬度格式为  120°E 78°S
     */
    static formatLonLat(lonlat, split = ',') {
        try {
            let [lon, lat] = lonlat;
            let lonStr = lon == 0 ? '0°' : lon >= 0 ? `${lon}°E` : `${-lon}°W`;
            let latStr = lat == 0 ? '0°' : lat >= 0 ? `${lat}°N` : `${-lat}°S`;
            return `${lonStr}${split}${latStr}`;
        } catch (error) {
            console.error(error)
            return "";
        }

    }

    //修复异常经纬度
    static fixLonLat(lonlat) {
        lonlat[0] = lonlat[0] > 180 ? 180 - lonlat[0] : lonlat[0];
        lonlat[0] = lonlat[0] < -180 ? lonlat[0] + 360 : lonlat[0];
        return lonlat;
    }

    /**
     * @desc 函数防抖
     * @param func 函数
     * @param wait 延迟执行毫秒数
     * @param immediate true 表立即执行，false 表非立即执行
     */
    static debounce(func, wait, immediate) {
        let timeout;
        return function () {
            let context = this
            let args = arguments

            if (timeout) clearTimeout(timeout)
            if (immediate) {
                let callNow = !timeout
                timeout = setTimeout(() => {
                    timeout = null
                }, wait)
                if (callNow) func.apply(context, args)
            } else {
                timeout = setTimeout(function () {
                    func.apply(context, args)
                }, wait)
            }
        }
    }

    /**
 * 节流Throttle
 */
    // module.exports.throttle = (fn, delay) => {
    //     // 定义上次触发时间
    //     let last = 0;
    //     return (...args) => {
    //       const now = + Date.now();
    //       console.log("call", now, last, delay);
    //       if (now > last + delay) {
    //         last = now;
    //         fn.apply(this, args);
    //       }
    //     };
    //   };
    //   /**
    //    * 防抖Debounce
    //    */
    //   module.exports.debounce = (fn, delay) => {
    //     let timer;
    //     return (...args) => {
    //       // 判断定时器是否存在，清除定时器
    //       if (timer) {
    //         clearTimeout(timer);
    //       }

    //       // 重新调用setTimeout
    //       timer = setTimeout(() => {
    //         fn.apply(this, args);
    //       }, delay);
    //     };
    //   };


    /**
    * @desc 函数节流
    * @param func 函数
    * @param wait 延迟执行毫秒数
    * @param type 1 表时间戳版，2 表定时器版
    */
    static throttle(func, wait, type) {
        let previous;
        let timeout;
        if (type === 1) {
            previous = 0
        } else if (type === 2) {
            timeout
        }
        return function () {
            let context = this
            let args = arguments
            if (type === 1) {
                let now = Date.now()

                if (now - previous > wait) {
                    func.apply(context, args)
                    previous = now
                }
            } else if (type === 2) {
                if (!timeout) {
                    timeout = setTimeout(() => {
                        timeout = null
                        func.apply(context, args)
                    }, wait)
                }
            }
        }
    }


    /**
     * @description 根据经纬度点和半径,获取一个经纬度点的圆
     * @param {*} lonlat 圆心经纬度
     * @param {*} distance 半径公里数
     * @param {*} points 构成圆的点数量
     * @param {*} step 寻找distance距离点的递增经纬度大小
     */
    static getCircleByDistance(lonlat, distance, points = 360, stepLonLat = 0.05) {
        // let deltaLonlat = [lonlat[0] + 1, lonlat[1]];
        // let length = getDistance(lonlat, deltaLonlat) / 1000;//经度1度的长度 单位千米
        // let r = distance / length;//求半径 以经纬度为单位
        // let coor = this.getArcPoints(lonlat, 0, Math.PI * 2, r, points);
        // coor.push(coor[0]);//闭合
        // return coor;
        let coor = this.getCircleLineByDistance(lonlat, distance, points, stepLonLat);
        coor.push(coor[0]);
        return coor;
    }

    static getCircleLineByDistance(lonlat, distance, points = 360, stepLonLat = 0.05) {
        let coor = [];
        // 圆周一圈每隔一定度数找到半径为distance公里数的经纬度点
        for (let i = 0; i < points; i++) {
            let length = 0;
            let angle = 360 / points * i;
            let endPoint = NaN;

            let j = 1;//递增
            while (length < distance * 1000) {
                let rad = this.angle2Rad(angle);
                endPoint = [lonlat[0] + stepLonLat * j * Math.sin(rad), lonlat[1] + stepLonLat * j * Math.cos(rad)];
                length = getDistance(lonlat, endPoint);
                j++;
            }
            coor.push(endPoint);
        }
        return coor;
    }

    /**
     * @description 根据经纬度点和半径,获取一个圆的feature
     * @param {*} lonlat 圆心经纬度
     * @param {*} distance 半径公里数
     * @param {*} proj 需要转换的投影code
     * @param {*} points 构成圆的点数量
     * @param {*} step 寻找distance距离点的递增经纬度大小
     */
    static getCircleFeatureByDistance(lonlat, distance, proj = "EPSG:4326", points = 1080, stepLonLat = 0.01) {
        const coor = this.getCircleByDistance(lonlat, distance, points, stepLonLat);
        let geometry = new Polygon([coor]);
        geometry.transform("EPSG:4326", proj);
        let feature = new Feature({ geometry });
        return feature;
    }

    /**
     * @description 计算风向 角度
     * @param {*} u 
     * @param {*} v 
     */
    static getUVAngle(u, v) {
        return this.getUVRad(u, v) * 180 / Math.PI;
    }

    /**
     * @description 计算风向 弧度
     * @param {*} u 
     * @param {*} v 
     */
    static getUVRad(u, v) {
        return (Math.atan2(u, v) + Math.PI);//+ Math.PI是因为风向表示的是风的去向,所以需要加180度
    }

    /**
     * @description 计算风速 
     * @param {*} u 
     * @param {*} v 
     */
    static getUVSpeed(u, v) {
        return Math.sqrt(u * u + v * v);
    }

    /**
     * @description 计算风速 原单位为KT,转换为米/秒
     * @param {*} u 
     * @param {*} v 
     */
    static getUVSpeedKT(u, v) {
        return this.getUVSpeed(u, v) * 1.9438445;
    }

    /**
     * @description 将Object或者Set等转换为数组
     * @param {*} data 
     */
    static toArray(data) {
        let result;
        if (Array.isArray(data)) {
            result = data;
        } else if (data instanceof Set) {
            result = Array.from(Set);
        } else {
            result = [data];
        }
        return result;
    }
}

/**
 * @description 计算两个经纬度点的屏幕距离
 * @param {*} lonlat1 
 * @param {*} lonlat2 
 * @param {Map} map 
 */
export function getLonLatLength(lonlat1, lonlat2, map) {
    let proj = map.getView().getProjection().getCode();
    let coor1 = fromLonLat(lonlat1, proj);
    let pixel1 = map.getPixelFromCoordinate(coor1);
    let coor2 = fromLonLat(lonlat2, proj);
    let pixel2 = map.getPixelFromCoordinate(coor2);
    return CommonUtils.getP2PDistance(pixel1, pixel2);
}

/**
 * @description 屏蔽右键弹出
 * @param {*} dom 需要屏蔽右键的dom元素
 */
export function blockRightClickMenu(dom) {
    dom.oncontextmenu = function (e) { return false; }
}



/**
 * @description 获取当前用户权限信息
 */
export function getCurrentAuthority() {
    let allNavs = sessionStorage.getItem("allNavs");
    if (!allNavs) {//用户信息不存在则跳转到登录界面
        return false
    } else {
        return JSON.parse(allNavs);
    }
}

/**
 * @description 获取当前用户值班信息
 */
export function getCurrentUserDutyInfo() {
    let userDutyInfo = sessionStorage.getItem("userDutyInfo");
    if (!userDutyInfo) {//用户信息不存在则跳转到登录界面
        return false
    } else {
        return JSON.parse(userDutyInfo);
    }
}


/**
 * @description 太极接口需要传递登录账号密码
 */
export function getLoginInfoApi() {
    let LoginInfoApi = sessionStorage.getItem("LoginInfoApi");
    if (!LoginInfoApi) {//用户信息不存在则跳转到登录界面
        return false
    } else {
        return JSON.parse(LoginInfoApi);
    }
}


/**
 * @description 获取utc时间 的本周周几
 * @param {*} day   获取周几 
 * @param {*} date 指定utc时间 
 * @returns 返回dayjs对象 可以用.format(dayjsFormat.nyrsfm)进行格式化
 */
export function getUTCday(day = '1', date = '',) {
    let time = '';
    if (date) time = getUTC(date);
    else time = getUTC();

    let nextWeek = '';
    if (time.day() == 0) nextWeek = getUTC(time).day(0).subtract((7 - Number(day)), 'day');
    else nextWeek = getUTC(time).day(1).add((0 + Number(day)), 'day');

    return nextWeek;
}
/**
 * @description 获取北京时间 的本周周几
 * @param {*} day   获取周几 
 * @param {*} date  北京时间
 * @returns 返回dayjs对象 可以用.format(dayjsFormat.nyrsfm)进行格式化
 */
export function getCSTday(day = '1', date = '',) {
    let time = '';
    if (date) time = getCST(date);
    else time = getCST();

    let nextWeek = '';
    if (time.day() == 0) nextWeek = getCST(time).day(0).subtract((7 - Number(day)), 'day');
    else nextWeek = getCST(time).day(0).add((0 + Number(day)), 'day');

    return nextWeek;
}
/**
 * 获取给定文本在 页面中 所占用的宽度
 * @param {*} text 给定文本
 * @param {*} fontSize 文本大小(数字)
 * @param {*} fontFamily 文本类型
 */
export function getFontDocumentWidth(text, fontSize = "12", fontFamily = "Lucida") {
    let body = document.querySelector('body');
    let div = document.createElement('div');
    div.style.cssText = `position:fixed;top:-1000px;left:-1000px;font-size:${fontSize}px;font-family:${fontFamily};`;
    div.innerHTML = text;
    body.appendChild(div);
    let width = div.offsetWidth;
    body.removeChild(div);
    return width;
}

/**
 * @description 阻止弹出鼠标右键
 * @param {*} evt 鼠标事件
 * @returns 
 */
export let stopContextmenuFunction = evt => {
    let event = evt || window.event;
    try {
        event.preventDefault();
    } catch (e) {
        //阻止冒泡
        e.cancelBubble = true;
        //阻止触发默认事件
        e.returnValue = false;
    }
    return false;
};

/**
 * 获取最大值 最小值 间隔
 * @param {any} data            interfeceinfo 数据  
 * @param {any} rangeCount      取值几份 默认 10 等分
 * 
 * @memberOf TableFunction
 */
export function getMaxOrMinData({ defaultSetting, dataValueMax, dataValueMin }, rangeCount = 10) {
    // 获取计算过后的色彩列表和范围
    let max = 0;
    let min = 0;
    // 为数据值域范围时
    if (defaultSetting.range == "range") {
        max = Number(dataValueMax);
        min = Number(dataValueMin);
    }
    // 为自定义间隔时
    else if (defaultSetting.range == "definition") {
        max = Number(defaultSetting.maxRange ?? dataValueMax);
        min = Number(defaultSetting.minRange ?? dataValueMin);
    }
    else if (defaultSetting.range == "appoint") {
        max = Number(dataValueMax);
        min = Number(dataValueMin);
    }
    if ((!max && max !== 0) || (!min && min !== 0) || max === min) throw (`最大值${dataValueMax}最小值${dataValueMin}间隔有误,`);
    let settingsStep = Number(defaultSetting.contourStep ? defaultSetting.contourStep : defaultSetting.step);
    if (settingsStep == 0) settingsStep = 10000;
    let { state, step } = this.handleDataState(max, min, settingsStep, rangeCount);
    if (!state) mainVue.popUp({ message: '值域范围有误或间隔不满足，已重新配置间隔值' })
    return { max, min, step }
}