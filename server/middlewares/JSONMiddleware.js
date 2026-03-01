const { errorResponse } = require("./responseHandler");
const JSONParseMiddleware = async (req, res, next) => {
  try {
    console.log(req.body)
    // req.body = JSON.parse(req.body);
    next();
  } catch (err) {
    console.log(err);
  }
};
module.exports = { JSONParseMiddleware };
