<template>
    <!-- 符号绘制 -->
    <div
        class="staticDrawMenuSpot"
        ref="staticDrawMenuDom"
    >
        <!-- 顶部 显示 操作栏 -->
        <div class="staticDrawMenuTop">
            <!-- 提示信息 title 区域 -->
            <span
                class="staticDrawMenuSpotTitle"
                @click="changeListState"
            >
                <span>{{title}}</span>
                <svg
                    class="icon"
                    :class="{'iconRotate':!showListState}"
                    aria-hidden="true"
                >
                    <use xlink:href="#iconyoujiantou1" />
                </svg>
            </span>
            <!-- 控制 按钮 区域 -->
            <transition name="el-zoom-in-top">
                <div
                    v-show="showListState"
                    class="staticDrawMenuSpotTitleBtn"
                >
                    <div
                        :class="{'settingBtn':animationOperate,'fontFamily':true,}"
                        @click="settingsBtn"
                    ></div>
                </div>
            </transition>
        </div>
        <!-- 符号列表 -->
        <div
            class="staticDrawMenuList"
            :class="{'animationList':!showListState}"
        >
            <!-- 提示信息 -->
            <in-tooltip
                v-for="(item, index) in symbolList"
                :key="index"
                :content="item.title"
                :disabled="isTooltip"
            >
                <span
                    :class="{'staticDrawMenuBtn': true,'animationOperate': animationOperate,}"
                    :key="index"
                    :draggable="animationOperate"
                    @click="clickDraw($event,item)"
                    @dblclick.stop
                    @contextmenu.prevent="contextmenuCustom"
                >
                    <svg
                        class="icon"
                        aria-hidden="true"
                    >
                        <use :xlink:href="item.iconClass" />
                    </svg>
                </span>
            </in-tooltip>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { ElMessage } from 'element-plus';
import { createContextMenu } from '../../../commonTool/commonUtil/domHandle';

export default {
    emits: ['drawBtnClick'],
    props: {
        // 绘制类
        drawToolHandel: {
            type: Object,
        },
        // 符号绘制列表
        symbolList: {
            type: Array,
            default: () => []
        },
        // title 提示信息
        title: {
            type: String,
            default: '',
        }
    },
    setup(props, { emit }) {
        // 地图绘制类
        let drawToolHandel = props.drawToolHandel;
        // 符号列表
        let symbolList = props.symbolList;
        // 组件顶级dom
        let staticDrawMenuDom = ref(null);

        // 编辑 动画
        let animationOperate = ref(0);
        animationOperate.value = false;
        // 是否显示 提示信息
        let isTooltip = ref(false);

        // 设置按钮触发
        let settingsBtn = () => {
            // 取消绘制状态
            if (drawToolHandel) drawToolHandel.clearInteraction();

            animationOperate.value = !animationOperate.value;
            // 当为 编辑状态 绑定 拖拽 事件
            if (animationOperate.value) dragEvent();
            else {
                // 清空绑定事件
                let node = staticDrawMenuDom.value;
                node.onmousedown = null;
                node.ondragend = null;
                node.ondragstart = null;
                node.ondragover = null;

                isTooltip.value = false;
            }
        }

        // 处理 拖拽 事件绑定
        let dragEvent = () => {

            let node = staticDrawMenuDom.value;

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

        // 绘制按钮触发
        let clickDraw = (e, { fontFamily, type }) => {
            // 如果在编辑状态 取消绘制状态
            if (animationOperate.value) return

            // 处理当前选中效果
            let box = staticDrawMenuDom.value;
            let dom = e.currentTarget;
            let select = box.querySelector('.activeBtn');
            if (select && dom != select) select.classList.remove('activeBtn');

            // flg 当前选中状态
            let flg = dom.classList.toggle('activeBtn');
            // 取消绘制状态
            if (!flg) return drawToolHandel.clearInteraction();

            emit('drawBtnClick', { fontFamily, type });

        }

        // 当前展开状态 默认展开
        let showListState = ref(0);
        showListState.value = symbolList.length === 0 ? false : true;
        // 点击改变状态
        let changeListState = () => {
            if (symbolList.length !== 0) showListState.value = !showListState.value;
            else ElMessage({ message: '未查询到数据列表！', type: 'warning', });
        }

        // 自定以 右键菜单
        const contextmenuCustom = (e) => {
            let { clientY, clientX } = e;
            let styleCustom = {
                left: clientX + 'px',
                top: clientY + 'px',
            }
            let menuList = [
                {
                    icon: { name: '', color: 'black', },
                    name: '菜单1',
                    callBack: () => { }
                }
            ]
            // 生成 自定义右键菜单
            createContextMenu(styleCustom, menuList);
        }


        return {
            // 符号列表
            symbolList,
            animationOperate,

            isTooltip,
            settingsBtn,
            clickDraw,

            showListState,
            changeListState,

            staticDrawMenuDom,
            // 自定义 右键菜单
            contextmenuCustom,
        }
    }
}
</script>

<style lang="scss" scoped>
.staticDrawMenuSpot {
    .staticDrawMenuTop {
        margin-bottom: 5px;
        display: flex;

        .staticDrawMenuSpotTitle {
            font-size: 14px;
            cursor: pointer;
            user-select: none;

            >span {
                vertical-align: middle;
            }

            .icon {
                width: 15px;
                height: 15px;
                margin-left: 10px;
                vertical-align: middle;
                transform-origin: center;
                transform: rotate(90deg);
                transition: transform 0.3s linear;
            }

            .iconRotate {
                transform: rotate(0deg);
            }
        }

        .staticDrawMenuSpotTitleBtn {
            flex: 1;
            text-align: right;

            .settingBtn {
                color: #000;
            }

            .fontFamily {
                display: inline-block;
                cursor: pointer;
                width: 20px;
                height: 20px;
            }
        }
    }

    .staticDrawMenuList {
        margin: 5px;
        max-height: 250px;
        overflow: hidden;
        transition: max-height 0.3s linear;
        box-sizing: border-box;

        .staticDrawMenuBtn {
            cursor: pointer;
            display: inline-block;
            padding: 4px 0;
            font-size: 25px;
            width: 12%;
            text-align: center;
            border-radius: 5px;

            .icon {
                border-radius: 5px;
                border: 1px solid #ccc;
            }
        }

        .animationOperate {
            animation: editAnimation 0.3s linear infinite;
        }
    }

    .animationList {
        max-height: 0;
        // padding-bottom: 0;
    }
}
</style>