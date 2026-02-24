const router = require("express").Router();
const { uploader } = require("../controllers/fileController");
const { singleImage } = require("../middlewares/uploads");
router.post("/", singleImage, uploader);
module.exports = router;
