const mongoose = require("mongoose");
const visitSchema = new mongoose.Schema({
  ip: String,
  path: String,        // /article/123
  articleId: String,   // 可选
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
visitSchema.pre("save", function (next) {
  this.createAt = Date.now();
  next();
});
module.exports = mongoose.model("Visit", visitSchema);
