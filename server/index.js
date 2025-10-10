const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
require("dotenv").config();
// 中间件
app.use(cors());
app.use(express.json());
// 创建文件夹
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));
// 连接数据库
mongoose
  .connect("mongodb://localhost:27017/blog")
  .then(() => console.log("数据库连接成功"))
  .catch((err) => console.log(err));
// 路由引入及使用
const articleRoutes = require("./routes/article");
const photoRoutes = require("./routes/photo");
const aboutRoutes = require("./routes/about");
const articleImageRoutes = require("./routes/articleImage");
app.use("/api/articles", articleRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/articleimg", articleImageRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("后端服务已启动");
});
