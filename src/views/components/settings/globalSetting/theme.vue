<template>
    <div class="themeSetting">
        <div style="height: 50px;display: flex; align-items: center;">
            <el-divider content-position="left">主题设置</el-divider>
        </div>
        <div>
            <!-- 主题 -->
            <div
                v-for="ele in themeList"
                :key="ele.theme"
                class="layout-mode-item"
                :class="useSetting.theme === ele.theme ? 'layout-mode-item-active' : ''"
                @click="useSetting.changeTheme(ele.theme)"
            >
                <div class="mode-name">{{ele.name.substring(0,2)}}</div>
                <el-container style="height: 50px;">
                    <el-header
                        height="8px"
                        :style="{backgroundColor:ele.topBackgroundColor}"
                    ></el-header>
                    <el-container>
                        <el-aside
                            width="15px"
                            :style="{backgroundColor:ele.backgroundColor}"
                        ></el-aside>
                        <el-main style="background-color: #eee;"></el-main>
                    </el-container>
                </el-container>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSettingStore } from '../../../../store/setting';

let useSetting = useSettingStore();


// 主题列表
const themeList = computed(() => {
    let list = useSetting.themeConfigObj, themeList = [];
    for (const key in list) {
        if (Object.hasOwnProperty.call(list, key)) {
            let element = list[key];
            element.theme = key;
            themeList.push(element);
        }
    }
    return themeList;
})

</script>

<style lang="scss" >
.themeSetting {
    .layout-mode-item {
        width: 70px;
        height: 52px;
        display: inline-block;
        margin-right: 10px;
        border: 1px #e5e5e5 solid;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        border-radius: 1px;

        .mode-name {
            position: absolute;
            line-height: 55px;
            text-align: center;
            width: 100%;
            font-size: 12px;
            color: #bbb;
            transition: all 0.2s;
            text-indent: 1em;
        }
    }

    .layout-mode-item-active {
        border: 1px #2d8cf0 solid;
        box-shadow: 0 0 5px #a6c5e7 inset;

        .mode-name {
            color: #2d8cf0;
        }
    }
}
</style>