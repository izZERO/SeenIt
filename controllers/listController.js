const List = require("../models/List")

exports.watchList_index_get = async (req, res) => {
  const watchList = await List.findOne({
    user: "req.session.user._id",
    isWatchList: true,
  })
  res.send(watchList)
}

exports.watchList_add_put = async (req, res) => {
  await List.findOneAndUpdate(
    { user: req.session.user._id, isWatchList: true },
    req.body
  )
  res.send("List Updated")
}

exports.watchList_delete_delete = async (req, res) => {
  await List.findOneAndUpdate(
    { user: req.session.user._id, isWatchList: true },
    { $pull: { movie: req.body.movieId } }
  )
  res.send("Movie removed from watchlist")
}
