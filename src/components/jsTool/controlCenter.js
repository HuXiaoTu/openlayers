import { VectorLayerShow } from './mapTool.js';
import windTemperature from '../../views/staticDisplay/drawTool/windTemperature.js';
import gridPoint from '../../views/staticDisplay/drawTool/gridPoint.js'
import colorBoard from '../../views/staticDisplay/drawTool/colorBoard.js'

let classAll = {
    // 风温
    windTemperature,
    // 格点值
    gridPoint,
    // 色斑图
    colorBoard,
}

/**
 * 根据控制类型 调用相关 构建类
 * @param {*} type 绘制类型
 * @param {*} data 所需数据
 */
export const drawFeatures = ({ type, data }) => {
    let handel = classAll[type];
    if (!handel) return console.info('ws >>>> ⚡⚡ 该功能暂时未开发',);

    let features = new handel().setData(data).initFeatures();
    // 如果为 异步 需要 then 接受
    if (!Array.isArray(features)) features.then(res => {
        VectorLayerShow.getSource().addFeatures(res);
        return;
    })
    // 当为 正常数据 数组时
    VectorLayerShow.getSource().addFeatures(features);
}