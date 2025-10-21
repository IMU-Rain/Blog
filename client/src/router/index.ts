import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: ()=>import("../pages/Home.vue"),
  },
  {
    path: "/article/:id",
    name: "article",
    component: ()=>import("../pages/ArticleDetial.vue"),
    props: true,
  },
  { path: "/albums", name: "Albums", component: ()=>import("../pages/Albums.vue") },
  { path: "/about", name: "About", component: ()=>import("../pages/About.vue") },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
