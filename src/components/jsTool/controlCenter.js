import windTemperature from '../../views/staticDisplay/drawTool/windTemperature.js';
import { VectorLayerShow } from './mapTool.js';

let classAll = {
    // 风温
    windTemperature,
}

/**
 * 
 * @param {*} type 绘制类型
 * @param {*} data 所需数据
 */
export const drawFeatures = ({ type, data }) => {
    let handel = classAll[type];
    let features = new handel().initFeatures(data);
    VectorLayerShow.getSource().addFeatures(features);
    console.info('>>>> ws >>>⚡⚡ features', features)
}