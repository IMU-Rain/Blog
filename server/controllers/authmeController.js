const {
  errorResponse,
  successResponse,
} = require("../middlewares/responseHandler");
const { USER_ERROR } = require("../utils/errorTypes");

const authmeController = async (req, res) => {
  const { user } = req;
  if (!user)
    return errorResponse(
      res,
      USER_ERROR,
      "未登录或 token 失效，请重新登录",
      401,
    );
  const userInfo = req.userInfo;
  return successResponse(
    res,
    userInfo
      ? userInfo.toSafeJSON()
      : {
          username: user.username,
          role: user.role,
          id: user.id,
        },
    undefined,
    "获取用户信息成功",
  );
};
module.exports = authmeController;
