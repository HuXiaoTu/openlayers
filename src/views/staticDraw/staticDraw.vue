<template>
    <!-- 静态显示页面 -->
    <div class="staticDrawMenu">
        <!-- 控制 按钮 区域 -->
        <div class="staticDrawMenuTop">
            <span class="settingBtn el-icon-s-tools" @click="settingsBtn"></span>
        </div>
        <!-- 按钮 展示列表 -->
        <div class="staticDrawMenuBtns">
            <!-- 提示信息 -->
            <el-tooltip
                placement="top"
                :enterable="false"
                v-for="(item,index) in symbolList"
                :key="index"
                :content="item.title"
                :disabled="isTooltip"
            >
                <!-- 按钮 btn -->
                <span
                    :class="{'staticDrawMenuBtn':true,'animationOperate':animationOperate}"
                    :key="index"
                    :draggable="animationOperate"
                >
                    <!-- icon 图标 -->
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="item.iconClass" />
                    </svg>
                </span>
            </el-tooltip>
        </div>
    </div>
</template>
<script>
import { onMounted, ref } from 'vue';
export default {
    data() {
        return {
            // 符号列表
            symbolList: [
                {
                    iconClass: '#icontempCenter',
                    isActive: false,
                    title: "温度中心",
                    featureType: "TemperatureCenter",
                    btnType: "W_C_point"
                },
                {
                    iconClass: '#iconhlPressure',
                    isActive: false,
                    title: "高低压中心/高低位势中心",
                    featureType: "PressCenter",
                    btnType: "H_L_point"
                },
                {
                    iconClass: '#icontempColdCenter',
                    isActive: false,
                    title: "温度冷中心/冷堆",
                    featureType: "ColdCenter",
                    btnType: "point"
                },
                {
                    iconClass: '#iconsingleRain',
                    isActive: false,
                    title: "单站降水",
                    featureType: "WeatherSingle",
                    drawType: "Rain",
                    btnType: "point"
                },
                {
                    iconClass: '#iconhotCyclone',
                    isActive: false,
                    title: "热带气旋",
                    featureType: "Hotcyclone",
                    btnType: "point"
                },
                {
                    iconClass: '#iconsinglePointSymbol',
                    isActive: false,
                    title: "单点符号",
                    featureType: "SinglePoint",
                    btnType: "SinglePoint"
                },
                {
                    iconClass: '#iconweatherArea2',
                    isActive: false,
                    title: "天气区",
                    featureType: "AnalysisWeatherArea2",
                    btnType: "area"
                },
                {
                    iconClass: '#iconisobaricLine',
                    isActive: false, title: "等压线",
                    featureType: "AnalysisContourPress",
                    btnType: "lineWithHeight",
                    heightArr: [
                        { label: "200hPa", id: 200 },
                        { label: "500hPa", id: 500 },
                        { label: "地面分析", id: 9999 },
                    ]
                },
                {
                    iconClass: '#iconisobaricLine',
                    isActive: false, title: "等风速线",
                    featureType: "AnalysisContourWind",
                    btnType: "lineWithHeight",
                    heightArr: [
                        { label: "200hPa", id: 200 },
                        { label: "500hPa", id: 500 },
                        { label: "地面分析", id: 9999 },
                    ]
                },
                {
                    iconClass: '#iconisobaricLine',
                    isActive: false, title: "等高线",
                    featureType: "AnalysisContourHeight",
                    btnType: "lineWithHeight",
                    heightArr: [
                        { label: "200hPa", id: 200 },
                        { label: "500hPa", id: 500 },
                        { label: "地面分析", id: 9999 },
                    ]
                },
                {
                    iconClass: '#iconupLine',
                    isActive: false,
                    title: "等变压线",
                    featureType: "VarContourPress",
                    btnType: "line"
                },
                {
                    iconClass: '#iconchangeHighLine',
                    isActive: false,
                    title: "24小时变高",
                    featureType: "VariableHeight24Hour",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "500hPa", id: 500 },
                    ]
                },
                {
                    iconClass: '#icontempLine',
                    isActive: false,
                    title: "等温线",
                    featureType: "TemperatureContour",
                    btnType: "lineWithHeight",
                    heightArr: [
                        { label: "500hPa", id: 500 },
                        { label: "700hPa", id: 700 },
                        { label: "850hPa", id: 850 },
                        { label: "925hPa", id: 925 },
                        { label: "地面分析", id: 9999 },
                    ]
                },
                {
                    iconClass: '#icontempWetLine',
                    isActive: false,
                    title: "等露点温度线/等比湿线",
                    featureType: "DewPointHumidityContour",
                    btnType: "lineWithHeight",
                    heightArr: [
                        { label: "700hPa", id: 700 },
                        { label: "850hPa", id: 850 },
                        { label: "925hPa", id: 925 },
                        { label: "地面分析", id: 9999 },
                    ]
                },
                {
                    iconClass: '#icondryLine',
                    isActive: false,
                    title: "干线",
                    featureType: "DryLine",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "700hPa", id: 700 },
                        { label: "925hPa", id: 925 },
                        { label: "地面分析", id: 9999 },
                    ]
                },
                {
                    iconClass: '#icontempPointLine',
                    isActive: false,
                    title: "等温度露点差线",
                    featureType: "EqualTempDewPointDiff",
                    btnType: "lineWithHeight",
                    heightArr: [
                        { label: "700hPa", id: 700 },
                        { label: "850hPa", id: 850 },
                        { label: "925hPa", id: 925 },
                        { label: "地面分析", id: 9999 },
                    ]
                },
                {
                    iconClass: '#icontempSlot',
                    isActive: false,
                    title: "温度槽冷槽",
                    featureType: "ColdTrough",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "500hPa", id: 500 },
                        { label: "700hPa", id: 700 },
                    ]
                },
                {
                    iconClass: '#icontemperatureRidge',
                    isActive: false,
                    title: "温度脊暖脊",
                    featureType: "WarmTrough",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "700hPa", id: 700 },
                        { label: "850hPa", id: 850 },
                        { label: "925hPa", id: 925 },
                    ]
                },
                {
                    iconClass: '#icondiffLine',
                    isActive: false,
                    title: "700与500温度差/850与500温度差",
                    featureType: "TemperatureDiff500",
                    btnType: "lineWithHeight",
                    heightArr: [
                        { label: "700hPa", id: 700 },
                        { label: "850hPa", id: 850 },
                    ]
                },
                {
                    iconClass: '#iconchangTempLine',
                    isActive: false,
                    title: "变温线",
                    featureType: "VariableTemperature",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "500hPa", id: 500 },
                        { label: "700hPa", id: 700 },
                    ]
                },
                {
                    iconClass: '#icondryTongue',
                    isActive: false,
                    title: "干舌",
                    featureType: "DryTongue",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "500hPa", id: 500 },
                        { label: "700hPa", id: 700 },
                    ]
                },
                {
                    iconClass: '#iconwetTongue',
                    isActive: false,
                    title: "湿舌",
                    featureType: "WetTongue",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "850hPa", id: 850 },
                        { label: "925hPa", id: 925 },
                        { label: "地面分析", id: 9999 },
                    ]
                },
                {
                    iconClass: '#iconrapids',
                    isActive: false,
                    title: "急流",
                    featureType: "JetStreamAnalysis",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "200hPa", id: 200 },
                        { label: "500hPa", id: 500 },
                        { label: "700hPa", id: 700 },
                        { label: "850hPa", id: 850 },
                        { label: "925hPa", id: 925 },
                    ]
                },
                {
                    iconClass: '#iconjetStream',
                    isActive: false,
                    title: "急流核",
                    featureType: "JetStreamCore",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "200hPa", id: 200 },
                    ]
                },
                {
                    iconClass: '#iconjetStreamLine',
                    isActive: false,
                    title: "显著流线",
                    featureType: "JetStreamNotable",
                    btnType: "lineWithoutType",
                    heightArr: [
                        { label: "500hPa", id: 500 },
                        { label: "700hPa", id: 700 },
                        { label: "850hPa", id: 850 },
                        { label: "925hPa", id: 925 },
                        { label: "地面分析", id: 9999 },
                    ]
                },
                {
                    iconClass: '#iconwarmFront',
                    isActive: false,
                    title: "暖锋",
                    featureType: "WarmFrontAnalysis",
                    btnType: "lineWidth"
                },
                {
                    iconClass: '#iconstationaryFront',
                    isActive: false,
                    title: "静止锋",
                    featureType: "StationaryFrontAnalysis",
                    btnType: "lineWidth"
                },
                {
                    iconClass: '#iconoccludedFront',
                    isActive: false,
                    title: "锢囚锋",
                    featureType: "OccludedFrontAnalysis",
                    btnType: "lineWidth"
                },
                {
                    iconClass: '#iconcoldFront',
                    isActive: false,
                    title: "冷锋",
                    featureType: "ColdFrontAnalysis",
                    btnType: "lineWidth"
                },
                {
                    iconClass: '#iconslotLine',
                    isActive: false,
                    title: "切变线/槽线",
                    featureType: "SlotLine",
                    btnType: "line"
                },
                {
                    iconClass: '#iconconvergenceLine',
                    isActive: false,
                    title: "辐合线",
                    featureType: "ConvergenceAnalysis",
                    btnType: "lineWithoutTypeHeight"
                },
                {
                    iconClass: '#iconsquallline',
                    isActive: false,
                    title: "飑线",
                    featureType: "SqualllineAnalysis",
                    btnType: "lineWithoutTypeHeight"
                },
            ]
        }
    },

    setup() {
        // 编辑 动画
        let animationOperate = ref(0);
        animationOperate.value = false;
        // 设置按钮触发
        let settingsBtn = () => {
            animationOperate.value = !animationOperate.value;
        }

        // 是否显示 提示信息
        let isTooltip = ref(0);
        isTooltip.value = false;
        // 处理 拖拽 事件绑定
        let dragEvent = () => {
            let node = document.querySelector(".staticDrawMenuBtns");

            // 防止提示信息 影响拖拽位置
            node.onmousedown = () => isTooltip.value = true;
            node.ondragend = () => isTooltip.value = false;

            let draging = null;
            //使用事件委托，将li的事件委托给ul
            node.ondragstart = (event) => {
                event.dataTransfer.setData("te", event.target.innerText); //不能使用text，firefox会打开新tab
                // draging = event.target.parentNode;
                draging = event.target;
            }
            node.ondragover = (event) => {
                event.preventDefault();
                let ele = event.target;
                if (ele.classList.contains('staticDrawMenuBtn')) {
                    // let target = ele.parentNode;
                    let target = ele;
                    if (target !== draging) {
                        let targetRect = target.getBoundingClientRect();
                        let dragingRect = draging.getBoundingClientRect();
                        if (target) {
                            if (target.animated) return;
                        }
                        if (_index(draging) < _index(target)) {
                            target.parentNode.insertBefore(draging, target.nextSibling);
                        } else {
                            target.parentNode.insertBefore(draging, target);
                        }
                        _animate(dragingRect, draging);
                        _animate(targetRect, target);
                    }
                }
            }

            //获取元素在父元素中的index
            function _index(el) {
                let index = 0;

                if (!el || !el.parentNode) {
                    return -1;
                }

                while (el && (el = el.previousElementSibling)) {
                    index++;
                }

                return index;
            }
            function _animate(prevRect, target) {
                let ms = 300;

                if (ms) {
                    let currentRect = target.getBoundingClientRect();

                    if (prevRect.nodeType == 1) {
                        prevRect = prevRect.getBoundingClientRect();
                    }

                    _css(target, 'transition', 'none');
                    _css(target, 'transform', 'translate3d(' +
                        (prevRect.left - currentRect.left) + 'px,' +
                        (prevRect.top - currentRect.top) + 'px,0)'
                    );

                    target.offsetWidth; // 触发重绘
                    _css(target, 'transition', 'all ' + ms + 'ms');
                    _css(target, 'transform', 'translate3d(0,0,0)');

                    clearTimeout(target.animated);
                    target.animated = setTimeout(function () {
                        _css(target, 'transition', '');
                        _css(target, 'transform', '');
                        target.animated = false;
                    }, ms);
                }
            }
            //给元素添加style
            function _css(el, prop, val) {
                let style = el && el.style;

                if (style) {
                    if (val == void 0) {
                        if (document.defaultView && document.defaultView.getComputedStyle) {
                            val = document.defaultView.getComputedStyle(el, '');
                        } else if (el.currentStyle) {
                            val = el.currentStyle;
                        }

                        return prop == void 0 ? val : val[prop];
                    } else {
                        if (!(prop in style)) {
                            prop = '-webkit-' + prop;
                        }
                        style[prop] = val + (typeof val == 'string' ? '' : 'px');
                    }
                }
            }
        }
        onMounted(() => {
            // 绑定 拖拽 事件
            dragEvent();
        })

        return {
            isTooltip,
            animationOperate,
            settingsBtn,
        }
    },
}
</script>
<style lang="scss" scoped>
.staticDrawMenu {
    width: 300px;
    height: 100%;
    background-color: rgba(54, 54, 54, 0.8);
    color: #ffffff;
    padding: 5px;
    .staticDrawMenuTop {
        height: 30px;
        position: relative;
        .settingBtn {
            position: absolute;
            right: 5px;
            top: 5px;
            cursor: pointer;
        }
    }
    .staticDrawMenuBtns {
        padding: 5px;
        overflow: hidden;
        .staticDrawMenuBtn {
            cursor: pointer;
            display: inline-block;
            padding: 4px 0;
            font-size: 25px;
            width: 12%;
            text-align: center;
        }
        .icon {
            border-radius: 5px;
        }
        .animationOperate {
            animation: editAnimation 0.5s linear infinite;
        }
    }
}
</style>