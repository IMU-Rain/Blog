import { useUserStore } from "./../store/user";
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/Home.vue"),
  },
  {
    path: "/article/:id",
    name: "Article",
    component: () => import("../pages/ArticleDetial.vue"),
    props: true,
  },
  {
    path: "/economy",
    name: "Economy",
    component: () => import("../pages/Economy.vue"),
  },
  {
    path: "/albums",
    name: "Albums",
    component: () => import("../pages/Albums.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../pages/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../pages/admin/Admin.vue"),
    meta: { requireAdmin: true },
    children: [
      {
        path: "articles",
        name: "AdminArticles",
        component: () => import("../pages/admin/Article.vue"),
      },
      {
        path: "albums",
        name: "AdminAlbums",
        component: () => import("../pages/admin/Albums.vue"),
      },
      {
        path: "about",
        name: "AdminAbout",
        component: () => import("../pages/admin/About.vue"),
      },
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () => import("../pages/admin/Dashboard.vue"),
      },
      {
        path: "duxiuindex",
        name: "AdminDuxiuindex",
        component: () => import("../pages/admin/DuxiuIndex.vue"),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, _from, next) => {
  if (to.name === "Home") {
    document.title = "Max Byte";
  } else {
    document.title = String(to.name);
  }
  next();
});
// 跳转管理页面路由守卫
router.beforeEach((to, _from, next) => {
  if (to.meta.requireAdmin) {
    const userStore = useUserStore();
    if (userStore.isLogged === false) {
      return next("/login");
    }
    if (userStore.user?.role !== "admin") return next("/");
  }
  next();
});
export default router;
