const Movie = require("../models/Movie")
const Tv = require("../models/Tv")
const User = require("../models/User")
const { movieGenreMapping, tvGenreMapping } = require("../utils")

exports.explore_index_get = async (req, res) => {
  try {
    const trendingMovieUrl =
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
    const popularMovieUrl =
      "https://api.themoviedb.org/3/movie/popular?language=en-US"
    const trendingTvUrl =
      "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
    const popularTvUrl =
      "https://api.themoviedb.org/3/tv/popular?language=en-US"
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }

    // Trending Movies
    const trendingMovieResponse = await fetch(trendingMovieUrl, options)
    const trendingMovieData = await trendingMovieResponse.json()
    const trendingMovies = trendingMovieData.results.map((movie) => {
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
    const popularMovieResponse = await fetch(popularMovieUrl, options)
    const popularMovieData = await popularMovieResponse.json()
    const popularMovies = popularMovieData.results.map((movie) => {
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

    // Trending TvShows
    const trendingTvResponse = await fetch(trendingTvUrl, options)
    const trendingTvData = await trendingTvResponse.json()
    const trendingTvShows = trendingTvData.results.map((show) => {
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
    const popularTvResponse = await fetch(popularTvUrl, options)
    const popularTvData = await popularTvResponse.json()
    const popularTvShows = popularTvData.results.map((show) => {
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

    // Map genre IDs to genre names for all data
    const trendingMoviesWithGenres = trendingMovies.map((movie) => ({
      ...movie,
      genreNames: movieGenreMapping(movie.genres),
    }))

    const popularMoviesWithGenres = popularMovies.map((movie) => ({
      ...movie,
      genreNames: movieGenreMapping(movie.genres),
    }))

    const trendingTvShowsWithGenres = trendingTvShows.map((show) => ({
      ...show,
      genreNames: tvGenreMapping(show.genres),
    }))

    const popularTvShowsWithGenres = popularTvShows.map((show) => ({
      ...show,
      genreNames: tvGenreMapping(show.genres),
    }))

    res.render("seenIt/explore/explore.ejs", {
      trendingMovies: trendingMoviesWithGenres,
      popularMovies: popularMoviesWithGenres,
      trendingTvShows: trendingTvShowsWithGenres,
      popularTvShows: popularTvShowsWithGenres,
    })
  } catch (error) {
    console.error(
      "An error has occurred while getting the explore page data!",
      error.message
    )
  }
}

exports.explore_search_get = async (req, res) => {
  try {
    res.render("seenIt/explore/search.ejs")
  } catch (error) {
    console.error(
      "An error has occurred while getting the explore search!",
      error.message
    )
  }
}

exports.explore_search_post = async (req, res) => {
  try {
    const query = req.body.query
    if (query) {
      res.redirect(`/explore/search/${query}`)
    } else {
      res.redirect("/explore/search")
    }
  } catch (error) {
    console.error("An error has occurred while handling search!", error.message)
    res.redirect("/explore/search")
  }
}

exports.explore_searchResults_get = async (req, res) => {
  try {
    const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${req.params.query}`
    const tvUrl = `https://api.themoviedb.org/3/search/tv?query=${req.params.query}`
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }
    // Movies Search
    const movieResponse = await fetch(movieUrl, options)
    const movieData = await movieResponse.json()

    // Tv Search
    const tvResponse = await fetch(tvUrl, options)
    const tvData = await tvResponse.json()

    // User Search
    const users = await User.find({
      username: { $regex: req.params.query, $options: "i" },
    })

    res.render("seenIt/explore/search.ejs", {
      query: req.params.query,
      movies: movieData.results || [],
      tvShows: tvData.results || [],
      users: users || [],
    })
  } catch (error) {
    console.error(
      "An error has occurred while getting your search!",
      error.message
    )
  }
}
