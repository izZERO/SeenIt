const List = require("../models/List")

exports.watchList_index_get = async (req, res) => {
  try {
    const watchList = await List.findOne({
      user: req.session.user._id,
      isWatchList: true,
    })
      .populate("movie")
      .populate("tv")

    const movies = watchList?.movie || []
    const tvShows = watchList?.tv || []

    movies.forEach((movie) => {
      movie.type = "movie"
    })
    tvShows.forEach((show) => {
      show.type = "show"
    })

    res.render("seenIt/watchlist.ejs", { movies, tvShows })
  } catch (error) {
    console.error(
      "An error has occurred while getting the watch list!",
      error.message
    )
  }
}

exports.watchList_add_put = async (req, res) => {
  try {
    const { movieId, tvId } = req.body
    const pushQuery = movieId ? { movie: movieId } : { tv: tvId }

    await List.findOneAndUpdate(
      { user: req.session.user._id, isWatchList: true },
      { $push: pushQuery },
      { upsert: true }
    )

    res.redirect("/watchlist")
  } catch (error) {
    console.error(
      "An error has occurred while updating the watch list!",
      error.message
    )
  }
}

exports.watchList_deleteItem_delete = async (req, res) => {
  try {
    const { movieId, tvId } = req.body
    const pullQuery = movieId ? { movie: movieId } : { tv: tvId }

    await List.findOneAndUpdate(
      { user: req.session.user._id, isWatchList: true },
      { $pull: pullQuery }
    )

    res.redirect("/watchlist")
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

exports.favList_deleteItem_delete = async (req, res) => {
  try {
    const { movieId, tvId } = req.body
    const pullQuery = movieId ? { movie: movieId } : { tv: tvId }

    await List.findOneAndUpdate(
      { user: req.session.user._id, isFavList: true },
      { $pull: pullQuery }
    )

    res.send("Item removed from favourite list")
  } catch (error) {
    console.error(
      "An error has occurred while deleting from the favourite list!",
      error.message
    )
  }
}

exports.customList_create_post = async (req, res) => {
  try {
    await List.create({
      user: req.session.user._id,
      title: req.body.listName,
      movie: [],
      tv: [],
    })
  } catch (error) {
    console.error(
      "An error has occurred while creating your list!",
      error.message
    )
  }
}

exports.customList_add_put = async (req, res) => {
  try {
    if (req.body.isMovie) {
      await List.findByIdAndUpdate(req.params.listId, {
        $push: { movie: req.body.movieId },
      })
    } else {
      await List.findByIdAndUpdate(req.params.listId, {
        $push: { tv: req.body.tvId },
      })
    }
    res.send("List Updated")
  } catch (error) {
    console.error(
      "An error has occurred while adding to your list!",
      error.message
    )
  }
}

exports.customList_deleteItem_delete = async (req, res) => {
  try {
    if (req.body.isMovie) {
      await List.findByIdAndUpdate(req.params.listId, {
        $pull: { movie: req.params.Id },
      })
    } else {
      await List.findByIdAndUpdate(req.params.listId, {
        $pull: { tv: req.params.Id },
      })
    }
    res.send("List Updated")
  } catch (error) {
    console.error(
      "An error has occurred while deleting from your list!",
      error.message
    )
  }
}

exports.customList_delete_delete = async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.listId)
  } catch (error) {
    console.error(
      "An error has occurred while deleting your list!",
      error.message
    )
  }
}
