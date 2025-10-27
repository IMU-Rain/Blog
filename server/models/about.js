const mongoose = require("mongoose");
const aboutSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createAt: { type: Date, default: Date.now() },
});
aboutSchema.pre("save", function (next) {
  this.createAt = Date.now();
  next();
});
module.exports = mongoose.model("About", aboutSchema);
