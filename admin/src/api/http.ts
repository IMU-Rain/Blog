import axios, { AxiosError, type AxiosResponse } from "axios";
import router from "../router";
import type { ResponseType } from "@/types/ResponseTypes";
import { showErrorMessage } from "@/utils/message";

let authExpiredPromptLocked = false;
const showAuthExpiredOnce = () => {
  if (authExpiredPromptLocked) return;
  authExpiredPromptLocked = true;
  showErrorMessage("登录已过期，请重新登录", "mdi:clock-alert-outline");
  window.setTimeout(() => {
    authExpiredPromptLocked = false;
  }, 1200);
};

const toLogin = () => {
  const current = router.currentRoute.value;
  if (current.path === "/login") return;
  router.replace({
    path: "/login",
    query: { redirect: current.fullPath },
  });
};

const isLoginRequest = (error: AxiosError) => {
  const method = String(error.config?.method || "").toLowerCase();
  const requestUrl = String(error.config?.url || "");
  return method === "post" && /\/login\/?$/.test(requestUrl);
};

const http = axios.create({
  // baseURL: "https://www.maxbyte.fun/api/",
  baseURL: import.meta.env.VITE_BASEURL + "api/",
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// 响应拦截器，提前预处理后端响应
http.interceptors.response.use(
  (response: AxiosResponse<ResponseType>) => {
    return response;
  },
  // 错误回调：处理网络错误/无响应的情况
  (error: AxiosError) => {
    const status = error.response?.status;
    if (!status) {
      showErrorMessage("网络异常，请检查连接后重试", "mdi:wifi-alert");
      return Promise.reject(error);
    }

    if (status === 401 && !isLoginRequest(error)) {
      showAuthExpiredOnce();
      toLogin();
      return Promise.reject(error);
    }

    if (status === 403) {
      showErrorMessage("权限不足，无法执行该操作", "mdi:shield-alert-outline");
    }
    return Promise.reject(error);
  },
);
export default http;
