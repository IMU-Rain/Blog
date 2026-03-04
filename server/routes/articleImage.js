const router = require("express").Router();
const articleimageController = require("../controllers/articleImageController");
const { articleImage } = require("../middlewares/uploads");
const authMiddleware = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminOnlyMiddleware");

router.post(
  "",
  authMiddleware,
  adminOnly,
  articleImage,
  articleimageController.uploadArticleImage,
);
module.exports = router;
