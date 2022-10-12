import { defineStore } from 'pinia'
import { themeConfig } from '../commonTool/commonConfig/config';

/**
 * 定义所有全局设置
 */
export const useSettingStore = defineStore({
    id: 'setting',
    state: () => {
        // 声明默认配置   --- 注意：改动配置需要手动刷新页面才会生效
        const defaultSetting = {
            title: '',		// 页面标题
            logo: 'https://oss.dev33.cn/sa-plus/logo/logo-480.png',		// logo地址
            version: 'v1.4.0',          // 版本号 
            updateTime: '2022-4-19',    // 更新日期 

            theme: 'dark',              // 主题  --- 可选值：dark / light
            themeConfig: {},            // 主题配置
            switchMode: 'opacity',      // 页面切换动画类型  --- 可选值：opacity、right-jump-right、left-jump-left
            tipDirection: 'top',        // Tooltip 出现的位置 --- 可选值：top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
            greyMode: false,            // 是否灰色模式
            weakMode: false,            // 是否色弱模式

            // 主题列表
            themeConfigObj: themeConfig,
        };

        // 获取当前主题 配置项
        defaultSetting.themeConfig = themeConfig[defaultSetting.theme];


        return defaultSetting;
    },
    actions: {
        // 主题调整
        changeTheme: function (theme) {
            if (!theme) return;
            // 设置主题
            this.theme = theme;
            // 获取当前主题 配置项
            this.themeConfig = themeConfig[this.theme];
        },
        // Tooltip 出现的位置调整
        changeTipDirection: function (tipDirection) {
            if (!tipDirection) return;
            this.tipDirection = tipDirection;
        },
        // 灰色模式调整
        greyModeChange: function (value) {
            if (value) {
                document.body.classList.add('gray-mode');
            } else {
                document.body.classList.remove('gray-mode');
            }
        },
        // 色弱模式调整
        weakModeChange: function (value) {
            if (value) {
                document.body.classList.add('weak-mode');
            } else {
                document.body.classList.remove('weak-mode');
            }
        },
    }
})
