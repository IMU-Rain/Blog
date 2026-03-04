const router = require("express").Router();
const { uploader } = require("../controllers/fileController");
const { singleImage } = require("../middlewares/uploads");
const authMiddleware = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminOnlyMiddleware");
router.post("/", authMiddleware, adminOnly, singleImage, uploader);
module.exports = router;
