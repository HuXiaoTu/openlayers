// 初始化数据


// 关于地图相关的参数
export const mapConfig = {
    center: [100, 38],              //地图中心点经纬度
    zoom: 5,                        //当前缩放级别
    minZoom: 3.5,                   //最小缩放级别
    maxZoom: 19,                    //最大缩放级别
}

// 主题配置列表 
export const themeConfig = {
    // 深色主题
    dark: {
        color: 'white',
        backgroundColor: 'rgba(54, 54, 54, 0.8)',
        topBackgroundColor: '#1F6B75',
        btnBgColor: 'rgba(26, 70, 87, 0.774)',
        name: '深色主题',
    },
    // 浅色主题
    light: {
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        topBackgroundColor: '#409eff',
        btnBgColor: 'rgba(160,207,255, 0.66)',
        name: '浅色主题',
    }
}