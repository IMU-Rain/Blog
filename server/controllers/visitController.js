const visitSchema = require("../models/Visit");
const {
  successResponse,
  errorResponse,
} = require("../middlewares/responseHandler");
const {
  PARAM_MISSING,
  DB_ERROR,
  RESOURCE_NOT_FIND,
} = require("../utils/errorTypes");
const getVisit = async (req, res) => {
  try {
    const visitData = await visitSchema.find({});
    successResponse(res, null, visitData.length, "访问数据获取成功");
  } catch (err) {
    errorResponse(res, DB_ERROR, null, err.message, 500);
  }
};
const getVisitMap = async (req, res) => {
  try {
    const mapData = await visitSchema.aggregate([
      {
        $group: {
          _id: "$country", // 分组字段：国家
          value: { $sum: 1 }, // 统计次数
        },
      },
      {
        $project: {
          name: "$_id", // 前端ECharts需要的name字段
          value: 1,
          _id: 0,
        },
      },
      {
        $match: { name: { $ne: "本地" } }, // 过滤本地访问
      },
    ]);
    successResponse(res, mapData, mapData.length, "访问数据获取成功");
  } catch (err) {
    errorResponse(res, DB_ERROR, err.message, 500);
  }
};
module.exports = { getVisit, getVisitMap };
