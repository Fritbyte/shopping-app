import {createRouter, createWebHistory} from "vue-router";
import AuthPage from "../pages/AuthPage.vue";

const routes = [
    {path: "/", redirect: "/auth/login"},
    {path: "/auth/:authType", component: AuthPage, meta: {title: "Авторизация | Discord Clone"}}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.afterEach((to) => {
    document.title = to.meta.title as string || "Discord Clone";
});

export default router;
