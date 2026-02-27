const visitSchema = require("../models/Visit");
const http = require("http");
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

  const options = {
    hostname: "6b65d478.api.cn",
    port: 80, // 如果是 HTTPS，则是 443
    path: "/ipdata",
    method: "GET",
    headers: {
      token: "2336e4405ebb68addd887f24b28a81f8",
    },
  };

  // 返回一个 Promise，确保在请求完成后调用 next()
  const requestPromise = new Promise((resolve, reject) => {
    const reqs = http.request(options, (res) => {
      let data = ""; // 存储响应内容

      res.on("data", (chunk) => {
        data += chunk; // 将每个 chunk 拼接起来
      });

      res.on("end", () => {
        console.log("Response: ", data); // 输出响应体
        resolve(data); // 请求完成后 resolve
      });
    });

    reqs.on("error", (err) => {
      console.error("Request failed:", err);
      reject(err); // 请求出错时 reject
    });

    reqs.end(); // 确保请求被发送
  });

  try {
    // 等待请求完成
    await requestPromise;
    // 在请求完成后执行 next()
    next();
  } catch (error) {
    console.error("Error in request:", error);
    // 如果请求失败，仍然调用 next()
    next();
  }
}

module.exports = { visitMiddleware };
