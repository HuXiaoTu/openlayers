import { fromLonLat } from 'ol/proj';
import { getCurrentProjCode } from './mapTool';

/**
 * 给入经纬度坐标点 返回当前投影坐标点
 * @param {*} coordinate 经纬度坐标点
 * @returns 当前投影坐标点
 */
export function currentProjCodefromLonLat(coordinate) {
    return fromLonLat(coordinate, getCurrentProjCode())
}