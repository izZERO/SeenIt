const Tv = require("../models/Tv")

exports.tv_index_get = async (req, res) => {
  try {
    const trendingUrl =
      "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
    const popularUrl = "https://api.themoviedb.org/3/tv/popular?language=en-US"
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }

    // Trending TvShows
    const trendingResponse = await fetch(trendingUrl, options)
    const trendingData = await trendingResponse.json()
    const trendingTvShows = trendingData.results.map((show) => {
      return {
        id: show.id,
        title: show.name,
        overview: show.overview,
        releaseDate: show.first_air_date,
        genres: show.genre_ids,
        poster: show.poster_path,
        language: show.original_language,
      }
    })

    // popular TvShows
    const popularResponse = await fetch(popularUrl, options)
    const popularData = await popularResponse.json()
    const popularTvShows = popularData.results.map((show) => {
      return {
        id: show.id,
        title: show.name,
        overview: show.overview,
        releaseDate: show.first_air_date,
        genres: show.genre_ids,
        poster: show.poster_path,
        language: show.original_language,
      }
    })
    res.send({ trendingTvShows, popularTvShows })
  } catch (error) {
    console.error("An error has occurred while getting tvShows!", error.message)
  }
}

exports.tv_show_get = async (req, res) => {
  try {
    const tvId = req.params.tvId
    const tvInDatabase = await Tv.exists({ id: tvId })
    let isInWatchlist = false
    let isInFavorites = false

    // Check if tvShow exists in DB
    if (tvInDatabase) {
      const tvShow = await Tv.findOne({ id: tvId })

      // Check if TV show is in user's watchlist and favorites
      let customLists = []
      if (req.session.user) {
        const List = require("../models/List")
        const watchlistItem = await List.findOne({
          user: req.session.user._id,
          isWatchList: true,
          tv: tvShow._id,
        })

        const favoritesItem = await List.findOne({
          user: req.session.user._id,
          isFavList: true,
          tv: tvShow._id,
        })

        // Get user's custom lists
        customLists = await List.find({
          user: req.session.user._id,
          isWatchList: { $ne: true },
          isFavList: { $ne: true },
        })

        if (watchlistItem) {
          isInWatchlist = true
        } else {
          isInWatchlist = false
        }

        if (favoritesItem) {
          isInFavorites = true
        } else {
          isInFavorites = false
        }
      }

      return res.render("seenIt/show/tvShow.ejs", {
        tvShow,
        isInWatchlist,
        isInFavorites,
        customLists,
      })
    }

    const url = `https://api.themoviedb.org/3/tv/${tvId}?language=en-US`
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    const tvShow = {
      id: data.id,
      title: data.name,
      overview: data.overview,
      releaseDate: data.first_air_date,
      genres: data.genres,
      duration: data.episode_run_time,
      poster: data.poster_path,
      language: data.original_language,
      status: data.status,
      seasons: data.seasons,
      numberOfSeasons: data.number_of_seasons,
      numberOfEpisodes: data.number_of_episodes,
    }

    // Add tvShow to DB
    const savedTvShow = await Tv.create(tvShow)

    // Check if TV show is in user's watchlist and favorites
    let customLists = []
    if (req.session.user) {
      const List = require("../models/List")
      const watchlistItem = await List.findOne({
        user: req.session.user._id,
        isWatchList: true,
        tv: savedTvShow._id,
      })

      const favoritesItem = await List.findOne({
        user: req.session.user._id,
        isFavList: true,
        tv: savedTvShow._id,
      })

      // Get user's custom lists
      customLists = await List.find({
        user: req.session.user._id,
        isWatchList: { $ne: true },
        isFavList: { $ne: true },
      })

      if (watchlistItem) {
        isInWatchlist = true
      } else {
        isInWatchlist = false
      }

      if (favoritesItem) {
        isInFavorites = true
      } else {
        isInFavorites = false
      }
    }

    return res.render("seenIt/show/tvShow.ejs", {
      tvShow: savedTvShow,
      isInWatchlist,
      isInFavorites,
      customLists,
    })
  } catch (error) {
    console.error(
      "An error has occurred while getting tvShow details!",
      error.message
    )
  }
}
