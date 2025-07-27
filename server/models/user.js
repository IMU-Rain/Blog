const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    require: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    requre: true,
    unique: true,
    trim: true,
  },
  avator: String,
  //个人简介
  bio: {
    type: String,
    maxlength: 200,
    default: "",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});
module.exports=mongoose.model('User',userSchema)