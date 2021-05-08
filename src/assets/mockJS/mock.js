import Mock from 'mockjs';
import { colorBoard, isoLine } from '../../../public/colorBoard.js'
const Random = Mock.Random;


// 获取 指定长度 随机 数字 arr
let getLengthCreateArr = (length, max, min, dmax = 3, dmin = 0) => {
    let arr = []
    for (let i = 0; i < length; i++) {
        arr.push(Random.float(min, max, dmin, dmax))
    }
    return arr;
}


// 获取 风 数据
Mock.mock(/^\/windTemperature/, function (options) {
    console.info('>>>> ws >>>⚡⚡ options', options)
    return {
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'lon': Random.range(50, 140, 1),
        'lat': Random.range(0, 60, 1),
        // getLengthCreateArr(5400, 2 * Math.PI, -(2 * Math.PI)),
        'u': getLengthCreateArr(5400, 60, 0),
        'v': getLengthCreateArr(5400, 60, 0),
        't': getLengthCreateArr(5400, 40, -5, 0, 0),
    }
})

// 获取 等值线 数据
Mock.mock(/^\/isoLine/, function (options) {
    console.info('>>>> ws >>>⚡⚡ options', options)
    return isoLine;
})


// 获取色斑图 数据
Mock.mock(/^\/colorBoard/, function (options) {
    console.info('>>>> ws >>>⚡⚡ options', options)
    return colorBoard;
})

// 获取 色例 配置
Mock.mock(/^\/getColorList/, function (options) {
    console.info('>>>> ws >>>⚡⚡ options', options)
    return { "colorId": 139, "colorName": "TMP_14", "colorType": "justice", "groupId": 1, "groupName": null, "rangeStart": "-25", "rangeEnd": "45", "ranges": ["-25", "-20", "-15", "-10", "-5", "0", "5", "10", "15", "20", "25", "30", "35", "40", "45"], "colorList": ["#4A01BE", "#1801FF", "#0177FF", "#01E9FF", "#01FFF1", "#01FFAA", "#14FF01", "#A4FF01", "#F6FF01", "#FFBE01", "#FF9001", "#FF6601", "#FF0000", "#D50000"], "rangeCount": null, "gradually": 0 }
})



