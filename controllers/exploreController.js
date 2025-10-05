const Movie = require("../models/Movie")
const Tv = require("../models/Tv")

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
    res.send({ trendingMovies, popularMovies, trendingTvShows, popularTvShows })
  } catch (error) {
    console.error("An error has occurred while getting the explore page data!", error.message)
  }
}

