const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    coverPicture: {
      type: String,
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    favList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
    watchList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
    customLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model("User", userSchema)
module.exports = User
