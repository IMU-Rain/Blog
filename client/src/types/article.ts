interface ArticleRaw {
  id: string;
  title: string;
  excerpt?: string;
  url?: string;
  tags?: string[];
  createAt: string;
}
interface ArticleDetail {
    containImg: string[];
    _id: string;
    title: string;
    cover: string;
    content: string;
    excerpt: string;
    toc?: string;
    status: string;
    tags?: string[];
    views: string;
    createAt?: string;
    updateAt: string;
    __v: string;
}
interface ArticleRawResponseType {
  message: string;
  data: [ArticleRaw];
}
type Articles = ArticleRaw;
export type { Articles, ArticleRaw, ArticleDetail, ArticleRawResponseType };
