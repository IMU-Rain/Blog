const visitSchema = require("../models/Visit");
const http = require("http");

// 1. 获取客户端真实IP（兼容反向代理场景）
function getClientIP(req) {
  // 优先取反向代理传递的真实IP，兼容多个代理的情况
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    // 取第一个非内网的IP（处理多个代理的情况）
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    for (const ip of ips) {
      if (
        !ip.startsWith("192.168.") &&
        !ip.startsWith("10.") &&
        !ip.startsWith("172.") &&
        ip !== "::1"
      ) {
        return ip;
      }
    }
  }
  // 没有反向代理时取 socket 地址，兼容 IPv6 转 IPv4
  const remoteIp = req.socket.remoteAddress;
  return remoteIp === "::1" ? "127.0.0.1" : remoteIp || "";
}

// 2. 封装IP解析请求（动态传递IP参数）
async function getIpLocation(ip) {
  // 空IP/本地IP直接返回默认值，避免无效请求
  if (!ip || ip === "127.0.0.1") {
    return { country: "本地", region: "本地", city: "本地" };
  }

  return new Promise((resolve, reject) => {
    // 拼接IP到请求路径，让接口解析指定IP
    const options = {
      hostname: "6b65d478.api.cn",
      port: 80,
      path: `/ipdata/${ip}`, // 关键：传递IP参数
      method: "GET",
      headers: {
        token: "2336e4405ebb68addd887f24b28a81f8",
        "Content-Type": "application/json",
      },
      timeout: 5000, // 设置5秒超时，避免阻塞
    };

    const reqs = http.request(options, (res) => {
      let data = "";

      // 监听数据分片
      res.on("data", (chunk) => {
        data += chunk;
      });

      // 响应结束
      res.on("end", () => {
        try {
          // 解析响应数据，兼容接口返回格式
          let result = JSON.parse(data);
          if (result[0] === "中国") result[0] = "China";
          resolve(result.data ? result.data[0] : result);
        } catch (err) {
          // 解析JSON失败时返回默认值
          reject(new Error(`IP解析响应解析失败: ${err.message}`));
        }
      });
    });

    // 监听请求错误
    reqs.on("error", (err) => {
      reject(new Error(`IP解析请求失败: ${err.message}`));
    });

    // 监听超时
    reqs.on("timeout", () => {
      reqs.destroy();
      reject(new Error("IP解析请求超时"));
    });

    reqs.end();
  });
}

// 3. 访客记录中间件
async function visitMiddleware(req, res, next) {
  try {
    // 步骤1：获取客户端IP
    const ip = getClientIP(req);
    if (!ip) {
      console.warn("无法获取访客IP");
      return next(); // 无IP时直接放行
    }

    // 步骤2：检查该IP是否已存在（避免重复记录）
    const existingVisit = await visitSchema.findOne({ ip });
    if (existingVisit) {
      // 可选：更新最后访问时间
      existingVisit.lastVisitTime = new Date();
      await existingVisit.save();
      return next();
    }

    // 步骤3：获取IP属地（不阻塞请求，可改用 Promise.all 或单独异步）
    let location = { country: "未知", region: "未知", city: "未知" };
    try {
      location = await getIpLocation(ip);
    } catch (err) {
      console.error(`IP ${ip} 解析失败:`, err.message);
    }

    // 步骤4：存入数据库
    const newVisit = new visitSchema({
      ip,
      country: location[0] || "未知",
      region: location[1] || "未知",
      city: location[2] || "未知",
      visitTime: new Date(),
      userAgent: req.headers["user-agent"] || "", // 可选：记录浏览器信息
    });
    await newVisit.save();
    console.log(
      `新访客记录：IP=${ip}, 属地=${location.country}-${location.region}`,
    );
  } catch (err) {
    // 捕获所有异常，不影响主请求流程
    console.error("访客记录中间件异常:", err.message);
  }

  // 最后统一放行（仅调用一次）
  next();
}

module.exports = { visitMiddleware };
