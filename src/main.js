import { createApp } from 'vue';
import App from './App.vue'

// mockJS 数据拦截
import './axios/mockJS/mock.js';

const app = createApp(App);

// gbSa工具类 全局注册
import gbSa from '@/commonTool/commonUtil/gb_sa.js';
app.config.globalProperties.gbSa = gbSa;
globalThis.gbSa = gbSa;

// gbMap工具类 全局注册
import gbMap from '@/commonTool/mapDrawHandle/core/gb_map.js';
app.config.globalProperties.gbMap = gbMap;
globalThis.gbMap = gbMap;

// 注册路由
import router from './route/route.js';
app.use(router);

// 安装 pinia
import store from './store/index.js';
app.use(store);

// 全局组件 注册
import { initCom } from "./commonTool/init/init-global-comp";
initCom(app);

// 注册ElementUI
import ElementPlus from 'element-plus';
app.use(ElementPlus, { size: 'small', zIndex: 3000 });

// 注册element 图标
import * as icons from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
Object.keys(icons).forEach(key => app.component(key, icons[key]));

// 样式文件 导入
import 'ol/ol.css';
import './assets/commonCss/index.scss';

// 挂载
app.mount('#app')