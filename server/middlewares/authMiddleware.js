const { TOKEN_MISSING, TOKEN_EXPIRED } = require("../utils/errorTypes");
const { errorResponse } = require("./responseHandler");

const jwt = require("jsonwebtoken");
const userSchema = require("../models/user");
const SECRET_KEY = process.env.SECRET_KEY || "dev-secret-key";
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : "";
    const token = req.cookies?.token || bearerToken;
    if (!token) {
      return errorResponse(res, TOKEN_MISSING, "请重新登陆!", 401);
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await userSchema
      .findById(decoded.id)
      .select("_id username nickname avatar role status");
    if (!user || user.status === "disabled") {
      return errorResponse(res, TOKEN_EXPIRED, "用户不存在或已被禁用", 401);
    }
    req.user = decoded;
    req.userInfo = user;
    next();
  } catch (err) {
    return errorResponse(res, TOKEN_EXPIRED, err.message, 401);
  }
};
module.exports = authMiddleware;
