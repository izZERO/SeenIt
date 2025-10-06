const List = require("../models/List")

exports.watchList_index_get = async (req, res) => {
  try {
    const watchList = await List.findOne({
      user: req.session.user._id,
      isWatchList: true,
    })
    res.send(watchList)

  } catch (error) {
    console.error(
      "An error has occurred while getting the watch list!",
      error.message
    )
  }
}

exports.watchList_add_put = async (req, res) => {
  try {
    await List.findOneAndUpdate(
      { user: req.session.user._id, isWatchList: true },
      req.body
    )
    res.send("List Updated")

  } catch (error) {
    console.error(
      "An error has occurred while updating the watch list!",
      error.message
    )
  }
}

exports.watchList_delete_delete = async (req, res) => {
  try {
    await List.findOneAndUpdate(
      { user: req.session.user._id, isWatchList: true },
      { $pull: { movie: req.body.movieId } }
    )
    res.send("Movie removed from watchlist")

  } catch (error) {
        console.error(
      "An error has occurred while deleting from the watch list!",
      error.message
    )
  }
}

exports.favList_index_get = async (req, res) => {
    try {
    const favList = await List.findOne({
      user: req.session.user._id,
      isFavList: true,
    })
    res.send(favList)

  } catch (error) {
    console.error(
      "An error has occurred while getting the favourite list!",
      error.message
    )
  }
}

exports.favList_add_put = async (req, res) => {
  try {
    await List.findOneAndUpdate(
      { user: req.session.user._id, isFavList: true },
      req.body
    )
    res.send("List Updated")

  } catch (error) {
    console.error(
      "An error has occurred while updating the favourite list!",
      error.message
    )
  }
}

exports.favList_delete_delete = async (req, res) => {
  try {
    await List.findOneAndUpdate(
      { user: req.session.user._id, isFavList: true },
      { $pull: { movie: req.body.movieId } }
    )
    res.send("Movie removed from favourite list")

  } catch (error) {
        console.error(
      "An error has occurred while deleting from the favourite list!",
      error.message
    )
  }
}
