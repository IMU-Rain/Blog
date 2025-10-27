const {
  errorResponse,
  successResponse,
} = require("../middlewares/responseHandler");
const duxiuIndexSchema = require("../models/duxiuIndex");
const { PARAM_MISSING, SERVER_ERROR } = require("../utils/errorTypes");
const createDuxiuIndex = async (req, res) => {
  const data = req.body;
  if (!data.year || !data.month || !data.income || !data.expense) {
    errorResponse(res, PARAM_MISSING, String(req.body), 201);
  }
  try {
    const { year, month, income, expense } = data;
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
    const duxiuIndexDatas = await duxiuIndexSchema.find({});
    const data = [];

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
    const data = duxiuIndexSchema.find({ year, month });
  } catch (err) {}
};
module.exports = {
  getDuxiuIndex,
  createDuxiuIndex,
  updateDuxiuIndex,
};
