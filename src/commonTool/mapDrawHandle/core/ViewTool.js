import { easeIn as AnimationIn, easeOut as AnimationOut } from 'ol/easing';
import { getCurrentView } from "./mapTool.js";
import { mapConfig } from "../../commonConfig/config.js";

/**
* @description view 动画效果
*/
export const viewAnimation = ({ center, cb = null, zoom = mapConfig.zoom, duration = 2000 }) => {
    // 动画执行程序
    let AnimationView = (fun) => {
        getCurrentView().animate(
            {
                center: center,
                duration: duration,
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
        getCurrentView().animate(
            {
                center: center,
                duration: duration,
            },
            callback
        );
        getCurrentView().animate(
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