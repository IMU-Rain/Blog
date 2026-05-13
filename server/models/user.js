const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/,
  },
  nickname: {
    type: String,
    trim: true,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "disabled"],
    default: "active",
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

userSchema.pre("save", function (next) {
  this.updateAt = new Date();
  next();
});

userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    username: this.username,
    nickname: this.nickname || this.username,
    avatar: this.avatar,
    role: this.role,
    status: this.status,
    createAt: this.createAt,
  };
};

module.exports = mongoose.model("userSchema", userSchema);
