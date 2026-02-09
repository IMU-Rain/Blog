import useReuest from "@/utils/useRequest";

export function getArticleNumber() {
  return useReuest("get", "/articles");
}
export function getViewerNumber() {
  return useReuest("get", "/visit");
}
export function getPhotoNumber() {
  return useReuest("get", "/photos");
}
export function getDuxiuIndex() {
  return useReuest("get", "/duxiuindex");
}
