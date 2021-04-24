import { VectorLayerShow } from './mapTool.js';
import windTemperature from '../../views/staticDisplay/drawTool/windTemperature.js';
import gridPoint from '../../views/staticDisplay/drawTool/gridPoint.js'

let classAll = {
    // 风温
    windTemperature,
    // 格点值
    gridPoint,
}

/**
 * 
 * @param {*} type 绘制类型
 * @param {*} data 所需数据
 */
export const drawFeatures = ({ type, data }) => {
    let handel = classAll[type];
    if (!handel) return console.info('ws >>>> ⚡⚡ 该功能暂时未开发',);

    let features = new handel().setData(data).initFeatures();
    VectorLayerShow.getSource().addFeatures(features);
    console.info('>>>> ws >>>⚡⚡ features', features)
}