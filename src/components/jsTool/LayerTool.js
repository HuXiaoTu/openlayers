import { getCurrentMap } from "./mapTool";

/**
* @description 清空 绘制图层数据
*/
export const clearMapDraw = () => {
    let groupObj = getCurrentMap().getLayerGroup();
    let groupList = groupObj.getLayers();
    let groupArray = groupList.getArray();
    // 循环所有 group
    groupArray.forEach(ele => {
        let name = ele.get('groupName');
        // 跳过 底图 group
        if (name === 'dataOverlayGroup') return;
        let arr = ele.getLayersArray();
        // 跳过空 group
        if (arr.length === 0) return;
        // 获取group 所有layer 执行 清空layer操作
        arr.forEach(item => item.getSource().clear());
    });
}