// 所有全局组件 
const modules = import.meta.globEager('../../views/components/com/*/*.vue');

// 安装全局组件 
export const initCom = function (app) {
    for (const path in modules) {
        app.component(getComponentName(path), modules[path].default);
    }
}

// 获取组件名
const getComponentName = function (path) {
    const start = path.lastIndexOf('/');
    const end = path.lastIndexOf('.');
    return path.substring(start + 1, end);
}
