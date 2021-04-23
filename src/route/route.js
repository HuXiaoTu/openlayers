import { createRouter, createWebHistory } from "vue-router";

// 路由信息
const routes = [
    {
        path: "/staticDisplay",
        name: "staticDisplay",
        component: () => import('../views/staticDisplay/staticDisplay.vue'),
    },
];

// 导出路由
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;