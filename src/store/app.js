import { defineStore } from 'pinia'

/**
 * 有关 app 临时布局的相关状态
 */
export const useAppStore = defineStore({
    id: 'app',
    state: () => {
        return {
            // ------------------------------- 状态 -------------------------------
            isShowSetting: false,   // 是否显示全局设置界面
        }
    },
    actions: {}
})
