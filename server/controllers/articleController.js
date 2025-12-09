const path = require("path");
const fsPromise = require("fs/promises");
const Article = require("../models/article");
const ArticlePhoto = require("../models/articlePhoto");
const {
  UPLOAD_DIR_ABS_COVER,
  UPLOAD_DIR_NAME_COVER,
} = require("../middlewares/uploads");
const {
  successResponse,
  errorResponse,
} = require("../middlewares/responseHandler");
const {
  PARAM_MISSING,
  DB_ERROR,
  PARAM_ERROR,
  RESOURCE_DELETE_FAIL,
  SERVER_ERROR,
} = require("../utils/errorTypes");
const { mkThumbnail } = require("../utils/image");
// 创建文章
const createArticle = async (req, res) => {
  let articleData;
  try {
    const cover = req.file;
    const outputPath = UPLOAD_DIR_ABS_COVER;
    const { thumbnailName } = await mkThumbnail(
      cover.path,
      outputPath,
      cover.filename,
      1200
    );
    if (!cover) {
      errorResponse(res, PARAM_MISSING, "封面图片未上传", 400);
      return;
    }
    try {
      articleData = JSON.parse(req.body.article);
    } catch (parseErr) {
      return errorResponse(
        res,
        PARAM_ERROR,
        `JSON格式错误:${parseErr.message},位置:${parseErr.position}`,
        400
      );
    }
    articleData.cover = `${UPLOAD_DIR_NAME_COVER}/${thumbnailName}`;
    const article = new Article(articleData);
    const saved = await article.save();
    successResponse(res, saved, "文章创建成功");
  } catch (err) {
    if (err.name === "ValidationError") {
      // 文章校验失败
      const validationError = Object.values(err.errors)
        .map((item) => `${item.path}:${item.message}`)
        .join(";");
      return errorResponse(res, PARAM_ERROR, err.message, 500);
    } else if (err.message.includes("file") || err.message.includes("upload")) {
      // 文章封面相关问题
      return errorResponse(res, SERVER_ERROR, err.message, 500);
    }
    errorResponse(res, DB_ERROR, err.message, 500);
  }
};
// 获取文章目录信息
const getArticleInfo = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createAt: -1 });
    const datas = articles.map((article) => {
      return {
        id: article._id,
        title: article.title,
        excerpt: article.excerpt,
        url: article.cover,
        tags: article.tags,
        createAt: article.createAt,
      };
    });
    successResponse(res, datas);
  } catch (err) {
    errorResponse(res, DB_ERROR, err.message, 500);
  }
};
// 获取单篇文章
const getArticleById = async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Article.findById(id);
    const url = article.cover;
    if (!article) {
      return errorResponse(
        res,
        PARAM_ERROR,
        `未从数据库中找到id:${id}的文章`,
        404
      );
    }
    successResponse(res, { article, url });
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
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
      return errorResponse(
        res,
        RESOURCE_NOT_FIND,
        `未从数据库中找到文章id:${id}`,
        404
      );
    }
    successResponse(res, update, "文章更新成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, "500");
  }
};
// 删除文章
const deleteArticle = async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findById(id);
    if (!article) {
      return errorResponse(
        res,
        RESOURCE_DELETE_FAIL,
        `数据库中未找到id:${id}的文章`,
        404
      );
    }
    try {
      article.containImg.map(async (id) => {
        const img = await ArticlePhoto.findById(id);
        fsPromise.unlink(img.path);
        await ArticlePhoto.deleteOne({ id });
      });
    } catch (err) {
      console.warn("文件删除失败（可能已不存在）：", err.message);
    }
    const coverPath = path.join(__dirname, "..", article.cover);
    try {
      await fsPromise.unlink(coverPath);
    } catch (err) {
      console.warn("文件删除失败（可能已不存在）：", err.message);
    }
    const deleted = await Article.findByIdAndDelete(id);
    return successResponse(res, deleted, "文章删除成功");
  } catch (err) {
    return errorResponse(res, RESOURCE_DELETE_FAIL, err.message, 500);
  }
};
module.exports = {
  createArticle,
  getArticleInfo,
  getArticleById,
  updateArticle,
  deleteArticle,
};
