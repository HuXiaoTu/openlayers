import { createRouter, createWebHistory } from "vue-router";
import layout from '../views/index.vue';
// 路由信息
const routes = [
    {
        path: "/",
        name: "layout",
        component: layout,
        children: [
            // 静态展示 
            {
                path: "/staticDisplay",
                name: "staticDisplay",
                component: () => import('../views/staticDisplay/staticDisplay.vue'),
            },
            // 静态绘制
            {
                path: "/staticDraw",
                name: "staticDraw",
                component: () => import('../views/staticDraw/staticDraw.vue'),
            },
        ]
    },
];

// 导出路由
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;