import http from "@/api/http";
import type { AxiosResponse } from "axios";
interface ResponseType {
  message: string;
  code: number;
  data?: any;
}

/**标准化请求函数 */
export default function useReuest(
  methods: string,
  path: string,
  data?: any,
): Promise<ResponseType> {
  return new Promise((resolve, reject) => {
    const handleResponse = (res: AxiosResponse) => {
      resolve({ data: res.data, message: res.statusText, code: res.status });
    };
    switch (methods.toLowerCase()) {
      case "get":
        http
          .get(path, { params: data })
          .then((res) => handleResponse(res))
          .catch((err) => reject(err));
        break;
      case "post":
        http
          .post(path, data)
          .then((res) => {
            handleResponse(res);
          })
          .catch((err) => {
            reject(err);
          });
        break;
      case "delete":
        http
          .delete(path, data)
          .then((res) => handleResponse(res))
          .catch((err) => reject(err));
        break;
      case "put":
        http
          .put(path, data)
          .then((res) => handleResponse(res))
          .catch((err) => reject(err));
        break;
    }
  });
}
