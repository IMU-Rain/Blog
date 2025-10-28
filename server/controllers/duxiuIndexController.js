const {
  errorResponse,
  successResponse,
} = require("../middlewares/responseHandler");
const duxiuIndexSchema = require("../models/duxiuIndex");
const { PARAM_MISSING, SERVER_ERROR } = require("../utils/errorTypes");
const createDuxiuIndex = async (req, res) => {
  try {
    const { year, month, income, expense } = req.body;
    if (!year || !month || !income || !expense) {
      return errorResponse(res, PARAM_MISSING, req.body, 201);
    }
    const newDuxiuIndex = new duxiuIndexSchema({
      year,
      month,
      income,
      expense,
    });
    const saved = await newDuxiuIndex.save();
    successResponse(res, saved, "最新独秀指数创建成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
const getDuxiuIndex = async (req, res) => {
  try {
    const duxiuIndexDatas = await duxiuIndexSchema
      .find()
      .sort({ year: 1, month: 1 });
    duxiuIndexDatas.map((duxiuIndexData) => {
      return {
        month: duxiuIndexData.month,
        year: duxiuIndexData.year,
        duxiuIndex: duxiuIndexData.duxiuIndex,
      };
    });
    successResponse(res, duxiuIndexDatas);
  } catch (err) {}
};
const updateDuxiuIndex = async (req, res) => {
  try {
    const { year, month, income, expense } = req.body;
    if (!year || !month || !income || !expense) {
      return errorResponse(res, PARAM_MISSING, req.body, 201);
    }
    const duxiuIndex = (income / expense).toFixed(2);
    const saved = await duxiuIndexSchema.findOneAndUpdate(
      { year, month },
      { income, expense, duxiuIndex },
      { new: true }
    );
    successResponse(res, saved, "独秀指数更新成功");
  } catch (err) {
    console.log(err.message);
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
module.exports = {
  getDuxiuIndex,
  createDuxiuIndex,
  updateDuxiuIndex,
};
