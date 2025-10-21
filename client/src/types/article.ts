interface ArticleRaw {
  id: string;
  title: string;
  excerpt?: string;
  url?: string;
  tags?: string[];
  createAt: string;
}
interface ArticleDetail {
  article: {
    containImg: string[];
    _id: string;
    title: string;
    cover: string;
    content: string;
    excerpt: string;
    status: string;
    tags?: string[];
    views: string;
    createAt?: string;
    updateAt: string;
    __v: string;
  };
  url: string;
}
interface ArticleRawResponseType {
  message: string;
  data: [ArticleRaw];
}
type Articles = Readonly<ArticleRaw>;
export type { Articles, ArticleRaw, ArticleDetail, ArticleRawResponseType };
