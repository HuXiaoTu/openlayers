
/**
 * 监听某个dom 的变化
 * @param {any} targetNode      要监听的dom  
 * @param {any} callback        变化后的回调
 * @param {any} childList       监听的变化项
 * 
 */
export const watchDomChange = ({ targetNode, callback, childList = true }) => {
    if (!targetNode) return;
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

/**
 * 创建一个自定义右键菜单
 * @param {*} styleCustom 样式
 * @param {*} menuList 自定义列表选项
 * @returns 
 */
export function createContextMenu(styleCustom, menuList = []) {
    let { left, top, backgroundColor, color, fontSize } = styleCustom;
    if (left === undefined || top === undefined) return new Error('自定义弹框样式:left、right 为必填项！');
    // 始终保持 只有一个 弹框
    let oldPop = document.querySelector('.customContextMenu');
    if (oldPop) document.body.removeChild(oldPop);

    // 外壳
    let dom = document.createElement('div');
    dom.setAttribute('class', 'customContextMenu');
    const css = `
    min-width:200px;
    min-height:200px;
    padding:5px;
    position:fixed;
    top:${top};
    left:${left};
    z-index:100;
    border-radius: 5px;
    box-shadow: rgb(0 0 0 / 20%) 3px 3px 5px;
    font-size: ${fontSize || '13px'};
    color: ${color || '#222'};
    background: ${backgroundColor || '#fff'};
    display:flex;
    flex-direction: column;`
    dom.style.cssText = css;

    menuList.forEach(ele => {
        let { icon, name, callBack } = ele;
        // 某行
        let contRow = document.createElement('div');
        contRow.style.cssText = `
        display:flex;
        height:30px;
        align-items:center;
        cursor:pointer;`

        // 某行 - 点击触发
        contRow.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.info('>>>> ws >>> 🐌💬 点击了某行', ele);
        }

        // 某行 - 移入&&移出 样式
        contRow.onmouseenter = (e) => e.target.style.backgroundColor = '#ccc';
        contRow.onmouseleave = (e) => e.target.style.backgroundColor = '#fff';

        // 某行 - 图标
        let contRowIcon = document.createElement('div');
        contRowIcon.style.cssText = `
        font-size:${icon.fontSize || '20px'};
        color:${color || 'black'};
        font-family:myIcon;`
        contRowIcon.setAttribute('class', 'iconFont');
        contRowIcon.innerHTML = icon.name;
        contRow.appendChild(contRowIcon);

        // 某行 - 文字
        let contRowFont = document.createElement('div');
        contRowFont.style.cssText = `flex:1;padding-left:5px;`
        contRowFont.innerText = name;
        contRow.appendChild(contRowFont);

        dom.appendChild(contRow);
    })

    document.body.appendChild(dom);

    window.onclick = null;
    window.onclick = () => {
        // 始终保持 只有一个 弹框
        let oldPop = document.querySelector('.customContextMenu');
        if (oldPop) document.body.removeChild(oldPop);
    }
}