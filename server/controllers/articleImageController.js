const path = require("path");
const fsPromise = require("fs/promises");
const { mkThumbnail } = require("../utils/image");
const {
  UPLOAD_DIR_ABS_ARTICLE,
  UPLOAD_DIR_NAME_ARTICLE,
} = require("../middlewares/uploads");
const ArticleImage = require("../models/articlePhoto");
const uploadArticleImage = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "未接收到文件" });
  }
  try {
    let imageURL = await Promise.all(
      req.files.map(async (file) => {
        const absInput = `${file.destination}/${file.filename}`;
        const absOutputDir = UPLOAD_DIR_ABS_ARTICLE;
        const { thumbnailName } = await mkThumbnail(
          absInput,
          absOutputDir,
          file.filename
        );
        await fsPromise.unlink(file.path);
        const path = `${absOutputDir}/${thumbnailName}`;
        const url = `${process.env.BASE_URL}/${UPLOAD_DIR_NAME_ARTICLE}/${thumbnailName}`;
        new ArticleImage({
          url,
          originalName: file.originalname,
          thumbnailName,
          path,
        }).save();
        return { originalname: file.originalname, url };
      })
    );
    res.status(200).json(imageURL);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  uploadArticleImage,
};
