const {
  successResponse,
  errorResponse,
} = require("../middlewares/responseHandler");
const About = require("../models/about");
const {
  PARAM_MISSING,
  DB_ERROR,
  RESOURCE_NOT_FIND,
} = require("../utils/errorTypes");

// 创建关于页文章
const createAbout = async (req, res) => {
  try {
    const aboutData = JSON.parse(req.body.content);
    if (!aboutData) {
      errorResponse(res, PARAM_MISSING, null, 400);
    }
    const about = new About(aboutData);
    const saved = await about.save();
    successResponse(res, saved, "关于页文章创建成功");
  } catch (err) {
    errorResponse(res, DB_ERROR, err.message, 500);
  }
};
// 更新关于页文章
const updateAbout = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      errorResponse(res, PARAM_MISSING, null, 400);
    }
    const updated = await About.findOneAndUpdate(
      {},
      { content },
      { new: true, upsert: true }
    );
    if (!updated) {
      errorResponse(res, DB_ERROR, null, "未从数据库中找到关于页文章");
    }
    successResponse(res, null, "关于页文章更新成功");
  } catch (err) {
    errorResponse(res, DB_ERROR, err.message, 500);
  }
};
// 获取关于页文章
const getAbout = async (req, res) => {
  try {
    const aboutData = await About.find({});
    const about = aboutData[0];
    if (!about) {
      errorResponse(
        res,
        RESOURCE_NOT_FIND,
        null,
        "未找到文章, 请联系Max Byte",
        404
      );
    }
    successResponse(res, about, "文章获取成功");
  } catch (err) {
    errorResponse(res, DB_ERROR, null, err.message, 500);
  }
};
module.exports = {
  getAbout,
  createAbout,
  updateAbout,
};
