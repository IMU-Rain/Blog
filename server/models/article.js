const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema({
  fileId: { type: String, require: true },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  cover: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  toc: {
    type: String,
    trim: true,
    default: "",
  },
  status: {
    type: String,
    enum: ["default", "published", "archived"],
    default: "default",
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  containImg: {
    type: [{ fileId: String, url: String }],
    default: [],
  },
});
// 文章搜索权重
articleSchema.index(
  {
    title: "text",
    content: "text",
    excerpt: "text",
  },
  {
    weights: {
      title: 5,
      content: 3,
      excerpt: 2,
    },
  },
);
// 保存前自动更新时间
articleSchema.pre("save", function (next) {
  this.updateAt = new Date();
  next();
});
module.exports = mongoose.model("Article", articleSchema);
