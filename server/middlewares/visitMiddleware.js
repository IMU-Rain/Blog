const visitSchema = require("../models/Visit");
function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    ""
  );
}
async function visitMiddleware(req, res, next) {
  let ip = getClientIP(req);
  if (ip === "::1") ip = "127.0.0.1";
  await visitSchema.find({ ip }).then(async (res) => {
    if (res.length === 0) {
      await visitSchema.create({
        ip,
        path: req.path,
        userAgent: req.headers["user-agent"],
      });
    } else {
      return;
    }
  });
  next();
}
module.exports = { visitMiddleware };
