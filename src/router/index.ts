import {createRouter, createWebHistory} from "vue-router";
import AuthPage from "../pages/AuthPage.vue";
import HomePage from "../pages/HomePage.vue";
import AdminPage from "../pages/AdminPage.vue";
import ShoppingListPage from "../pages/ShoppingListPage.vue";

import AdminUsers from "../components/AdminUsers.vue";
import AdminGateway from "../components/AdminGateway.vue";

const routes = [
    {path: "/", redirect: "/auth/login"},
    {
        path: "/auth/:authType",
        component: AuthPage,
        meta: {title: "Авторизация"},
    },
    {
        path: "/home",
        component: HomePage,
        meta: {title: "Главная страница"},
    },
    {
        path: "/list",
        component: ShoppingListPage,
        meta: {title: "Лист покупок"},
    },
    {
        path: "/admin",
        component: AdminPage,
        meta: {title: "Админ панель"},
        children: [
            {
                path: "users",
                component: AdminUsers,
                meta: {title: "Управление пользователями"},
            },
            {
                path: "gateway",
                component: AdminGateway,
                meta: {title: "Управление категориями"}
            }
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _from, next) => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/auth/login");
    } else if (to.meta.requiresGuest && isAuthenticated) {
        next("/home");
    } else {
        next();
    }
});

router.afterEach((to) => {
    const authType = to.params.authType;
    if (to.path.startsWith("/auth/")) {
        document.title = authType === "login" ? "Авторизация" : "Регистрация";
    } else {
        document.title = to.meta.title as string;
    }
});

export default router;
