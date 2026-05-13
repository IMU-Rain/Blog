const {
  errorResponse,
  successResponse,
} = require("../middlewares/responseHandler");
const userSchema = require("../models/user");
const {
  USER_ERROR,
  PARAM_MISSING,
  SERVER_ERROR,
} = require("../utils/errorTypes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "dev-secret-key";

const createToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "7d" },
  );

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/** 处理注册函数 */
const registerController = async (req, res) => {
  const { username, password, nickname } = req.body || {};
  const normalizedUsername = String(username || "").trim();
  if (!normalizedUsername || !password) {
    return errorResponse(res, PARAM_MISSING, "用户名和密码不能为空", 400);
  }
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(normalizedUsername)) {
    return errorResponse(
      res,
      USER_ERROR,
      "用户名仅支持3-30位字母、数字和下划线",
      400,
    );
  }
  if (String(password).length < 6) {
    return errorResponse(res, USER_ERROR, "密码长度不能少于6位", 400);
  }

  try {
    const existed = await userSchema.findOne({ username: normalizedUsername });
    if (existed) {
      return errorResponse(res, USER_ERROR, "用户名已存在", 409);
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await new userSchema({
      username: normalizedUsername,
      nickname: String(nickname || normalizedUsername).trim(),
      password: hashedPassword,
      role: "user",
    }).save();

    const token = createToken(user);
    setAuthCookie(res, token);
    successResponse(
      res,
      { user: user.toSafeJSON(), token },
      undefined,
      "注册成功",
    );
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

/** 处理登陆函数 */
const loginController = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return errorResponse(res, PARAM_MISSING, "参数缺失，请检查数据");
  }
  try {
    const user = await userSchema.findOne({ username });
    if (!user) {
      return errorResponse(
        res,
        USER_ERROR,
        `未发现用户${username},请检查是否注册`,
        401
      );
    }
    // 验证密码
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return errorResponse(res, USER_ERROR, "密码错误，请检查", 401);
    }
    if (user.status === "disabled") {
      return errorResponse(res, USER_ERROR, "账号已被禁用", 403);
    }
    const token = createToken(user);
    setAuthCookie(res, token);
    successResponse(
      res,
      { user: user.toSafeJSON(), token },
      undefined,
      "登陆成功",
    );
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};

const logoutController = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });
  successResponse(res, null, undefined, "退出登录成功");
};

module.exports = {
  loginController,
  logoutController,
  registerController,
};
