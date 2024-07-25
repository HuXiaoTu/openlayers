import { Vector, Group } from 'ol/layer';

// =========================== windows顶级map对象封装一系列工具方法 =============================
let gbMap = {
    updateTime: '2024-7-25',
};

// ===========================  地图基础配置  =======================================
(function () {
    let mapConfig = {
        center: [100, 38],              //地图中心点经纬度
        zoom: 5,                        //当前缩放级别
        minZoom: 3.5,                   //最小缩放级别
        maxZoom: 19,                    //最大缩放级别
    }
    gbMap.mapConfig = mapConfig; // 最终环境 , 上线前请选择正确的环境
})();

// ===========================  feature相关操作  =======================================
(function () {
    /** 
     * 在map中删除某个feature
     * @param {*} map       所在map
     * @param {*} feature   要删除的feature
     */
    gbMap.delFeatureToMap = (map = null, feature = null) => {
        if (!map) return new Error('必须传入map后，才能执行删除feature操作');
        if (!feature) return new Error('必须传入feature，才能执行删除操作');

        let featureIdToRemove = feature.getId();

        function removeFeatureFun(featureId, target) {
            // 获取地图上的所有图层
            const layers = target.getLayers().getArray();

            // 遍历所有图层（包括图层组）
            for (let i = 0; i < layers.length; i++) {
                const layer = layers[i];
                if (layer instanceof Vector) { // 检查图层是否为矢量图层
                    const source = layer.getSource();
                    const features = source.getFeatures();

                    // 遍历图层中的所有要素
                    let delFeature = features.find(f => f.getId() === featureId);
                    if (delFeature) {
                        source.removeFeature(delFeature); // 从源中移除要素
                        return false;// 结束该操作
                    }

                } else if (layer instanceof Group) { // 检查图层是否为图层组
                    // 遍历图层组中的所有图层
                    removeFeatureFun(featureId, layer); // 递归调用函数以处理子图层
                }
            }
        }
        // 调用函数以移除指定id的要素
        removeFeatureFun(featureIdToRemove, map);
    };
})();


export default gbMap;