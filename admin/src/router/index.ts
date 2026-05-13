import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { getLoginUser } from "@/api/account";
import { showErrorMessage } from "@/utils/message";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "Dashboard",
    component: () => import("@/views/Layout/index.vue"),
    children: [
      {
        path: "Dashboard",
        name: "Dashboard",
        component: () => import("@/views/Dashboard/index.vue"),
      },
      {
        path: "Articles",
        name: "Articles",
        component: () => import("@/views/Articles/index.vue"),
      },
      {
        path: "Albums",
        name: "Albums",
        component: () => import("@/views/Albums/index.vue"),
      },
      {
        path: "About",
        name: "About",
        component: () => import("@/views/About/index.vue"),
      },
      {
        path: "Comments",
        name: "Comments",
        component: () => import("@/views/Comments/index.vue"),
      },
      {
        path: "Accounts",
        name: "Accounts",
        component: () => import("@/views/Accounts/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login/index.vue"),
  },
  {
    path: "/Articles/Edit",
    name: "ArticleEditor",
    component: () => import("@/views/Articles/components/Edit.vue"),
  },
  {
    path: "/Albums/EditMeta",
    name: "AlbumMetaEditor",
    component: () => import("@/views/Albums/components/EditMeta.vue"),
  },
];
const router = createRouter({
  routes,
  history: createWebHistory("/admin/"),
});
let authCheckPromise: Promise<unknown> | null = null;
const ensureAuthed = () => {
  if (!authCheckPromise) {
    authCheckPromise = getLoginUser().finally(() => {
      authCheckPromise = null;
    });
  }
  return authCheckPromise;
};
const ensureAdmin = async () => {
  const res = (await ensureAuthed()) as { data?: { role?: string } };
  if (res?.data?.role !== "admin") {
    throw new Error("admin only");
  }
  return res;
};
// 每次路由切换都向服务端核验 cookie，避免前端缓存登录态
router.beforeEach(async (to) => {
  if (to.path === "/login") {
    return true;
  }
  try {
    await ensureAdmin();
    return true;
  } catch (_err) {
    showErrorMessage("只有管理员可以进入后台", "mdi:shield-alert-outline");
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }
});
export default router;
