const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  targetType: {
    type: String,
    enum: ["article", "photo"],
    required: true,
    index: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
    required: true,
    index: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
    index: true,
  },
  status: {
    type: String,
    enum: ["published", "hidden"],
    default: "published",
    index: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.index({ targetType: 1, targetId: 1, createAt: -1 });

commentSchema.pre("save", function (next) {
  this.updateAt = new Date();
  next();
});

module.exports = mongoose.model("Comment", commentSchema);
