const router = require("express").Router();
const articleController = require("../controllers/articleController");
const adminOnly = require("../middlewares/adminOnlyMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
// 创建文章
router.post(
  "/",
  authMiddleware,
  adminOnly,
  articleController.createArticle,
);
// 创建文章
router.post(
  "/expert",
  authMiddleware,
  adminOnly,
  articleController.createExpert,
);
// 获取所有文章
router.get("/", articleController.getArticleInfo);
// 获取具体文章内容
router.get("/:id", articleController.getArticleById);
// 更新文章
router.put("/:id", authMiddleware, adminOnly, articleController.updateArticle);
// 删除文章
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  articleController.deleteArticle,
);
module.exports = router;
