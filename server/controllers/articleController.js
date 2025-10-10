const path = require("path");
const fsPromise = require("fs/promises");
const Article = require("../models/article");
const { UPLOAD_DIR_NAME_COVER } = require("../middlewares/uploads");
// 创建文章
const createArticle = async (req, res) => {
  try {
    const cover = req.file;
    const articleData = JSON.parse(req.body.article);
    if (cover) {
      articleData.cover = `/${UPLOAD_DIR_NAME_COVER}/${cover.filename}`;
    }
    const article = new Article(articleData);
    const saved = await article.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// 获取文章封面
const getArticleInfo = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createAt: -1 });
    const datas = articles.map((article) => {
      return {
        id: article._id,
        title: article.title,
        excerpt: article.excerpt,
        url: `${req.protocol}://${req.get("host")}${article.cover}`,
        tags: article.tags,
        createAt: article.createAt,
      };
    });
    res.status(200).json(datas);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
// 获取单篇文章
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    const url = `${req.protocol}://${req.get("host")}${article.cover}`;
    if (!article) {
      return res.status(404).json({ error: "文章不存在" });
    }
    return res.status(200).json({ article, url });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// 更新文章
const updateArticle = async (req, res) => {
  try {
    const id = req.query.id;
    const update = await Article.findByIdAndUpdate(
      id,
      { ...req.body, updateAt: new Date() }, // 保证更新时间更新
      { new: true } // 返回更新后的对象
    );
    if (!update) {
      res.status(404).json({ error: "文章未找到" });
    } else {
      res.json({ message: update });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
// 删除文章
const deleteArticle = async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: "文章未找到" });
    }
    const filepath = path.join(__dirname, "..", article.cover);
    try {
      await fsPromise.unlink(filepath);
    } catch (err) {
      console.warn("文件删除失败（可能已不存在）：", err.message);
    }
    const deleted = await Article.findByIdAndDelete(id);
    return res.json({ message: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createArticle,
  getArticleInfo,
  getArticleById,
  updateArticle,
  deleteArticle,
};
