import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// Основные маршруты
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "MainView",
    component: () => import("../views/MainView.vue"),
    children: [],
  },
  {
    path: "/language-selection",
    name: "LanguageSelection",
    component: () => import("../views/LanguageSelectionView.vue"),
  },
  {
    path: "/home",
    name: "HomeView",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/chat",
    name: "ChatView",
    component: () => import("../views/ChatView.vue"),
  },
  {
    path: "/service",
    name: "ServiceView",
    component: () => import("../views/ServiceView.vue"),
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
