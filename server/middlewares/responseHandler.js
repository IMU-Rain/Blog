const errorResponse = (res, errorType, detail = "", statusCode = 400) => {
  const response = {
    code: errorType.code,
    message: errorType.message,
    detail,
  };
  res.status(statusCode).json(response);
};
const successResponse = (res, data = null, message = "操作成功") => {
  res.status(200).json({ message, data });
};
module.exports = {
  successResponse,
  errorResponse,
};
