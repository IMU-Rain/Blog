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
/**Ai生成标题 */
export async function createTitle(data: string) {
  return useReuest("post", "/articles/title", { content: data });
}
/**Ai提取标签 */
export async function createTags(data: string) {
  return useReuest("post", "/articles/tags", { content: data });
}
/**Ai生成目录 */
export async function createToc(data: string) {
  return useReuest("post", "/articles/toc", { content: data });
}
/**更新文章 */
export function updateArticle(id: string, data: any) {
  return useReuest("put", `/articles/${id}`, data);
}
/**删除文章 */
export function articleDelete(id: string) {
  return useReuest("delete", `/articles/${id}`);
}
