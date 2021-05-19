// openlayer 鼠标右键菜单

export default class mailMenu {

    /**
     * @param {*} contextmenu 右键菜单容器
     * @memberof mailMenu
     */
    constructor(contextmenu) {
        this.contextmenu = contextmenu;
        this.init();
        this.addItems();
    }

    /**
     * 数据初始化
     */
    init() {
        this.featureCollection = this.contextmenu.featureCollection;//回调函数所用参数，默认传递选中的符号集合
    }

    setItemWith(width) {
        this.contextmenu.width = width;
    }


    /**
     * @description 添加 菜单 项
     */
    addItems(list = ['delete']) {

        if (list.includes('delete')) this.addItem(this.getDeletItem());

    }

    getDeletItem() {
        // return this.getItem("删除", ContextMenuItemAction.deleteFeature);
        return this.getItem("删除", () => {
            console.info('>>>> ws >>>⚡⚡ 我点击了删除。。。',)
        });
    }

    getAboveItem() {
        return this.getItem("置顶", ContextMenuItemAction.aboveFeature);
    }

    getBelowItem() {
        return this.getItem("置底", ContextMenuItemAction.belowFeature);
    }

    getModifyItem() {
        return this.getItem("修改", ContextMenuItemAction.modifyFeature);
    }

    /**
     * @description 添加菜单
     *
     * @param {*} item
     * @param {*} separator 是否需要分隔符（添加位置在菜单项之前）默认不需要
     */
    addItem(item, separator = false) {
        if (separator) this.contextmenu.push('-');
        this.contextmenu.push(item);
    }

    /**
     * 组装回调函数由的obj.data的值，子类可按需覆写
     */
    assemblyData() {
        // return this.featureCollection;
        return { featureCollection: this.featureCollection };
    }

    /**
     * @description 获取菜单项
     *
     * @param {*} text 菜单项名字
     * @param {*} icon 菜单项图标
     * @param {*} callback 点击回调函数
     * @returns 菜单项
     * @memberof BaseContextMenu
     */
    getItem(text, callback, icon = '') {
        return {
            text: ' ' + text,
            icon: icon,
            data: this.assemblyData(),
            callback: callback
        }
    }

}