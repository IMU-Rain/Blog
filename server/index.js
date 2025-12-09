const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const uploadPath = path.resolve(__dirname, "../uploads");
require("dotenv").config();
// 中间件
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);
app.use(express.json());

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
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use("/api/articles", articleRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/articleimg", articleImageRoutes);
app.use("/api/duxiuIndex", duxiuIndexRoutes);
app.use("/uploads", express.static(uploadPath));
app.use("/api/login", loginRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("后端服务已启动");
});
