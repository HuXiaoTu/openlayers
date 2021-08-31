import { createApp } from 'vue';
import App from './App.vue'

// mockJS 数据拦截
import './axios/mockJS/mock.js';

import router from './route/route'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';


const app = createApp(App)
// 注册路由
app.use(router);
// 注册ElementUI
app.use(ElementPlus, { size: 'small', zIndex: 3000 });

// 挂载
app.mount('#app')