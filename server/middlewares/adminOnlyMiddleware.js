const { PERMISSION_DENIED } = require("../utils/errorTypes");
const { errorResponse } = require("./responseHandler");

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return errorResponse(res, PERMISSION_DENIED, "权限不足", 403);
  }
  next();
};
module.exports = adminOnly;
