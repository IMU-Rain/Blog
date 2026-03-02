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
  }),
);
app.use(express.json());
app.use(visitMiddleware);
// 连接数据库
mongoose
  .connect("mongodb://localhost:27017/blog")
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("后端服务已启动");
});
