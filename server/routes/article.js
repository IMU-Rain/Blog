const router = require("express").Router();
const articleController = require("../controllers/articleController");
const { coverImage } = require("../middlewares/uploads");
// 创建文章
router.post("/", coverImage, articleController.createArticle);
// 获取所有文章
router.get("/", articleController.getArticleInfo);
// 获取具体文章内容
router.get("/:id", articleController.getArticleById);
// 更新文章
router.put("/update", articleController.updateArticle);
// 删除文章
router.delete("/:id", articleController.deleteArticle);
module.exports = router;
