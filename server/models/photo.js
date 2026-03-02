const mongoose = require("mongoose");
const photoSchema = new mongoose.Schema({
  fileId: { type: String, require: true },
  // 兼容历史索引 filename_1，避免旧索引下 filename=null 触发重复键
  filename: {
    type: String,
    trim: true,
  },
  fileName: {
    type: String,
    trim: true,
    required: true,
  },
  album: {
    type: String,
    trim: true,
  },
  camera: {
    make: { type: String, default: "未知" },
    model: { type: String, default: "未知" },
    iso: Number,
    focalLength: Number,
    shutterSpeed: Number,
    gps: {
      latitude: Number,
      longitude: Number,
    },
  },
  tags: {
    type: [String],
    default: [],
  },
  originalName: {
    type: String,
    trim: true,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  smallThumbUrl: { type: String, default: "" },
  bigThumbUrl: { type: String, default: "" },
  width: Number,
  height: Number,
  shotTime: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

photoSchema.index({ fileName: 1 }, { unique: true });
module.exports = mongoose.model("Photo", photoSchema);
