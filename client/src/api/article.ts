import axios from "./axios";
// 获取文章封面，标题列表
export const getArticles = () => {
  return axios.get("/articles").then((res) => res.data.data);
};
interface param {
  id: string;
}
// 根据id获取文章
export const getArticleDetail = (params: param = { id: "" }) => {
  return axios.get(`/articles/${params.id}`).then((res) => res.data.data);
};
