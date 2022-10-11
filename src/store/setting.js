import { defineStore } from 'pinia'
import { nextTick } from "vue";
import { ElMessage } from "element-plus";

/**
 * 定义所有全局设置
 */
export const useSettingStore = defineStore({
    id: 'setting',
    state: () => {
        // 声明默认配置   --- 注意：改动配置需要手动刷新页面才会生效
        const defaultSetting = {
            title: 'Sa-Sso-Pro',		// 页面标题
            logo: 'https://oss.dev33.cn/sa-plus/logo/logo-480.png',		// logo地址
            version: 'v1.4.0',          // 版本号 
            updateTime: '2022-4-19',    // 更新日期 

            theme: 'dark',             // 主题  --- 可选值：dark / light
            tipDirection: 'top',        // Tooltip 出现的位置 --- 可选值：top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
            greyMode: false,            // 是否灰色模式
            weakMode: false,            // 是否色弱模式
        };

        // 返回
        return defaultSetting;
    },
    actions: {
        // 主题调整
        changeTheme: (theme) => {
            if (theme) this.theme = theme;
        },
        // Tooltip 出现的位置调整
        changeTipDirection: (tipDirection) => {
            if (tipDirection) this.tipDirection = tipDirection;
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
