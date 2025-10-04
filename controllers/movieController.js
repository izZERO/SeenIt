const Movie = require("../models/Movie")

exports.movie_index_get = async (req, res) => {
  const url = "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  }

  const response = await fetch(url, options)
  const data = await response.json()
  const movies = data.results.map((movie) => {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      genres: movie.genre_ids,
      duration: movie.runtime,
      poster: movie.poster_path,
      language: movie.original_language,
      status: movie.status,
    }
  })
  res.send(movies)
}

exports.movie_show_get = async (req, res) => {
  try {
    const movieId = req.params.movieId
    const movieInDatabase = await Movie.exists({ id: movieId })

    // Check if movie exists in DB
    if (movieInDatabase) {
      const movie = await Movie.findOne({ id: movieId })
      return res.send(movie)
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
    Movie.create(movie)
    res.send(movie)
  } catch (error) {
    console.error(
      "An error has occurred while getting movie details!",
      error.message
    )
  }
}
