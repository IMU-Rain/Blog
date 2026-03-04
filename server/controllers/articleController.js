const path = require("path");
const fsPromise = require("fs/promises");
const OpenAI = require("openai");
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
  RESOURCE_NOT_FIND,
  RESOURCE_DELETE_FAIL,
  SERVER_ERROR,
} = require("../utils/errorTypes");
const { mkThumbnail } = require("../utils/image");

function normalizeAssetPath(rawPath = "") {
  return String(rawPath)
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "");
}
// 创建文章
const createArticle = async (req, res) => {
  try {
    const articleData = req.body;
    if (!articleData) {
      errorResponse(res, PARAM_MISSING, err.message, 500);
    }
    const article = new Article(articleData);
    const saved = await article.save();
    successResponse(res, saved, "文章创建成功");
  } catch (err) {
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
    successResponse(res, datas, articles.length);
  } catch (err) {
    errorResponse(res, DB_ERROR, err.message, 500);
  }
};
// 获取单篇文章
const getArticleById = async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Article.findById(id);
    if (!article) {
      return errorResponse(
        res,
        PARAM_ERROR,
        `未从数据库中找到id:${id}的文章`,
        404,
      );
    }
    successResponse(res, article);
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
// 更新文章
const updateArticle = async (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    if (!id) {
      return errorResponse(res, PARAM_MISSING, "缺少文章ID", 400);
    }
    const update = await Article.findByIdAndUpdate(
      id,
      { ...req.body, updateAt: new Date() }, // 保证更新时间更新
      { new: true }, // 返回更新后的对象
    );
    if (!update) {
      return errorResponse(
        res,
        RESOURCE_NOT_FIND,
        `未从数据库中找到文章id:${id}`,
        404,
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
        404,
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
// 上传文章封面
const uploadArticleCover = async (req, res) => {
  const file = req.file;
  if (!file) {
    return errorResponse(res, PARAM_MISSING, "未接收到封面文件", 400);
  }
  const absInputPath = file.path || path.join(file.destination, file.filename);
  try {
    const thumbnailResult = await mkThumbnail(
      absInputPath,
      UPLOAD_DIR_ABS_COVER,
      file.filename,
    );
    if (!thumbnailResult || !thumbnailResult.thumbnailName) {
      throw new Error("封面缩略图生成失败");
    }
    const { thumbnailName } = thumbnailResult;
    await fsPromise.unlink(absInputPath);
    const coverPath = normalizeAssetPath(
      `${UPLOAD_DIR_NAME_COVER}/${thumbnailName}`,
    );
    const serverBase = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
    successResponse(
      res,
      {
        coverPath,
        path: coverPath,
        url: `${serverBase}/${coverPath}`,
        fileName: thumbnailName,
        originalName: file.originalname,
      },
      undefined,
      "封面上传成功",
    );
  } catch (err) {
    await fsPromise.unlink(absInputPath).catch(() => {});
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
// 获取文章AI摘要
async function createExpert(req, res) {
  try {
    const content = req.body?.content;
    if (!content || typeof content !== "string") {
      return errorResponse(res, PARAM_MISSING, "缺少正文 content", 400);
    }

    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "你是一个中文写作助手，请生成不超过100字的文章摘要。",
        },
        {
          role: "user",
          content,
        },
      ],
      model: "deepseek-chat",
    });
    successResponse(res, completion.choices[0].message.content, "摘要获取成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, "500");
  }
}
module.exports = {
  createExpert,
  uploadArticleCover,
  createArticle,
  getArticleInfo,
  getArticleById,
  updateArticle,
  deleteArticle,
};
