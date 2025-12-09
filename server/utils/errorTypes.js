module.exports = {
  PARAM_ERROR: { code: 100, message: "参数格式不正确" },
  PARAM_MISSING: { code: 101, message: "参数缺失" },
  RESOURCE_NOT_FIND: { code: 200, message: "资源缺失" },
  RESOURCE_DELETE_FAIL: { code: 201, message: "资源删除失败" },
  DB_ERROR: { code: 300, message: "数据库操作失败" },
  SERVER_ERROR: { code: 500, message: "服务器内部错误" },
  USER_ERROR: { code: 401, message: "用户信息错误" },
  TOKEN_MISSING: { code: 401, message: "token缺失,请重新登陆" },
  PERMISSION_DENIED: { code: 403, message: "非管理员,权限不足" },
  TOKEN_EXPIRED: { code: 401, message: "token过期" },
};
