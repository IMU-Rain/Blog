import axios from "./axios";
// 获取文章封面，标题列表
const getArticles = () => {
  return axios.get("/articles");
};
// 根据id获取文章
const getArticleDetail = (id: string) => {
  return axios.get(`/articles/${id}`);
};
// 获取关于页网站简介

export default {
  getArticles,
  getArticleDetail,
};
