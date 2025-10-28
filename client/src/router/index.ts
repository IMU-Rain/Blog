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
export default router;
