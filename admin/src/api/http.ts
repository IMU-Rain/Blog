import axios, { AxiosError, type AxiosResponse } from "axios";
import router from "../router";
import type { ResponseType } from "@/types/ResponseTypes";
const http = axios.create({
  // baseURL: "https://www.maxbyte.fun/api/",
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// 响应拦截器，提前预处理后端响应
http.interceptors.response.use(
  (response: AxiosResponse<ResponseType<any>>) => {
    const { status, statusText } = response;

    switch (status) {
      case 200:
        return response;

      // 处理 401 未授权
      case 401:
        router.push("/login");
        return Promise.reject(new Error("未授权，请重新登录"));

      // 处理 403 禁止访问（可选扩展）
      case 403:
        return Promise.reject(new Error("权限不足，无法访问"));

      // 处理 404 资源不存在（可选扩展）
      case 404:
        return Promise.reject(new Error("请求资源不存在"));

      // 其他状态码（默认情况）
      default:
        return Promise.reject(
          new Error(statusText || `请求失败：状态码 ${status}`),
        );
    }
  },
  // 错误回调：处理网络错误/无响应的情况
  (error: AxiosError) => {
    // 若有响应，继续用 switch 处理状态码
    if (error.response) {
      const { status, statusText } = error.response;
      switch (status) {
        case 401:
          router.push("/login");
          break;
        case 500:
          console.error("服务器内部错误");
          break;
        default:
          console.error(`请求错误：${statusText || `状态码 ${status}`}`);
      }
    } else {
      // 无响应（如网络超时、断网）
      console.error("请求失败：", error.message || "网络异常");
    }
    return Promise.reject(error);
  },
);
export default http;
