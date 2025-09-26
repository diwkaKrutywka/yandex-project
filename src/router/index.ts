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
    path: "/auth-page",
    name: "AuthPage",
    component: () => import("../views/AuthPage.vue"),
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
    {
      path: "/doctors",
      name: "DoctorsPage",
      component: () => import("../views/DoctorsPage.vue"),
    },
    {
      path: "/info-service",
      name: "InfoService",
      component: () => import("../views/InfoService.vue"),
    },
    {
      path: "/info-details",
      name: "InfoDetails",
      component: () => import("../views/InfoDetails.vue"),
    },
    {
      path: "/search",
      name: "SearchPage",
      component: () => import("../views/SearchPage.vue"),
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
