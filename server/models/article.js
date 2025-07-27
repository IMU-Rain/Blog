const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
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
});
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
  }
);
articleSchema.pre("save", function (next) {
  this.updateAt = new Date();
  next();
});
module.exports=mongoose.model('Article',articleSchema)
