const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const uploadPath = path.resolve(__dirname, "../uploads");
const { visitMiddleware } = require("./middlewares/visitMiddleware");
require("dotenv").config();
// 中间件
const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  "http://localhost:5173",
  "http://localhost:5174",
  "https://maxbyte.fun",
  "https://www.maxbyte.fun",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS blocked for origin: " + origin));
    },
    credentials: true,
    // 新增：允许的请求方法（覆盖登录接口的 POST 方法）
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // 新增：允许的请求头（登录接口需要 Content-Type 等）
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);
app.use(express.json());
app.use(visitMiddleware);
// 连接数据库
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("数据库连接成功"))
  .catch((err) => console.log(err));
// 路由引入及使用
const articleRoutes = require("./routes/article");
const photoRoutes = require("./routes/photo");
const aboutRoutes = require("./routes/about");
const duxiuIndexRoutes = require("./routes/duxiuIndex");
const articleImageRoutes = require("./routes/articleImage");
const loginRoutes = require("./routes/login");
const visitRoutes = require("./routes/visit");
const uploadRoutes = require("./routes/uploader");
const commentRoutes = require("./routes/comment");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use("/api/articles", articleRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/articleimg", articleImageRoutes);
app.use("/api/duxiuIndex", duxiuIndexRoutes);
app.use("/uploads", express.static(uploadPath));
app.use("/api/login", loginRoutes);
app.use("/api/visit", visitRoutes);
app.use("/api/file", uploadRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("后端服务已启动");
});
