/* eslint-disable */
import axios from '@/axios/index.js';
import router from '@/route/route.js'
import deepcopy from 'deepcopy';
import layer from './layer.js';
import { nextTick } from "vue";
import qs from 'qs';
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import "dayjs/locale/zh-cn";
import _ from 'lodash';
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale('zh-cn');
import { ElMessage } from 'element-plus'


// =========================== sa对象封装一系列工具方法 =============================
var sa = {
    updateTime: '2022-2-25',
    info: 'Adjust the f5TableHeight function so that it can refresh normally when there are multiple tables on a page'
};

// ===========================  ajax的封装  =======================================
(function () {
    sa.axios = axios;
    /** 对ajax的再封装, 这个ajax假设你的接口会返回以下格式的内容
     {
            "code": 200,
            "msg": "ok",
            "data": []
        }
     如果返回的不是这个格式, 你可能需要改动一下源码, 要么改动服务端适应此ajax, 要么改动这个ajax适应你的服务端
     * @param {Object} url 请求地址
     * @param {Object} data 请求参数
     * @param {Object} success200 当返回的code码==200时的回调函数
     * @param {Object} cfg 其它配置，可配置项有：
     {
            msg: '',		// 默认的提示文字 填null为不提示
            type: 'get',	// 设定请求类型 默认post
            baseUrl: '',	// ajax请求拼接的父路径 默认取 sa.cfg.api_url
            success500: fn,	// code码等于500时的回调函数 (一般代表服务器错误)
            success403: fn,	// code码等于403时的回调函数 (一般代表无权限)
            success401: fn,	// code码等于401时的回调函数 (一般代表未登录)
            errorfn: fn,	// ajax发生错误时的回调函数 (一般是ajax请求本身发生了错误)
            complete: fn,	// ajax无论成功还是失败都会执行的回调函数
        }
     */
    sa.ajax = function (url, data, success200, cfg) {
        // 如果是简写模式(省略了data参数)
        if (typeof data === 'function') {
            cfg = success200;
            success200 = data;
            data = {};
        }

        // 默认配置
        var defaultCfg = {
            msg: cfg?.msg || 'Trying to load...',	// 提示语
            baseUrl: (url.indexOf('http') === 0 ? '' : sa.cfg.api_url),// 父url，拼接在url前面
            type: 'post',	// 默认请求类型
            success200,			// code=200, 代表成功
            errorfn: function (xhr) {		// ajax发生异常时的默认处理函数
                if (cfg.errorCallback) cfg.errorCallback(xhr);
                errStatusHandle(xhr);
            },
        }
        // 将调用者的配置和默认配置合并
        cfg = sa.extendJson(cfg, defaultCfg);

        // 打印请求地址和参数, 以便调试
        console.log("Request address:" + cfg.baseUrl + url);
        console.log("Request parameters:" + JSON.stringify(data));

        // 开始显示loading图标
        if (cfg.isLoading === undefined ? true : cfg.isLoading) sa.loading(cfg?.msg);

        // 请求头，追加Token
        let headers = {
            "Content-Type": cfg.ContentType ? cfg.ContentType : "application/x-www-form-urlencoded",
            'X-Requested-With': 'XMLHttpRequest',
        };

        // 开始请求ajax
        return axios({
            url: cfg.baseUrl + url,
            method: cfg.type,
            headers: headers,
            data: sa.getParams(data, cfg),
            params: (cfg.type === 'get') ? data : '',
            paramsSerializer: params => {
                return qs.stringify(params, { indices: false })
            }
        }).then(function (response) { // 成功时执行
            sa.hideLoading();
            console.log('Return data:', response.data);

            // 如果相应的处理函数存在
            let res = response.data;
            return cfg.success200(res);
        }).catch(function (error) {
            console.info('>>>> ws >>> 🐌💬 ajax', error)
            sa.hideLoading();
            return cfg.errorfn(error.response);
        }).then(() => {
            if (cfg.complete) cfg.complete();
        });

    };

    sa.upDataFormData = function (url, data, success200, cfg) {
        // 如果是简写模式(省略了data参数)
        if (typeof data === 'function') {
            cfg = success200;
            success200 = data;
            data = {};
        }

        // 默认配置
        var defaultCfg = {
            msg: 'Trying to load...',	// 提示语
            baseUrl: (url.indexOf('http') === 0 ? '' : sa.cfg.api_url),// 父url，拼接在url前面
            success200,			// code=200, 代表成功
            errorfn: function (xhr) {		// ajax发生异常时的默认处理函数
                errStatusHandle(xhr)
            },
        }

        // 将调用者的配置和默认配置合并
        cfg = sa.extendJson(cfg, defaultCfg);

        // 开始显示loading图标
        if (cfg.msg != null) {
            sa.loading(cfg.msg);
        }

        // 开始请求ajax
        return axios({
            url: cfg.baseUrl + url,
            method: 'post',
            headers: {
                "Content-Type": "multipart/form-data",
                'X-Requested-With': 'XMLHttpRequest',
            },
            data,
        }).then(function (response) { // 成功时执行
            sa.hideLoading();
            // 如果相应的处理函数存在
            let res = response.data;
            return cfg.success200(res);
        }).catch(function (error) {
            sa.hideLoading();
            return cfg.errorfn(error.response);
        }).then(() => {
            if (cfg.complete) cfg.complete();
        });
    };

    sa.ajaxDown = function (url, data, success200, cfg) {
        // 如果是简写模式(省略了data参数)
        if (typeof data === 'function') {
            cfg = success200;
            success200 = data;
            data = {};
        }

        // 默认配置
        var defaultCfg = {
            msg: 'Trying to load...',	// 提示语
            baseUrl: (url.indexOf('http') === 0 ? '' : sa.cfg.api_url),// 父url，拼接在url前面
            type: 'post',	// 默认请求类型
            success200,			// code=200, 代表成功
            errorfn: function (xhr) {		// ajax发生异常时的默认处理函数
                errStatusHandle(xhr)
            },
        }

        // 将调用者的配置和默认配置合并
        cfg = sa.extendJson(cfg, defaultCfg);

        // 打印请求地址和参数, 以便调试
        console.log("Request address:" + cfg.baseUrl + url);
        console.log("Request parameters:" + JSON.stringify(data));

        // 开始显示loading图标
        if (cfg.msg != null) {
            sa.loading(cfg.msg);
        }

        // 请求头，追加Token
        let headers = {
            "Content-Type": cfg.ContentType ? cfg.ContentType : "application/x-www-form-urlencoded",
            'X-Requested-With': 'XMLHttpRequest',
        };

        // 开始请求ajax
        return axios({
            url: cfg.baseUrl + url,
            method: cfg.type,
            headers: headers,
            responseType: 'blob',
            data: sa.getParams(data, cfg),
            params: (cfg.type === 'get') ? data : '',
            paramsSerializer: params => {
                return qs.stringify(params, { indices: false })
            }
        }).then(function (response) { // 成功时执行
            sa.hideLoading();
            let headDisposition = response.headers['content-disposition'];
            let value = headDisposition.match(/filename=\"(.*)\"/)[1];
            let name = value ? decodeURI(value) : '';
            success200(response.data, name);
        }).catch(function (error) {
            sa.hideLoading();
            // 由于后端返回错误信息被blob转换为文件形式 故需要解析为文本格式进行操作
            let fileReader = new FileReader();
            fileReader.onload = function (fileData) {
                error.response.data = JSON.parse(fileData.target.result);
                cfg.errorfn(error.response);
            }
            fileReader.onerror = function () {
                cfg.errorfn(error.response);
            }
            if (error?.response?.data) return;
            fileReader.readAsText(error.response.data)
        }).then(() => {
            if (cfg.complete) cfg.complete();
        });

    };

    // 模拟 ajax 请求   --- 此请求并不会向后台发送请求，只会模拟显示一个 loading 图标 
    sa.ajax2 = function (url, data, success200, cfg) {
        // 如果是简写模式(省略了data参数)
        if (typeof data === 'function') {
            cfg = success200;
            success200 = data;
            data = {};
        }
        // 几个默认配置
        cfg = cfg || {};
        cfg.baseUrl = (url.indexOf('http') === 0 ? '' : sa.cfg.api_url);	// 父url，拼接在url前面
        // 设定一个默认的提示文字
        if (cfg.msg === undefined || cfg.msg === null || cfg.msg === '') {
            cfg.msg = 'Trying to load...';
        }
        // 默认延时函数
        if (cfg.sleep === undefined || cfg.sleep === null || cfg.sleep === '' || cfg.sleep === 0) {
            cfg.sleep = 600;
        }
        // 默认的模拟数据
        cfg.res = cfg.res || {
            code: 200,
            msg: 'ok',
            data: []
        }
        // 开始loding
        sa.loading(cfg.msg);

        // 打印请求地址和参数, 以便调试
        console.log("======= Simulate ajax =======");
        console.log("Request address:" + cfg.baseUrl + url);
        console.log("Request parameters:" + JSON.stringify(data));

        // 模拟ajax的延时
        setTimeout(function () {
            sa.hideLoading();	// 隐藏掉转圈圈
            console.log('Return data:', cfg.res);
            success200(cfg.res);
        }, cfg.sleep)
    };


    // 请求状态码常见错误信息
    let errStatusHandle = (xhr) => {
        switch (xhr.status) {
            case 401:
                sa.$page.openLogin();
                break;
            case 403:
                const path = router.resolve({ path: '/403' })
                sa.openCurrent(path.href);
                break;
            case 400:
            case 500:
                sa.alert(xhr.data?.message || '未知异常！');
                break;
            default:
                sa.alert(`错误 ${xhr.status}:未知错误！`);
                break;
        }
    }
    // 抛出备用
    sa.ajaxErrStatusHandle = errStatusHandle;
})();

// ===========================  封装弹窗相关函数   =======================================
(function () {
    var me = sa;
    if (layer) {
        sa.layer = layer;
        // layer.ready(function(){});
    }

    // tips提示文字
    me.msg = function (msg, cfg) {
        msg = msg || 'Successful operation';
        layer.msg(msg, cfg);
    };

    // 操作成功的提示
    me.ok = function (msg) {
        msg = msg || 'Successful operation';
        layer.msg(msg, { anim: 0, icon: 1, time: 2000 });
    }
    me.ok2 = function (msg) {
        msg = msg || 'Successful operation';
        layer.msg(msg, { anim: 0, icon: 6, time: 2000 });
    }

    // 操作失败的提示
    me.error = function (msg) {
        ElMessage.error(msg);
    }
    me.error2 = function (msg) {
        msg = msg || 'operation failed';
        layer.msg(msg, { icon: 5 });
    }

    // alert弹窗 [text=提示文字, okFn=点击确定之后的回调函数]
    me.alert = function (text, okFn) {
        // 开始弹窗
        layer.alert(text, function (index) {
            layer.close(index);
            if (okFn) {
                okFn();
            }
        });
    };

    // 询问框 [text=提示文字, okFn=点击确定之后的回调函数]
    me.confirm = function (text, okFn, cancel, option = {}) {
        layer.confirm(text, option, function (index) {
            layer.close(index);
            if (okFn) okFn();
        }.bind(this), function () {
            if (cancel) cancel();
        });
    };

    // 输入框 [title=提示文字, okFn=点击确定后的回调函数, formType=输入框类型(0=文本,1=密码,2=多行文本域) 可省略, value=默认值 可省略 ]
    me.prompt = function (title, okFn, formType, value) {
        layer.prompt({
            title: title,
            formType: formType,
            value: value
        }, function (pass, index) {
            layer.close(index);
            if (okFn) {
                okFn(pass);
            }
        });
    }
    // ============== 一些常用弹窗 =====================

    // 大窗显示一个图片
    // 参数: src=地址、w=宽度(默认80%)、h=高度(默认80%)
    me.showImage = function (src, w, h) {
        w = w || '80%';
        h = h || '80%';
        var content = '<div style="height: 100%; overflow: hidden !important;">' +
            '<img src="' + src + ' " style="width: 100%; height: 100%;" />' +
            '</div>';
        layer.open({
            type: 1,
            title: false,
            shadeClose: true,
            closeBtn: 0,
            area: [w, h], //宽高
            content: content
        });
    }

    // 预览一组图片
    // srcList=图片路径数组(可以是json样，也可以是逗号切割式), index=打开立即显示哪张(可填下标, 也可填写src路径)
    me.showImageList = function (srcList, index) {
        // 如果填的是个string
        srcList = srcList || [];
        if (typeof srcList === 'string') {
            try {
                srcList = JSON.parse(srcList);
            } catch (e) {
                try {
                    srcList = srcList.split(',');	// 尝试字符串切割
                } catch (e) {
                    srcList = [];
                }
            }
        }
        // 如果填的是路径
        index = index || 0;
        if (typeof index === 'string') {
            index = srcList.indexOf(index);
            index = (index == -1 ? 0 : index);
        }

        // 开始展示
        var arr_list = [];
        srcList.forEach(function (item) {
            arr_list.push({
                alt: 'Left and right key switch',
                pid: 1,
                src: item,
                thumb: item
            })
        })
        layer.photos({
            photos: {
                title: '',
                id: new Date().getTime(),
                start: index,
                data: arr_list
            }
            , anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });
    }

    // 显示一个iframe
    // 参数: 标题，地址，宽，高 , 点击遮罩是否关闭, 默认false
    me.showIframe = function (title, url, w, h, shadeClose) {
        // 参数修正
        w = w || '95%';
        h = h || '95%';
        shadeClose = (shadeClose === undefined ? false : shadeClose);
        // 弹出面板
        var index = layer.open({
            type: 2,
            title: title,	// 标题
            shadeClose: shadeClose,	// 是否点击遮罩关闭
            maxmin: true, // 显示最大化按钮
            shade: 0.8,		// 遮罩透明度
            scrollbar: false,	// 屏蔽掉外层的滚动条
            moveOut: true,		// 是否可拖动到外面
            area: [w, h],	// 大小
            content: url,	// 传值
            // 解决拉伸或者最大化的时候，iframe高度不能自适应的问题
            resizing: function (layero) {
                solveLayerBug(index);
            }
        });
    }

    // 显示一个iframe, 底部按钮方式
    // 参数: 标题，地址，点击确定按钮执行的代码(在子窗口执行)，宽，高
    me.showIframe2 = function (title, url, evalStr, w, h) {
        // 参数修正
        w = w || '95%';
        h = h || '95%';
        // 弹出面板
        var index = layer.open({
            type: 2,
            title: title,	// 标题
            closeBtn: (title ? 1 : 0),	// 是否显示关闭按钮
            btn: ['确定', '取消'],
            shadeClose: false,	// 是否点击遮罩关闭
            maxmin: true, // 显示最大化按钮
            shade: 0.8,		// 遮罩透明度
            scrollbar: false,	// 屏蔽掉外层的滚动条
            moveOut: true,		// 是否可拖动到外面
            area: [w, h],	// 大小
            content: url,	// 传值
            // 解决拉伸或者最大化的时候，iframe高度不能自适应的问题
            resizing: function (layero) { },
            yes: function (index, layero) {
                var iframe = document.getElementById('layui-layer-iframe' + index);
                var iframeWindow = iframe.contentWindow;
                iframeWindow.eval(evalStr);
            }
        });
    }

    // 当前iframe关闭自身  (在iframe中调用)
    me.closeCurrIframe = function () {
        try {
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        } catch (e) {
            // handle the exception
        }
    }


})();

// ===========================  常用util函数封装   =======================================
(function () {

    // 超级对象
    var me = sa;

    // ===========================  常用util函数封装   =======================================
    if (true) {
        /**
        * @description 表格合并
        * @param {*} tableList   table列表数据
        * @param {*} tableOption element span-method回调中的数据
        * @param {*} key         将要合并数据中的 key
        */
        me.tableMerge = (tableList, tableOption, key) => {
            if (!key || !tableOption) return;
            let { row, rowIndex } = tableOption;
            // 默认不合并数据
            let obj = { rowspan: 1, colspan: 1, }
            // 检测是否有满足的合并项
            if (rowIndex === 0 || tableList[rowIndex - 1][key] !== row[key]) {
                let cont = 1;
                for (let i = rowIndex + 1; i < tableList.length; i++) {
                    const ele = tableList[i];
                    if (row[key] === ele[key]) cont++;
                    else break;
                }
                // 有满足的合并项
                if (cont !== 1) obj = { rowspan: cont, colspan: 1, }
                // 无满足的合并项
                // else ''
            }
            // 满足合并项后 后续处理操作
            else obj = { rowspan: 0, colspan: 0, }
            return obj;
        }
        // 从url中查询到指定参数值
        me.p = function (name, defaultValue) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == name) { return pair[1]; }
            }
            return (defaultValue == undefined ? null : defaultValue);
        }
        me.q = function (name, defaultValue) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == name) { return pair[1]; }
            }
            return (defaultValue == undefined ? null : defaultValue);
        }

        // 判断一个变量是否为null
        // 返回true或false，如果return_obj有值，则在true的情况下返回return_obj
        me.isNull = function (obj, return_obj) {
            var flag = [null, undefined, '', 'null', 'undefined'].indexOf(obj) !== -1;
            if (return_obj === undefined) {
                return flag;
            } else {
                if (flag) {
                    return return_obj;
                } else {
                    return obj;
                }
            }
        }

        // 判断一个数组里所有值是否含有null 
        me.hasNull = function (arr, return_obj) {
            for (let item of arr) {
                console.log(item)
                if (me.isNull(item)) {
                    return true;
                }
            }
            return false;
        }

        // 将时间戳转化为指定时间
        // way：方式（1=年月日，2=年月日时分秒）默认1,  也可以指定格式：yyyy-MM-dd HH:mm:ss
        me.forDate = function (inputTime, way) {
            if (me.isNull(inputTime) == true) {
                return "";
            }
            var date = new Date(inputTime);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            var ms = date.getMilliseconds();

            way = way || 1;
            // way == 1  年月日
            if (way === 1) {
                return y + '-' + m + '-' + d;
            }
            // way == 1  年月日时分秒
            if (way === 2) {
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
            }
            // way == 具体格式   标准格式: yyyy-MM-dd HH:mm:ss
            if (typeof way == 'string') {
                return way.replace("yyyy", y).replace("MM", m).replace("dd", d).replace("HH", h).replace("mm", minute).replace("ss", second).replace("ms", ms);
            }
            return y + '-' + m + '-' + d;
        };
        // 时间日期
        me.forDatetime = function (inputTime) {
            return me.forDate(inputTime, 2);
        }

        // 将时间转化为 个性化 如：3小时前,
        // d1 之于 d2 ，d2不填则默认取当前时间
        me.forDate2 = function (d, d2) {

            var hou = "forward";

            if (d == null || d == '') {
                return '';
            }
            if (d2 == null || d2 == '') {
                d2 = new Date();
            }
            d2 = new Date(d2).getTime();

            var timestamp = new Date(d).getTime() - 1000;
            var mistiming = Math.round((d2 - timestamp) / 1000);
            if (mistiming < 0) {
                mistiming = 0 - mistiming;
                hou = 'back'
            }
            var arrr = ['year', 'moon', 'week', 'sky', 'Hour', 'minute', 'second'];
            var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
            for (var i = 0; i < arrn.length; i++) {
                var inm = Math.floor(mistiming / arrn[i]);
                if (inm != 0) {
                    return inm + arrr[i] + hou;
                }
            }
        }

        // 综合以上两种方式，进行格式化
        // 小于24小时的走forDate2，否则forDat
        me.forDate3 = function (d, way) {
            if (d == null || d == '') {
                return '';
            }
            var cha = new Date().getTime() - new Date(d).getTime();
            cha = (cha > 0 ? cha : 0 - cha);
            if (cha < (86400 * 1000)) {
                return me.forDate2(d);
            }
            return me.forDate(d, way);
        }

        // 返回时间差, 此格式数组：[x, x, x, 天, 时, 分, 秒]
        me.getSJC = function (small_time, big_time) {
            var date1 = new Date(small_time); //开始时间
            var date2 = new Date(big_time); //结束时间
            var date3 = date2.getTime() - date1.getTime(); //时间差秒
            //计算出相差天数
            var days = Math.floor(date3 / (24 * 3600 * 1000));

            //计算出小时数
            var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));

            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));

            //计算相差秒数
            var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);

            // 返回数组
            return [0, 0, 0, days, hours, minutes, seconds];
        }

        // 将日期，加上指定天数
        me.dateAdd = function (d, n) {
            var s = new Date(d).getTime();
            s += 86400000 * n;
            return new Date(s);
        }

        // 转化json，出错返回默认值
        me.JSONParse = function (obj, default_obj) {
            try {
                return JSON.parse(obj) || default_obj;
            } catch (e) {
                return default_obj || {};
            }
        }

        // 截取指定长度字符，默认50
        me.maxLength = function (str, length) {
            length = length || 50;
            if (!str) {
                return "";
            }
            return (str.length > length) ? str.substr(0, length) + ' ...' : str;
        }

        // 过滤掉标签
        me.text = function (str) {
            if (!str) {
                return "";
            }
            return str.replace(/<[^>]+>/g, "");
        }

        // 检测某个key是否为传入对象中的属性
        me.checkProperty = function (obj, key) {
            return Object.hasOwnProperty.call(obj, key);
        }

        // 为指定集合的每一项元素添加上is_update属性
        me.listAU = function (list) {
            list.forEach(function (ts) {
                ts.is_update = false;
            })
            return list;
        }

        // 获得一段文字中所有图片的路径
        me.getSrcList = function (str) {
            try {
                var imgReg = /<img.*?(?:>|\/>)/gi;	//匹配图片（g表示匹配所有结果i表示区分大小写）
                var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;	//匹配src属性
                var arr = str.match(imgReg);	// 图片数组
                var srcList = [];
                for (var i = 0; i < arr.length; i++) {
                    var src = arr[i].match(srcReg);
                    srcList.push(src[1]);
                }
                return srcList;
            } catch (e) {
                return [];
            }
        }

        // 无精度损失的乘法
        me.accMul = function (arg1, arg2) {
            var m = 0,
                s1 = arg1.toString(),
                s2 = arg2.toString(),
                t;

            t = s1.split(".");
            // 判断有没有小数位，避免出错
            if (t[1]) {
                m += t[1].length
            }

            t = s2.split(".");
            if (t[1]) m += t[1].length;

            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        }

        // 正则验证是否为手机号
        me.isPhone = function (str) {
            str = str + '';
            if ((/^1[34578]\d{9}$/.test(str))) {
                return true;
            }
            return false;
        }

        // 产生随机字符串
        me.randomString = function (len) {
            len = len || 32;
            var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var maxPos = $chars.length;
            var str = '';
            for (let i = 0; i < len; i++) {
                str += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return str;
        }

        // 刷新页面
        me.f5 = function () {
            location.reload();
        }

        // 动态加载js
        me.loadJS = function (src, onload) {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.src = src;
            script.onload = onload;
            document.body.appendChild(script);
        }

        // 产生随机数字
        me.randomNum = function (min, max) {
            return parseInt(Math.random() * (max - min + 1) + min, 10);
        }
        // 获取表格中index序号
        me.getTableIndex = function (curr, size, index) {
            return (curr - 1) * size + index + 1;
        }
        // 打开新页签
        me.open = function (url, name = null) {
            if (!name) name = url;
            window.open(url, name);
        }
        // 打开当前页签
        me.openCurrent = function (url, name = null) {
            if (!name) name = url;
            window.name = name;
            window.location.href = url;
            window.location.reload(true);
        }
        // 打开当前页签
        me.openRouter = function (url, query = null) {
            window.name = url;
            router.push({ path: url, query })
        }
        // 返回一个 json 对象的 url 参数形式
        me.toUrlParams = function (obj) {
            // 如果为空
            if (obj == null) {
                return '';
            }
            // 如果已经是String了
            if (typeof obj === 'string') {
                return obj;
            }
            // 转换
            // var str = Object.keys(obj).map(function (key) {
            //     // return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
            //     return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
            // }).join("&");
            // 表单数据处理 更替
            return qs.stringify(obj, { indices: false });
        }

        // 处理接口请求参数
        me.getParams = function (data, cfg) {
            if (cfg.ContentType === 'application/json') return data;
            else data = me.toUrlParams(data);
            return data;
        }

        /**
         * @description 四舍五入保留n位小数
         * @param data 要四舍五入的数字
         * @param n 要四舍五入保留小数的位数 (只能是0,1,2...的自然数,0代表四舍五入到个位数)
         * @param type 设定返回的数据类型为数值型或者字符型 'number'或者'string'默认'number',只有设定为'string'才会返回13.00这样的数据,否则只返回数值13
         * @return String类型的数字
         */
        me.round = function (data, n, type = "number") {
            n = Number(n);
            if (n < 0 || !Number.isInteger(n)) {
                console.error("小数保留位数未传入，默认使用原数据");
                return Number(data);
            }
            let numbers = "";
            // 保留几位小数后面添加几个0
            for (let i = 0; i < n; i++) {
                numbers += "0";
            }
            let num = Number("1" + numbers);
            let value = Math.round(Number(data) * num) / num;
            let str = value.toString();
            let rs = str.indexOf(".");
            if (n == 0) {
                if (type == "string") {
                    return data < 0 && Number(str) == 0 ? "-" + str : str;
                } else {
                    return Number(str);
                }
            }
            //保留几位小数如果位数不够的需要补0
            if (rs < 0) {
                rs = str.length;
                str += ".";
            }
            while (str.length <= rs + n) {
                str += "0";
            }
            if (type == "string") {
                return data < 0 && Number(str) == 0 ? "-" + str : str; //四舍五入后值为0的根据四舍五入前是负数的需要返回“-0”
            } else {
                return Number(str);
            }
        }

        //整数部分每三位数字加一个逗号 千分位
        me.thousands = function (num) {
            var str = num.toString();
            // 去掉原逗号
            str = str.replace(/\,/g, "")
            var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
            return str.replace(reg, "$1,");
        }

        /**
        * 转为千分位展示形式,并且四舍五入到小数点后roundNum位
        * @param {*} num 原数值(200000.00或者 20,000.00都支持)
        * @param {*} roundNum 保留小数位数
        * @returns 
        */
        me.formatThousands = function (num, roundNum) {
            if (num === undefined || num === null) return '';
            var str = num.toString();
            // 去掉原逗号
            str = str.replace(/\,/g, "")
            if (roundNum === 0 || roundNum) {
                str = Number(str).toFixed(roundNum);
            }
            var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
            return str.replace(reg, "$1,");
        }

        /**
         * 将code转为显示的text
         * @param {*} code 
         * @param {Object} codeMap code转text的map
         * @param {String} not code为空时显示的内容 默认为空
         * @returns 
         */
        me.code2Text = function (code, codeMap, not = "") {
            if (!codeMap) return code
            let result = not
            for (const key in codeMap) {
                if (Object.hasOwnProperty.call(codeMap, key)) {
                    const text = codeMap[key];
                    console.log("🚀 ~ file: sa.js:944 ~ key:", key, code)
                    if (code + "" === key) result = text
                }
            }
            console.log("🚀 ~ file: sa.js:949 ~ result:", result)
            return result;
        }

        // 获取金额
        me.getMoney = (money, unit = '￥') => {
            return (money !== undefined && money !== null) ? unit + me.thousands(me.round(money, 2, 'string')) : '-';
        }

        // 将输入框输入的任意值转换为数字
        me.transMoney = (money) => {
            if (money === null || money === undefined || money === '') return 0;
            let num = me.replaceAll(money + '', ',', '');
            return Number(num);
        }

        // 替换 字符串 （原生replaceAll 有兼容问题）
        me.replaceAll = (str, oldVal, newVal) => {
            let old = new RegExp(oldVal, 'gi');
            return _.replace(str, old, newVal);
        }

        /**
         * 转为百分比
         * @param {*} num 百分比值
         * @param {*} roundNum 保留小数位数
         * @returns 
         */
        me.percentage = function (num, roundNum) {
            let str;
            if (roundNum === 0 || roundNum) {
                str = Number(num * 100).toFixed(roundNum);
            } else {
                str = Number(num * 100).toString();
            }
            str += "%";
            return str;
        }

        /**
         * 转为百分比,最多保留roundNum位小数,小数部分为0则只显示整数
         * @param {*} num 百分比值
         * @param {*} roundNum 保留小数位数
         * @param {*} roundNum 保留小数位数
         * @returns 
         */
        me.percentageAuto = function (num, roundNum, multiple = 100, label = "%") {
            let str;
            if (roundNum === 0 || roundNum) {
                str = Number(num * multiple).toFixed(roundNum);
            } else {
                str = Number(num * multiple).toString();
            }
            // 小数部分截掉0结尾的
            str = str.replace(/0*$/g, "")
            // 小数部分截掉.结尾的
            str = str.replace(/\.*$/g, "")
            str += label;
            return str;
        }

        // 获取比例 val:比例值 multiple:放大倍数 默认1  roundNum:保留小数位数
        me.getPercentage = (val, multiple = 1, roundNum = 1) => {
            // 判空处理
            if (val === null || val === undefined || val === '') return '';
            // 乘积
            let newValue = val * multiple
            // 处理数据
            return me.percentageAuto(newValue, roundNum, 1)
        }

        /**
         * 获取多层级对象 中的属性
         * @param {*} obj 对象 如 {a:{b:''}}
         * @param {*} key 多层结构 需要用.分割 如 a.b 可以为单个
         */
        me.getItemToLevelObj = function (obj, keys) {
            let arr = keys.split('.');
            let res = obj;
            arr.forEach(ele => { if (res) res = res[ele] });
            return res;
        }

        // 查询 树形结构 子节点 tree:树 {key:要寻找的数据key , value:要寻找的值 , children:子节点key} adds:想要追加的数据
        me.getTreeNode = (tree = [], { key = 'key', value = 'value', children = 'children' }, ...adds) => {
            for (let index = 0; index < tree.length; index++) {
                const ele = tree[index];
                if (me.getItemToLevelObj(ele, key) == value) {
                    if (adds.length !== 0) tree.splice(index + 1, 0, ...adds);
                    return ele;
                }

                if (ele[children] && ele[children].length > 0) {
                    let row = me.getTreeNode(ele[children], { key, value, children }, ...adds);
                    if (row) {
                        if (adds.length !== 0) tree.splice(index + 1, 0, ...adds);
                        return row;
                    }
                    continue;
                }
            }
            return null;
        }

        /**
         * 删除 树形结构
         * @param {*} tree 树
         * @param {*} param1 {key:要寻找的数据key , value:要删除的值 , children:子节点key}
         * @param {*} isEmptyParent 当子节点全部删除后 是否删除父节点
         */
        me.deleteTreeNode = (tree = [], { key = 'key', value = 'value', children = 'children' }, isEmptyParent = false) => {
            function traverseAndRemove(nodes) {
                for (let i = 0; i < nodes.length; i++) {
                    const ele = nodes[i];
                    if (me.getItemToLevelObj(ele, key) === value) {
                        nodes.splice(i, 1);
                        return true;
                    }
                    if (ele[children] && ele[children].length > 0) {
                        let flg = traverseAndRemove(ele[children]);
                        if (isEmptyParent && flg) {
                            if (ele[children].length === 0) nodes.splice(i, 1);
                            return true;
                        }
                        if (flg) return flg;
                    }
                }
                return false;
            }

            // 拷贝 数据
            let treeList = me.deepCopy(tree);

            let flg = traverseAndRemove(treeList);
            return flg ? treeList : false;
        }

        // 绑定拖拽事件 ele点击元素 targetEle要移动的元素 leftRight上下移动 topBottom左右移动
        me.dragBox = (ele, targetEle, option = { leftRight: false, topBottom: true }) => {
            let { leftRight = false, topBottom = true } = option || {};

            let startX = ele.clientX - targetEle.offsetLeft;
            let startY = ele.clientY - targetEle.offsetTop;

            document.onmousemove = function (e) {
                let endX = e.clientX - startX;
                let endY = e.clientY - startY;
                let widthBox = parseInt(getComputedStyle(event.target, null).width);
                let widthBody = parseInt(getComputedStyle(document.body, null).width);
                let heightBody = parseInt(getComputedStyle(document.body, null).height);

                if (leftRight && (endX < -(widthBox - 40) || endX > (widthBody - 40))) {
                    return;
                }
                if (topBottom && (endY < 5 || (endY + 5) > heightBody)) {
                    return;
                }
                if (leftRight) targetEle.style.left = endX + 'px';
                if (topBottom) {
                    targetEle.style.top = endY + 'px';
                }
            }
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }

        /**
         * 执行一段字符串代码
         * @param {*} code 源码
         * @param {*} objData 对象形式的参数内容
         */
        me.evalStr = (code, objData) => {
            return new Function(...Object.keys(objData), code)(...Object.values(objData));
        }

        // == if 结束
    }

    // ===========================  数组操作   =======================================
    if (true) {

        // 从数组里获取数据,根据指定数据
        me.getArrayField = function (arr, prop) {
            var propArr = [];
            for (var i = 0; i < arr.length; i++) {
                propArr.push(arr[i][prop]);
            }
            return propArr;
        }

        // 从数组里获取数据,根据指定数据
        me.arrayGet = function (arr, prop, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][prop] == value) {
                    return arr[i];
                }
            }
            return null;
        }

        // 从数组删除指定记录
        me.arrayDelete = function (arr, item) {
            if (item instanceof Array) {
                for (let i = 0; i < item.length; i++) {
                    let ite = item[i];
                    let index = arr.indexOf(ite);
                    if (index > -1) {
                        arr.splice(index, 1);
                    }
                }
            } else {
                var index = arr.indexOf(item);
                if (index > -1) {
                    arr.splice(index, 1);
                }
            }
        }

        // 从数组删除指定id的记录
        me.arrayDeleteById = function (arr, id) {
            var item = me.arrayGet(arr, 'id', id);
            me.arrayDelete(arr, item);
        }

        // 将数组B添加到数组A的开头
        me.unshiftArray = function (arrA, arrB) {
            if (arrB) {
                arrB.reverse().forEach(function (ts) {
                    arrA.unshift(ts);
                })
            }
            return arrA;
        }

        // 将数组B添加到数组A的末尾
        me.pushArray = function (arrA, arrB) {
            if (arrB) {
                arrB.forEach(function (ts) {
                    arrA.push(ts);
                })
            }
            return arrA;
        }

        // 清空数组array
        me.clearArray = function (array) {
            array.splice(0, array.length)
        };

        // 数组 去重
        me.uniqueByJSON = function (arr) {
            return _.uniqWith(arr, _.isEqual);

            // const unique = {};
            // return arr.filter((item) => {
            //     const key = JSON.stringify(item);
            //     if (!unique[key]) {
            //         unique[key] = true;
            //         return true;
            //     }
            //     return false;
            // });
        }
        // 执行深比较来确定两者的值是否相等
        me.isEqual = function (val1, val2) {
            return _.isEqual(val1, val2);

            // const unique = {};
            // return arr.filter((item) => {
            //     const key = JSON.stringify(item);
            //     if (!unique[key]) {
            //         unique[key] = true;
            //         return true;
            //     }
            //     return false;
            // });
        }

        // == if 结束
    }

    // ===========================  浏览器相关   =======================================
    if (true) {

        // set cookie 值
        me.setCookie = function setCookie(cname, cvalue, exdays) {
            exdays = exdays || 30;
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + escape(cvalue) + "; " + expires + "; path=/";
        }

        // get cookie 值
        me.getCookie = function (objName) {
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
                var temp = arrStr[i].split("=");
                if (temp[0] == objName) {
                    return unescape(temp[1])
                };
            }
            return "";
        }

        // 复制指定文本
        me.copyText = function (str) {
            var oInput = document.createElement('input');
            oInput.value = str;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display = 'none';
        }


        // 将cookie序列化为k=v形式
        me.strCookie = function () {
            return document.cookie.replace(/; /g, "&");
        }

        // 回到顶部
        me.goTop = function () {
            function smoothscroll() {
                var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
                if (currentScroll > 0) {
                    window.requestAnimationFrame(smoothscroll);
                    window.scrollTo(0, currentScroll - (currentScroll / 5));
                }
            };
            smoothscroll();
        }

        //浏览器版本判断
        function getVersion(userAgent, browser) {
            //IE版本
            if (browser == 'IE') {
                return userAgent.match(/MSIE ([\d.]+)/) != null ? userAgent.match(/MSIE ([\d.]+)/)[1] : userAgent.match(/rv:([\d.]+)/)[1];
            }
            //Safari版本
            else if (browser == 'Safari') {
                return userAgent.match(/Version\/([\d.]+)/)[1];
            } else {
                return userAgent.match(new RegExp(browser + '/([\\d.]+)'))[1];
            }
        }
        me.getBrowser = function () {
            //取得浏览器的userAgent字符串
            var userAgent = navigator.userAgent, type = '', version = '';
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                type = 'IE';
                version = getVersion(userAgent, 'IE');
            } else if (userAgent.indexOf("Opera") > -1) {
                type = 'Opera';
                version = getVersion(userAgent, 'Opera');
            } else if (userAgent.indexOf("Edge") > -1) {
                type = 'Edge';
                version = getVersion(userAgent, 'Edge');
            } else if (userAgent.indexOf("Chrome") > -1) {
                type = 'Chrome';
                version = getVersion(userAgent, 'Chrome');
            } else if (userAgent.indexOf("Safari") > -1) {
                type = 'Safari';
                version = getVersion(userAgent, 'Safari');
            } else if (userAgent.indexOf("Firefox") > -1) {
                type = 'Firefox';
                version = getVersion(userAgent, 'Firefox');
            }
            return { type, version };
        }
        // == if 结束
    }

    // =========================== javascript对象操作   =======================================
    if (true) {
        // 判断是否为图片文件
        me.isImageFill = function (fileName) {
            return /\.((gif)|(png)|(jpg)|(jpeg)|(webp)|(svg)|(psd)|(bmp)|(tif))$/i.test(fileName)
        };
        // 去除json对象中的空值
        me.removeNull = function (obj) {
            var newObj = {};
            if (obj != undefined && obj != null) {
                for (var key in obj) {
                    if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
                        //
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
            return newObj;
        }
        // JSON 浅拷贝, 返回拷贝后的obj
        me.copyJSON = function (obj) {
            if (obj === null || obj === undefined) {
                return obj;
            };
            var new_obj = {};
            for (var key in obj) {
                new_obj[key] = obj[key];
            }
            return new_obj;
        }
        // 数组浅拷贝, 返回拷贝后的 arr
        me.copyArray = function (arr) {
            if (arr === null || arr === undefined) {
                return arr;
            };
            var new_arr = [];
            arr.forEach(function (item) {
                new_arr.push(item);
            })
            return new_arr;
        }
        me.deepCopy = function (arr) {
            return deepcopy(arr);
        }
        me.dayjs = dayjs;

        // json合并, 将 defaulet配置项 转移到 user配置项里 并返回 user配置项
        me.extendJson = function (userOption, defaultOption) {
            if (!userOption) {
                return defaultOption;
            };
            for (var key in defaultOption) {
                if (userOption[key] === undefined) {
                    userOption[key] = defaultOption[key];
                } else if (userOption[key] == null) {

                } else if (typeof userOption[key] == "object") {
                    me.extendJson(userOption[key], defaultOption[key]); //深度匹配
                }
            }
            return userOption;
        }

        // 判断当前盒子 是否有溢出内容 true为溢出
        me.isScrollBox = function (className) {
            let dom = document.querySelector(className);
            if (!dom) return { flg: false, dom };
            if (dom.clientWidth === dom.scrollWidth) return { flg: false, dom };
            else return { flg: true, dom };
        }
        // == if 结束
    }

    // ===========================  本地集合存储   =======================================
    if (true) {
        // 获取指定key的list
        me.keyListGet = function (key) {
            try {
                var str = localStorage.getItem('LIST_' + key);
                if (str == undefined || str == null || str == '' || str == 'undefined' || typeof (JSON.parse(str)) == 'string') {
                    //alert('key' + str);
                    str = '[]';
                }
                return JSON.parse(str);
            } catch (e) {
                return [];
            }
        }
        me.keyListSet = function (key, list) {
            localStorage.setItem('LIST_' + key, JSON.stringify(list));
        }
        me.keyListHas = function (key, item) {
            var arr2 = me.keyListGet(key);
            return arr2.indexOf(item) != -1;
        }
        me.keyListAdd = function (key, item) {
            var arr = me.keyListGet(key);
            arr.push(item);
            me.keyListSet(key, arr);
        }
        me.keyListRemove = function (key, item) {
            var arr = me.keyListGet(key);
            var index = arr.indexOf(item);
            if (index > -1) {
                arr.splice(index, 1);
            }
            me.keyListSet(key, arr);
        }
        // == if 结束
    }


    // ===========================  对sa-admin的优化   =======================================
    if (true) {

        // 在表格查询的页面，监听input回车事件，提交查询
        me.onInputEnter = function (app) {
            Vue.nextTick(function () {
                app = app || window.app;
                // document.querySelectorAll('.el-form input').forEach(function(item) {
                // 	item.onkeydown = function(e) {
                // 		var theEvent = e || window.event;
                // 		var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                // 		if (code == 13) {
                // 			app.p.pageNo = 1;
                // 			app.f5();
                // 		}
                // 	}
                // })
                document.querySelectorAll('.el-form').forEach(function (item) {
                    item.onkeydown = function (e) {
                        var theEvent = e || window.event;
                        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                        if (code == 13) {
                            var target = e.target || e.srcElement;
                            if (target.tagName.toLowerCase() == "input") {
                                sa.currView().p.pageNo = 1;
                                sa.currView().f5();
                            }
                        }
                    }
                })
            })
        }

        // 如果value为true，则抛出异常
        me.check = function (value, errorMsg) {
            if (value === true) {
                throw { type: 'sa-error', msg: errorMsg };
            }
        }

        // 如果value为null，则抛出异常
        me.checkNull = function (value, errorMsg) {
            if (me.isNull(value)) {
                throw { type: 'sa-error', msg: errorMsg };
            }
        }

        // 监听窗口变动
        if (!window.onresize) {
            window.onresize = function () {
                try {
                    me.f5TableHeight();
                } catch (e) {
                    // console.log(e);
                }
            }
        }

        // == if 结束
    }
})();


// ===========================  $sys 有关当前系统的方法  一般不能复制到别的项目中用  =======================================
(function () {

    // 超级对象
    var me = {};
    sa.$sys = me;

    // ======================= 系统相关 ============================
    // 写入当前系统信息
    me.setSysData = function (sysData) {
        sessionStorage.setItem('sysData', JSON.stringify(sysData));
    }
    // 获取当前系统信息
    me.getSysData = function () {
        let sysData = sessionStorage.getItem('sysData');
        if (sysData) return JSON.parse(sysData);
        return {}
    }

    // ======================= 登录相关 ============================
    // 获得当前已登陆用户信息
    me.getCurrUser = function () {
        var user = localStorage.getItem("currUser");
        if (user == undefined || user == null || user == 'null' || user == '' || user == '{}' || user.length < 10) {
            user = {
                id: '000',
                username: '未登录'
            }
        } else {
            user = JSON.parse(user);
        }
        return user;
    }

    // 是否为超级权限用户
    me.isSupperUser = function () {
        // if (me.getCurrUser().name === 'admin') return true;
        // else return false;

        return false
    }

    // ========================= 权限验证 =========================

    // 定义key
    var pcode_key = 'permission_code';

    // 写入当前会话的权限码集合
    sa.setAuth = function (codeList) {
        sa.keyListSet(pcode_key, codeList);
    }

    // 获取当前会话的权限码集合
    sa.getAuth = function () {
        return sa.keyListGet(pcode_key);
    }

    // 清除当前会话的权限码集合
    sa.clearAuth = function () {
        sa.keyListSet(pcode_key, []);
    }

    // 检查当前会话是否拥有一个权限码, 返回true和false
    sa.isAuth = function (pcode) {
        return sa.keyListHas(pcode_key, pcode);
    }

    // 检查当前会话是否拥有一个权限码, 如果没有, 则跳转到无权限页面
    // 注意: 非二级目录页面请注意调整路径问题
    sa.checkAuth = function (pcode, not_pcode_url) {
        var is_have = sa.keyListHas(pcode_key, pcode);
        if (is_have == false) {
            location.href = not_pcode_url || '../../sa-view/error-page/403.html';
            throw 'No permission for now:' + pcode;
        }
    }
    // 同上, 只不过是以弹窗的形式显示出来无权限来
    sa.checkAuthTs = function (pcode, not_pcode_url) {
        var is_have = sa.keyListHas(pcode_key, pcode);
        if (is_have == false) {
            var url = not_pcode_url || '../../sa-view/error-page/403.html';
            layer.open({
                type: 2,
                title: false,	// 标题
                shadeClose: true,	// 是否点击遮罩关闭
                shade: 0.8,		// 遮罩透明度
                scrollbar: false,	// 屏蔽掉外层的滚动条
                closeBtn: false,
                area: ['700px', '600px'],	// 大小
                content: url	// 传值
            });
            throw 'No permission for now:' + pcode;
        }
    }
    // ======================= 配置相关 ============================
    // 写入配置信息
    me.setAppCfg = function (cfg) {
        if (typeof cfg != 'string') {
            cfg = JSON.stringify(cfg);
        }
        localStorage.setItem('app_cfg', cfg);
    }

    // 获取配置信息
    me.getAppCfg = function () {
        var app_cfg = sa.JSONParse(localStorage.getItem('app_cfg'), {}) || {};
        return app_cfg;
    }
})();


// ===========================  tab 标签通讯(本地通讯机制) =======================================
(function () {
    // 初始化 tab 标签通讯机制
    let broadcastChannel = new BroadcastChannel('broadcast');
    let broadcastArr = [];
    broadcastChannel.onmessage = (res) => {
        // 系统信息处理过滤
        let flg = systemMessageHandle(res);
        // 其他消息处理
        if (!flg) broadcastArr.forEach(ele => ele(res));
    }

    // 重新定义 数据绑定
    if (!sa.BCC) sa.BCC = {
        onMessage: (callBack) => {
            broadcastArr.push(callBack);
        },
        sendMessage: (data) => {
            broadcastChannel.postMessage(data);
        }
    }

    // 系统通信处理
    let systemMessageHandle = function ({ data }) {
        if (data.type === 'system') {
            // 关闭浏览器
            if (data.data.operate === 'closeBrowser') {
                window.close();
                return true;
            }
        }
        return false;
    }
})();

// 对外开放, 在模块化时解开此注释
export default sa;