import Mock from 'mockjs';
const Random = Mock.Random;


// 获取 指定长度 随机 数字 arr
let getLengthCreateArr = (length, max, min, dmax = 3, dmin = 0) => {
    let arr = []
    for (let i = 0; i < length; i++) {
        arr.push(Random.float(min, max, dmin, dmax))
    }
    return arr;
}

Mock.mock(/^\/windTemperature/, function (options) {
    console.info('>>>> ws >>>⚡⚡ options', options)
    return {
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'lon': Random.range(50, 140, 1),
        'lat': Random.range(0, 60, 1),
        'u': getLengthCreateArr(5400, 2 * Math.PI, -(2 * Math.PI)),
        'v': getLengthCreateArr(5400, 2 * Math.PI, -(2 * Math.PI)),
        't': getLengthCreateArr(5400, 40, -5, 0, 0),
    }
})
