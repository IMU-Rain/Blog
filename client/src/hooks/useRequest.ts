import axios from "axios";
import { ref } from "vue";
interface errorResponse {
  code: number;
  message: string;
  detail: string;
}
export function useRequest<T, P = any>(
  requestFn: (params?: P) => Promise<T>,
  options?: {
    immediate?: boolean;
    defaultParams?: P;
  }
) {
  const data = ref<T|null>(null);
  const loading = ref(false);
  const error = ref<errorResponse |boolean>(false);
  const run = async (params?: P) => {
    if (loading.value) return;
    loading.value = true;
    error.value = false;
    try {
      const res = await requestFn(params || options?.defaultParams);
      data.value = res;
      return res;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const backendData = err.response?.data as any;
        error.value = {
          code: backendData.code || 500,
          message: backendData.message || "",
          detail: backendData.detail || "",
        };
      } else {
        error.value = {
          code: 500,
          message: "未知错误",
          detail: "我不到啊，请检查一切",
        };
      }
    } finally {
      loading.value = false;
    }
  };
  if (options?.immediate) {
    run(options.defaultParams);
  }
  return {
    loading,
    data,
    error,
    run,
  };
}
