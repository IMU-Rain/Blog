const errorResponse = (res, errorType, detail = "", statusCode = 400) => {
  const response = {
    code: errorType.code,
    message: errorType.message,
    detail,
  };
  res.status(statusCode).json(response);
};
const successResponse = (res, data = null, total, message = "操作成功") => {
  res.status(200).json({ message, data, total });
};
module.exports = {
  successResponse,
  errorResponse,
};
