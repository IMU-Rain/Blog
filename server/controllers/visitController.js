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
    successResponse(res, visitData, "访问数据获取成功");
  } catch (err) {
    errorResponse(res, DB_ERROR, null, err.message, 500);
  }
};
module.exports = { getVisit };
