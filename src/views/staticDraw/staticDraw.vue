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
                v-for="(item,index) in symbolList"
                :enterable="false"
                :key="index"
                :content="item.title"
                :disabled="isTooltip"
            >
                <span
                    :class="{'staticDrawMenuBtn':true,'animationOperate':animationOperate}"
                    :key="index"
                    :draggable="animationOperate"
                    @click="clickDraw"
                    @dblclick.stop
                >
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
import { symbolList } from '../../assets/staticData/staticData';
export default {
    data() {
        return {
            // 符号列表
            symbolList: symbolList
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
        // 绑定 拖拽 事件
        onMounted(() => dragEvent())

        // 绘制按钮触发
        let clickDraw = () => {
            // 如果在编辑状态 取消绘制状态
            if (animationOperate.value) return

            console.info('>>>> ws >>>⚡⚡ 准备工作完成，开始绘制',)
        }

        return {
            isTooltip,
            animationOperate,
            settingsBtn,
            clickDraw,
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