import { ElMessage } from 'element-plus'

import { VectorLayerShow } from '../../../commonTool/mapDrawHandle/core/mapTool.js';
import windTemperature from '../../../commonTool/mapDrawHandle/drawTool/productList/windTemperature.js';
import gridPoint from '../../../commonTool/mapDrawHandle/drawTool/productList/gridPoint.js';
import colorBoard from '../../../commonTool/mapDrawHandle/drawTool/productList/colorBoard.js';
import isoLine from '../../../commonTool/mapDrawHandle/drawTool/productList/isoLine.js';

let classAll = {
    // 风温
    windTemperature,
    // 格点值
    gridPoint,
    // 色斑图
    colorBoard,
    // 等值线
    isoLine,
}

/**
 * 根据控制类型 调用相关 构建类
 * @param {*} type 绘制类型
 * @param {*} data 所需数据
 */
export const drawFeatures = ({ type, data }) => {
    let handel = classAll[type];
    if (!handel) return ElMessage('⚡⚡该功能暂时未开发');

    let features = new handel().setData(data).initFeatures();
    // 如果为 异步 需要 then 接受
    if (!Array.isArray(features)) features.then(res => {
        VectorLayerShow.getSource().addFeatures(res);
        return;
    })
    // 当为 正常数据 数组时
    VectorLayerShow.getSource().addFeatures(features);
}