import useReuest from "../utils/useRequest";
/**获取文章列表 */
export function getArticleList() {
  return useReuest("get", "/articles");
}
/**获取文章细节 */
export function getArticleDetail(id: string) {
  return useReuest("get", `/articles/${id}`);
}
/**创建文章 */
export function createArticle(data: any) {
  return useReuest("post", "/articles", data);
}
/**上传文章封面 */
export function uploadArticleCover(file: FormData) {
  return useReuest("post", "/articles/cover", file);
}
/**Ai生成摘要 */
export async function createExpert(data: string) {
  return useReuest("post", "/articles/expert", { content: data });
}
/**更新文章 */
export function updateArticle(id: string, data: any) {
  return useReuest("put", `/articles/${id}`, data);
}
/**删除文章 */
export function articleDelete(id: string) {
  return useReuest("delete", `/articles/${id}`);
}
