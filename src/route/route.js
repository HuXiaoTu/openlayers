import { createRouter,createWebHistory} from "vue-router";

// 路由信息
const routes = [
    {
        path: "/",
        name: "index",
        component:  () => import('../views/index.vue'),
    },
    {
        path: "/home",
        name: "home",
        component:  () => import('../views/home.vue'),
    },
];

// 导出路由
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;