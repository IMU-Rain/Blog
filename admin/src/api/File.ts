import useReuest from "../utils/useRequest";
export function uploadFile(file: FormData) {
  return useReuest("post", "/file", file);
}
