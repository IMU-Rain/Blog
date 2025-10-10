import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Home from "../pages/Home.vue";
import Albums from "../pages/Albums.vue";
import About from "../pages/About.vue";
import ArticleDetial from "../pages/ArticleDetial.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/article/:id",
    name: "article",
    component: ArticleDetial,
    props: true,
  },
  { path: "/albums", name: "Albums", component: Albums },
  { path: "/about", name: "About", component: About },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
