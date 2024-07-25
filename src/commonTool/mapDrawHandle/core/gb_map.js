import { Vector, Group } from 'ol/layer';
import { easeIn as AnimationIn, easeOut as AnimationOut } from 'ol/easing';

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

// ===========================  view相关操作  =======================================
(function () {
    /**
     * view 动画效果
     * @param {view}        指定view
     * @param {center}      指定动画停留坐标位置
     * @param {zoom}        指定动画停留缩放级别
     * @param {duration}    指定动画持续时间
     * @returns 
     */
    gbMap.viewAnimation = ({ view = null, center, cb = null, zoom = gbMap.mapConfig.zoom, duration = 1000 }) => {
        if (!view) return new Error('view动画效果，必须指定view');
        // 动画执行程序
        let AnimationView = (fun) => {
            view.animate(
                {
                    center,
                    duration,
                    zoom,
                    easing: fun
                },
            );
        }

        // 一种缓和反弹的方法
        let bounce = (t) => {
            let s = 7.5625;
            let p = 2.75;
            let l;
            if (t < 1 / p) {
                l = s * t * t;
            } else {
                if (t < 2 / p) {
                    t -= 1.5 / p;
                    l = s * t * t + 0.75;
                } else {
                    if (t < 2.5 / p) {
                        t -= 2.25 / p;
                        l = s * t * t + 0.9375;
                    } else {
                        t -= 2.625 / p;
                        l = s * t * t + 0.984375;
                    }
                }
            }
            // 执行动画
            AnimationView(l);

            return l;
        }
        // 反复弹跳
        let elastic = (t) => {
            // 执行动画
            AnimationView(Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1);

            return (
                Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1
            );
        }
        // 跳跃到指定位置
        let flyTo = () => {
            let animationZoom = zoom;
            let parts = 2;
            let called = false;
            function callback(complete) {
                --parts;
                if (called) {
                    return;
                }
                if (parts === 0 || !complete) {
                    called = true;
                    if (cb) cb(complete);
                }
            }
            view.animate(
                {
                    center: center,
                    duration: duration,
                },
                callback
            );
            view.animate(
                {
                    zoom: animationZoom - 1,
                    duration: duration / 2,
                },
                {
                    zoom: animationZoom,
                    duration: duration / 2,
                },
                callback
            );
        }
        // 渐入
        let easeIn = () => {
            AnimationView(AnimationIn);
        }
        // 渐出
        let easeOut = () => {
            AnimationView(AnimationOut);
        }
        return { bounce, elastic, easeIn, easeOut, flyTo };
    }
})();


export default gbMap;