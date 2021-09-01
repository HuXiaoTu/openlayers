
/**
 * 监听某个dom 的变化
 * @param {any} targetNode      要监听的dom  
 * @param {any} callback        变化后的回调
 * @param {any} childList       监听的变化项
 * 
 */
export const watchDomChange = ({ targetNode, callback, childList = true }) => {
    // 观察器的配置（需要观察什么变动）
    const config = { childList };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);
    // 开始观察目标节点
    observer.observe(targetNode, config);
}

/**
 * 获取给定文本在 页面中 所占用的宽度
 * @param {*} text 给定文本
 * @param {*} fontSize 文本大小(数字)
 * @param {*} fontFamily 文本类型
 */
export function getFontDocumentWidth(text, fontSize = "12", fontFamily = "Lucida") {
    let body = document.querySelector('body');
    let div = document.createElement('div');
    div.style.cssText = `position:fixed;top:-1000px;left:-1000px;font-size:${fontSize}px;font-family:${fontFamily};`;
    div.innerHTML = text;
    body.appendChild(div);
    let width = div.offsetWidth;
    body.removeChild(div);
    return width;
}
