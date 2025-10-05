const User = require("../models/User")
const List = require("../models/List")


exports.watchList_index_get = async (req,res) => {
  const currentUser = await User.findById(req.session.user._id)
  res.send(watchList)
}

exports.watchList_add_post = async (req,res) => {
  const currentUser = await User.findById(req.session.user._id)
}
