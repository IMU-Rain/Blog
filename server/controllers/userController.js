const userSchema = require("../models/user");
const Comment = require("../models/comment");
const {
  successResponse,
  errorResponse,
} = require("../middlewares/responseHandler");
const {
  PARAM_ERROR,
  RESOURCE_NOT_FIND,
  SERVER_ERROR,
  PERMISSION_DENIED,
} = require("../utils/errorTypes");

const getAdminUsers = async (_req, res) => {
  try {
    const users = await userSchema
      .find()
      .select("_id username nickname avatar password role status createAt updateAt")
      .sort({ createAt: -1 });

    const data = users.map((user) => ({
      id: user._id,
      username: user.username,
      nickname: user.nickname || user.username,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      passwordHash: user.password,
      createAt: user.createAt,
      updateAt: user.updateAt,
    }));

    successResponse(res, data, data.length, "账号列表获取成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return errorResponse(res, PARAM_ERROR, "账号ID不能为空", 400);
  }
  if (String(req.user?.id) === String(id)) {
    return errorResponse(res, PERMISSION_DENIED, "不能删除当前登录账号", 403);
  }

  try {
    const user = await userSchema.findById(id);
    if (!user) {
      return errorResponse(res, RESOURCE_NOT_FIND, "账号不存在", 404);
    }
    if (user.role === "admin") {
      return errorResponse(res, PERMISSION_DENIED, "不能删除管理员账号", 403);
    }

    await Comment.updateMany({ author: id }, { status: "hidden" });
    await user.deleteOne();
    successResponse(res, { id }, undefined, "账号删除成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

module.exports = {
  getAdminUsers,
  deleteUser,
};
