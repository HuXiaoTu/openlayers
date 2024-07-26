<!-- 图层管理 -->
<template>
    <div class="layerManagement">
        <!-- 展开||收起 按钮 -->
        <div
            class="layerManagementBtn"
            @click="isOpen = !isOpen"
        >
            <DArrowRight
                v-if="isOpen"
                style="width: 15px;height: 15px;"
            />
            <DArrowLeft
                v-else
                style="width: 15px;height: 15px;"
            />
        </div>
        <!-- 内容展示 -->
        <div
            v-if="isOpen"
            @contextmenu.prevent
            class="layerManagementContent scroll"
        >
            <div
                v-for="item in dataOverlayGroup.getLayers().getArray()"
                :key="item.ol_uid"
                class="layerItemRow"
                :class="{'activeLayer':acLayerId === item.ol_uid}"
                @contextmenu.prevent="contextmenuCustom($event,item)"
                @click.stop="setActiveLayerId(item.ol_uid)"
            >
                <el-icon
                    :size="18"
                    class="layerItemRowBtn"
                    @click.stop="setVisible(item)"
                >
                    <View v-if="item.getVisible()" />
                    <Hide v-else />
                </el-icon>
                <span>{{ item.get('name')||('图层管理'+item.ol_uid) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from "ol/source";

import { createContextMenu } from '@/commonTool/commonUtil/domHandle';
import { dataOverlayGroup, addLayer, delLayer, activeLayerId, setActiveLayerId, getCurrentMap } from '@/commonTool/mapDrawHandle/core/mapTool';
let isOpen = ref(false);

const acLayerId = computed(() => activeLayerId.value);

// 设置图层可见性
const setVisible = (item) => {
    // 设置图层可见性
    item.setVisible(!item.getVisible());
    // 由于设置完成后,可能地图会不更新,需要手动触发地图更新
    getCurrentMap().render();
}

// 自定以 右键菜单
const contextmenuCustom = (e, layer) => {
    let { clientY, clientX } = e;
    let styleCustom = {
        left: clientX + 'px',
        top: clientY + 'px',
    }
    let menuList = [
        {
            icon: { name: '&#xe887;', color: 'black', },
            name: '新增图层',
            callBack: addLayer,
        },
        {
            icon: { name: '&#xe63f;', color: 'black', },
            name: '删除图层',
            callBack: () => delLayer(layer),
        },
    ]
    // 生成 自定义右键菜单
    createContextMenu(styleCustom, menuList);
}
</script>

<style lang="scss" scoped>
.layerManagement {
    width: max-content;
    height: max-content;
    position: relative;

    .layerManagementBtn {
        width: 22px;
        height: 22px;
        background-color: #ffffff;
        border-radius: 2px;
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .layerManagementContent {
        width: 300px;
        height: 400px;
        overflow-y: auto;
        border-radius: 5px;
        padding: 10px;
        background-color: rgba(54, 54, 54, 0.8);

        .layerItemRow {
            height: 40px;
            display: flex;
            align-items: center;
            border-radius: 5px;
            padding: 0 5px;
            cursor: pointer;
            color: #ffffff;

            .layerItemRowBtn {
                margin-right: 10px;
            }
        }

        .layerItemRow:hover {
            box-shadow: 0px 0px 5px 2px #727272;
        }

        .activeLayer {
            background-color: rgba(26, 70, 87, 0.773);
        }
    }
}
</style>