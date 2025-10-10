const router = require("express").Router();
const articleimageController = require("../controllers/articleImageController");
const { articleImage } = require("../middlewares/uploads");

router.post("", articleImage, articleimageController.uploadArticleImage);
module.exports = router;
