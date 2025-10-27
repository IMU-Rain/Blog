const mongoose = require("mongoose");
const duxiuIndexSchema = new mongoose.Schema({
  year: {
    required: true,
    type: Number,
  },
  month: {
    required: true,
    type: Number,
  },
  income: {
    required: true,
    type: Number,
  },
  expense: {
    required: true,
    type: Number,
  },
  createAt: { type: Date, default: Date.now() },
  duxiuIndex: { type: Number },
});
duxiuIndexSchema.pre("save", function (next) {
  this.createAt = Date.now();
  this.duxiuIndex = (this.income / this.expense).toFixed(2);
  next();
});
module.exports = mongoose.model("duxiuIndexSchema", duxiuIndexSchema);
