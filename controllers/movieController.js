const Movie = require("../models/Movie")

exports.movie_index_get = async (req, res) => {
  try {
    const trendingUrl =
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
    const popularUrl =
      "https://api.themoviedb.org/3/movie/popular?language=en-US"
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }

    // Trending Movies
    const trendingResponse = await fetch(trendingUrl, options)
    const trendingData = await trendingResponse.json()
    const trendingMovies = trendingData.results.map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        genres: movie.genre_ids,
        poster: movie.poster_path,
        language: movie.original_language,
      }
    })

    // Popular Movies
    const popularResponse = await fetch(popularUrl, options)
    const popularData = await popularResponse.json()
    const popularMovies = popularData.results.map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        genres: movie.genre_ids,
        poster: movie.poster_path,
        language: movie.original_language,
      }
    })
    res.send({ trendingMovies, popularMovies })
  } catch (error) {
    console.error("An error has occurred while getting movies!", error.message)
  }
}

exports.movie_show_get = async (req, res) => {
  try {
    const movieId = req.params.movieId
    const movieInDatabase = await Movie.exists({ id: movieId })

    // Check if movie exists in DB
    if (movieInDatabase) {
      const movie = await Movie.findOne({ id: movieId })

      // Check if movie is in user's watchlist
      let isInWatchlist = false
      if (req.session.user) {
        const List = require("../models/List")
        const watchlistItem = await List.findOne({
          user: req.session.user._id,
          isWatchList: true,
          movie: movie._id,
        })

        if (watchlistItem) {
          isInWatchlist = true
        } else {
          isInWatchlist = false
        }
      }

      return res.render("seenIt/show/movieShow.ejs", { movie, isInWatchlist })
    }

    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    const movie = {
      id: data.id,
      title: data.title,
      overview: data.overview,
      releaseDate: data.release_date,
      genres: data.genres,
      duration: data.runtime,
      poster: data.poster_path,
      language: data.original_language,
      status: data.status,
    }

    // Add movie to DB
    const savedMovie = await Movie.create(movie)

    // Check if movie is in user's watchlist
    let isInWatchlist = false
    if (req.session.user) {
      const List = require("../models/List")
      const watchlistItem = await List.findOne({
        user: req.session.user._id,
        isWatchList: true,
        movie: savedMovie._id,
      })

      if (watchlistItem) {
        isInWatchlist = true
      } else {
        isInWatchlist = false
      }
    }

    return res.render("seenIt/show/movieShow.ejs", {
      movie: savedMovie,
      isInWatchlist,
    })
  } catch (error) {
    console.error(
      "An error has occurred while getting movie details!",
      error.message
    )
  }
}
