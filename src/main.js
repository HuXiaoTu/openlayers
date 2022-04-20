import { createApp } from 'vue';
import App from './App.vue'

// mockJS 数据拦截
import './axios/mockJS/mock.js';

import router from './route/route'
import ElementPlus from 'element-plus';
import * as icons from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';


const app = createApp(App)
// 注册路由
app.use(router);
// 注册ElementUI
app.use(ElementPlus, { size: 'small', zIndex: 3000 });
// 注册element 图标
Object.keys(icons).forEach(key => app.component(key, icons[key]));

// 挂载
app.mount('#app')