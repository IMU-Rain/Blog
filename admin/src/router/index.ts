import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/Dashboard",
    component: () => import("@/views/Layout/index.vue"),
    children: [
      {
        path: "/Dashboard",
        name: "Dashboard",
        component: () => import("@/views/Dashboard/index.vue"),
      },
      {
        path: "/Articles",
        name: "Articles",
        component: () => import("@/views/Articles/index.vue"),
      },
      {
        path: "/Albums",
        name: "Albums",
        component: () => import("@/views/Albums/index.vue"),
      },
      {
        path: "/About",
        name: "About",
        component: () => import("@/views/About/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login/index.vue"),
  },
];
const router = createRouter({
  routes,
  history: createWebHistory(),
});
// 验证token是否过期拦截器
router.beforeEach(async (to, _before, next) => {
  const token = await cookieStore.get("token");
  if (to.path !== "/login") {
    if (!token) {
      return router.push("/login");
    }
    if (Date.now() < token.expires) {
      return next();
    } else {
      return router.push("/login");
    }
  }
  next();
});
export default router;
