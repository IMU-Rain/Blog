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
    // 生成token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "30m" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });
    successResponse(res, { username }, "登陆成功");
  } catch (err) {
    errorResponse(res, SERVER_ERROR, err.message, 500);
  }
};
module.exports=loginController