import axios from 'axios';
// 配置 axios 全局参数


// 超时时间
axios.instance.defaults.timeout = 2500;

// baseUrl
axios.defaults.baseURL = '';

// post 默认 Content-Type
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.info('>>>> ws >>>⚡⚡ configconfigconfigconfig', config)

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
