const mongoose = require("mongoose");
const articleImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadAt: { type: Date, default: Date.now },
  thumbnailName: { type: String, require: true },
  path: { type: String, require: true },
});
articleImageSchema.pre("save", (next) => {
  this.uploadAt = Date.now();
  next();
});
module.exports = mongoose.model("ArticleImage", articleImageSchema);
