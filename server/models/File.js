const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema({
  fileName: { type: String, require: true },
  originalName: { type: String, require: true },
  url: { type: String, require: true },
  path: { type: String, require: true },
  size: { type: String },
  mimeType: { type: String, require: true },
  createAt: { type: Date, default: Date.now(), require: true },
});
fileSchema.pre("save", function (next) {
  this.createAt = Date.now();
  next();
});
module.exports = mongoose.model("File", fileSchema);
