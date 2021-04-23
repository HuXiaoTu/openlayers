import { fromLonLat, toLonLat } from 'ol/proj';
import { getCurrentMap } from "./mapTool.js";

/**
 * @description 获取坐标点所在经度和屏幕垂直向上方向的偏移角度(单纯替换王印方法)
 * @param {*} coor 坐标点
 * @returns
 */
export function getDeviationAngle(coor, map = getCurrentMap()) {
    try {
        if (Number.isNaN(coor[0]) || Number.isNaN(coor[1])) return NaN;
        let radian = 0;
        let angle = 0;
        let b_pixel = map.getPixelFromCoordinate(coor);//屏幕开始点
        let sourceProjCode = map.getView().getProjection().getCode();
        if ('EPSG:4326' != sourceProjCode) {
            let lonlat = toLonLat(coor, sourceProjCode);
            let lonlatDelta = [lonlat[0], lonlat[1] + 0.1];//取维度0.1度偏移点
            let coorDelta = fromLonLat(lonlatDelta, sourceProjCode);
            let e_pixel = map.getPixelFromCoordinate(coorDelta);//屏幕结束点
            let dx = e_pixel[0] - b_pixel[0];
            let dy = e_pixel[1] - b_pixel[1];
            radian = Math.atan2(dy, dx);
            radian += Math.PI / 2;
            angle = radian * 180 / Math.PI;
        }
        return -angle;
    } catch (error) {
        console.error(error, coor);
        return;
    }

}
/**
 * @description 获取经度和屏幕正北的偏移角度
 *
 * @export
 * @param {*} lonLatPoint 经纬度坐标点
 * @returns
 */
export function getDeviationAngleByLonLatPoint(lonLatPoint, map) {
    if (!map) {
        map = getCurrentMap();
    }
    let sourceProjCode = map.getView().getProjection().getCode();
    if ('EPSG:4326' == sourceProjCode) {
        return 0;
    }
    let point_coordinate = fromLonLat(lonLatPoint, sourceProjCode);
    return getDeviationAngle(point_coordinate, map);
}



/**
 * @description 获取经度和屏幕正北的偏移弧度
 *
 * @export
 * @param {*} point_coordinate
 * @returns
 */
export function getDeviationRadian(point_coordinate) {
    let radian = 0;
    let map = getCurrentMap();
    //console.info('当前坐标 >>>>', point_coordinate);
    let b_pixel = map.getPixelFromCoordinate(point_coordinate);
    //console.info('屏幕坐标 >>>>', b_pixel);
    let sourceProjCode = map.getView().getProjection().getCode();
    if ('EPSG:4326' != sourceProjCode) {
        let coordinate = toLonLat(point_coordinate, sourceProjCode);
        //console.info('转换4326坐标为>>>> ', coordinate);
        coordinate = [coordinate[0], coordinate[1] + 1];
        //console.info('维度加10度坐标为>>>> ', coordinate);
        coordinate = fromLonLat(coordinate, sourceProjCode);
        //console.info('加10度转换为当前坐标系坐标为>>>> ', coordinate);
        let e_pixel = map.getPixelFromCoordinate(coordinate);
        //console.info('加10度转换为屏幕坐标为>>>>', e_pixel);
        let dx = e_pixel[0] - b_pixel[0];
        let dy = e_pixel[1] - b_pixel[1];
        radian = Math.atan(dx / dy);
    }
    return radian;
}

/**
 * @description 根据两个坐标点计算偏移角度
 *
 * @export
 * @param {*} begin_coordinate 起点
 * @param {*} end_coordinate 终点
 * @returns 获取的偏移角度是距离正北方向的角度
 */
export function deviationAngleByCC(begin_coordinate, end_coordinate) {
    let map = getCurrentMap();
    let b_pixel = map.getPixelFromCoordinate(begin_coordinate);
    let e_pixel = map.getPixelFromCoordinate(end_coordinate);
    let dx = e_pixel[0] - b_pixel[0];
    let dy = e_pixel[1] - b_pixel[1];
    let angle = Math.atan(dy / dx) * 180 / Math.PI;
    //console.info('dx / dy>>>>', dx / dy);
    if (dx >= 0 && dy >= 0) {
        //90-180
        angle = 90 + Math.atan(dy / dx) * 180 / Math.PI;
    } else if (dx >= 0 && dy <= 0) {
        //0-90
        angle = Math.atan(dx / dy) * 180 / Math.PI;
        angle = -angle;
    } else if (dx <= 0 && dy >= 0) {
        //180-270
        angle = 180 - Math.atan(dx / dy) * 180 / Math.PI;
        //angle = -angle;
    } else if (dx <= 0 && dy <= 0) {
        //270-360
        angle = 270 + Math.atan(dy / dx) * 180 / Math.PI;
    }
    return angle + getDeviationAngle(begin_coordinate);
}

/**
 * @description 根据长度和角度计算点
 *
 * @export
 * @param {*} coordinate 原始点
 * @param {*} angle 角度 0-360
 * @param {*} distance 像素长度
 * @returns
 */
export function coordinate2Coordinate(coordinate, angle, distance, map = getCurrentMap()) {
    angle = angle - getDeviationAngle(coordinate);
    if (angle > 360) angle = angle - 360;
    if (angle < 0) angle = angle + 360;
    let radian = angle * Math.PI / 180.0;
    let deltaX = Math.sin(radian) * distance;
    deltaX = Math.abs(deltaX);
    let deltaY = Math.cos(radian) * distance;
    deltaY = Math.abs(deltaY);
    //console.log(deltaX, deltaY);
    let pixel = map.getPixelFromCoordinate(coordinate);
    //console.log("pixel", pixel);
    let end_pixel = [];
    // end_pixel[0] = pixel[0] + deltaX;
    // end_pixel[1] = pixel[1] + deltaY;
    if (angle <= 90) {
        end_pixel[0] = pixel[0] + deltaX;
        end_pixel[1] = pixel[1] - deltaY;
    } else if (angle <= 180) {
        end_pixel[0] = pixel[0] + deltaX;
        end_pixel[1] = pixel[1] + deltaY;
    } else if (angle <= 270) {
        end_pixel[0] = pixel[0] - deltaX;
        end_pixel[1] = pixel[1] + deltaY;
    } else if (angle <= 360) {
        end_pixel[0] = pixel[0] - deltaX;
        end_pixel[1] = pixel[1] - deltaY;
    }
    //console.log("end_pixel", end_pixel);
    return map.getCoordinateFromPixel(end_pixel);
}

/**
 * @description 转换为指定位数的数字
 *
 * @export
 * @param {*} value 需要转换的参数
 * @param {number} [digit=3] 默认位数
 * @param {string} [defaultValue='XXX'] 默认值
 * @returns 数字位数转换
 */
export function transformValue(value, digit = 3, defaultValue = 'XXX') {
    if (value == 'SFC') return value;
    if (value && value != defaultValue) {
        value = (parseInt(value) + Math.pow(10, digit)).toString().substring(1, digit + 1);
    } else {
        value = defaultValue;
    }
    return value;
}

/**
 * @description 当前坐标维度加【offset】之后的坐标
 *
 * @export
 * @param {*} coordinate 当前坐标
 * @param {*} offset 维度增量
 * @returns 维度增加指定增量后的坐标点
 */
export function latitudeAdd(coordinate, offset) {
    let map = getCurrentMap();
    let b_pixel = map.getPixelFromCoordinate(coordinate);
    let sourceProjCode = map.getView().getProjection().getCode();
    if (sourceProjCode == 'EPSG:4326') {
        coordinate = [coordinate[0], coordinate[1] + offset];
    } else {
        coordinate = toLonLat(coordinate, sourceProjCode);
        coordinate = [coordinate[0], coordinate[1] + offset];
        coordinate = fromLonLat(coordinate, sourceProjCode);
    }
    return coordinate;
}

/**
 * @description 计算两个坐标点的像素距离
 *
 * @export
 * @param {*} coordinate1
 * @param {*} coordinate2
 * @returns
 */
export function pixelDistance(coordinate1, coordinate2) {
    let map = getCurrentMap();
    let pixel1 = map.getPixelFromCoordinate(coordinate1);
    let pixel2 = map.getPixelFromCoordinate(coordinate2);
    let dx = Math.abs(pixel1[0] - pixel2[0]);
    let dy = Math.abs(pixel1[1] - pixel2[1]);
    if (dx == 0) return dy;
    if (dy == 0) return dx;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * @@description 判断对象是否有值
 *
 * @export
 * @param {*} obj
 * @returns
 */
export function isExistValue(obj) {
    if (typeof obj == 'undefined' || obj === null || obj === 'null' || obj === '') {
        return false;
    } else {
        return true;
    }
}
