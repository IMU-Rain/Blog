const { TOKEN_MISSING, TOKEN_EXPIRED } = require("../utils/errorTypes");
const { errorResponse } = require("./responseHandler");

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "dev-secret-key";
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return errorResponse(res, TOKEN_MISSING, "重新重新登陆!", 401);
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, TOKEN_EXPIRED, err.message, 401);
  }
};
module.exports = authMiddleware;
