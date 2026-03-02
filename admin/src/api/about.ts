import useReuest from "../utils/useRequest";
/**获取关于 */
export function getAbout() {
  return useReuest("get", "/about");
}
/**修改关于 */
export function updateAbout(content: string) {
  return useReuest("put", "/about", { content });
}
