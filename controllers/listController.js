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
    const { movieId, tvId } = req.body
    const pushQuery = movieId ? { movie: movieId } : { tv: tvId }

    await List.findOneAndUpdate(
      { user: req.session.user._id, isFavList: true },
      { $push: pushQuery },
      { upsert: true }
    )

    res.redirect("/profile")
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

    res.redirect("/watchlist")
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
    res.redirect("/profile")
  } catch (error) {
    console.error(
      "An error has occurred while creating your list!",
      error.message
    )
    res.redirect("/profile")
  }
}

exports.customList_add_put = async (req, res) => {
  try {
    const { movieId, tvId } = req.body
    const { listId } = req.params
    const pushQuery = movieId ? { movie: movieId } : { tv: tvId }

    await List.findByIdAndUpdate(listId, {
      $push: pushQuery,
    })

    // Redirect back to the movie/TV show page
    if (movieId) {
      const Movie = require("../models/Movie")
      const movie = await Movie.findById(movieId)
      res.redirect(`/movies/${movie.id}`)
    } else {
      const Tv = require("../models/Tv")
      const tvShow = await Tv.findById(tvId)
      res.redirect(`/tv/${tvShow.id}`)
    }
  } catch (error) {
    console.error(
      "An error has occurred while adding to your list!",
      error.message
    )
    res.redirect("/profile")
  }
}

exports.customList_deleteItem_delete = async (req, res) => {
  try {
    const { listId, id } = req.params
    const list = await List.findById(listId)

    if (!list) {
      return res.redirect("/profile")
    }

    // Check if item is in movies or tv array
    const isMovie = list.movie.includes(id)

    if (isMovie) {
      await List.findByIdAndUpdate(listId, {
        $pull: { movie: id },
      })
    } else {
      await List.findByIdAndUpdate(listId, {
        $pull: { tv: id },
      })
    }

    res.redirect(`/list/${listId}`)
  } catch (error) {
    console.error(
      "An error has occurred while deleting from your list!",
      error.message
    )
    res.redirect("/profile")
  }
}

exports.customList_delete_delete = async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.listId)
    res.redirect("/profile")
  } catch (error) {
    console.error(
      "An error has occurred while deleting your list!",
      error.message
    )
    res.redirect("/profile")
  }
}

exports.customList_view_get = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId)
      .populate("movie")
      .populate("tv")
      .populate("user", "username")

    if (!list) {
      return res.redirect("/profile")
    }

    // Check if user owns this list
    if (list.user._id.toString() !== req.session.user._id.toString()) {
      return res.redirect("/profile")
    }

    const movies = list.movie || []
    const tvShows = list.tv || []

    // Add type field for rendering
    movies.forEach((movie) => {
      movie.type = "movie"
    })
    tvShows.forEach((show) => {
      show.type = "tv"
    })

    res.render("seenIt/customList.ejs", {
      list,
      movies,
      tvShows,
      user: req.session.user,
    })
  } catch (error) {
    console.error(
      "An error has occurred while getting the custom list!",
      error.message
    )
    res.redirect("/profile")
  }
}
