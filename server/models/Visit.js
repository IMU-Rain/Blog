const mongoose = require("mongoose");
const visitSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  visitTime: {
    type: Date,
    default: Date.now,
  },
  country: String,
  region: String,
  city: String,
});
module.exports = mongoose.model("Visit", visitSchema);
