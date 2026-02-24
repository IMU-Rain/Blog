const {
  successResponse,
  errorResponse,
} = require("../middlewares/responseHandler");
const { UPLOAD_DIR_NAME } = require("../middlewares/uploads");
const { PARAM_MISSING } = require("../utils/errorTypes");
const fileSchema = require("../models/File");
const uploader = async (req, res) => {
  const file = req.file;
  if (!file) {
    return errorResponse(res, PARAM_MISSING, "未接收到文件", 400);
  }
  try {
    const fileURL = `${UPLOAD_DIR_NAME}/origin/${file.filename}`;
    const data = {
      url: fileURL,
      fileName: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      ext: file.ext,
    };
    const saved = await new fileSchema(data).save();
    successResponse(res, saved);
  } catch (err) {
    errorResponse(res, DB_ERROR, err.message, 500);
  }
};
module.exports = { uploader };
