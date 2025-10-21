const path = require("path");
const fsPromise = require("fs/promises");
const { mkThumbnail } = require("../utils/image");
const {
  UPLOAD_DIR_ABS_ARTICLE,
  UPLOAD_DIR_NAME_ARTICLE,
} = require("../middlewares/uploads");
const ArticleImage = require("../models/articlePhoto");
const {
  errorResponse,
  successResponse,
} = require("../middlewares/responseHandler");
const { SERVER_ERROR, PARAM_MISSING } = require("../utils/errorTypes");
const uploadArticleImage = async (req, res) => {
  if (!req.files) {
    return errorResponse(res, PARAM_MISSING, "未接收到文件", 400);
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
        const saved = await new ArticleImage({
          url,
          originalName: file.originalname,
          thumbnailName,
          path,
        }).save();
        const detail = { url, id: saved.id };
        console.log(saved);
        return { originalname: file.originalname, detail };
      })
    );
    successResponse(res, imageURL, "所有文件上传成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
module.exports = {
  uploadArticleImage,
};
