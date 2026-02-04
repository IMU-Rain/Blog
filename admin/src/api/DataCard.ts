import useReuest from "@/utils/useRequest";

export function getArticleNumber() {
  return useReuest("get", "/articles");
}
