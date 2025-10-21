const mongoose = require("mongoose");
const photoSchema = new mongoose.Schema({
  filename: {
    type: String,
    trim: true,
    unique: true,
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
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimetype: {
    type: String,
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
  // models/photo.js
  thumbnailPath: { type: String, default: "" },
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
module.exports = mongoose.model("Photo", photoSchema);
