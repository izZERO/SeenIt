const Tv = require("../models/Tv")

exports.tv_index_get = async (req, res) => {
  try {
    const url =
      "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    const tvShows = data.results.map((show) => {
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
    res.send(tvShows)
  } catch (error) {
    console.error("An error has occurred while getting tvShows!", error.message)
  }
}

exports.tv_show_get = async (req,res) => {
  try {
    const tvId = req.params.tvId
    const tvInDatabase = await Tv.exists({ id: tvId })

    // Check if tvShow exists in DB
    if (tvInDatabase) {
      const tvShow = await Tv.findOne({ id: tvId })
      return res.send(tvShow)
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

    //Add tvShow to DB
    Tv.create(tvShow)
    res.send(tvShow)
  } catch (error) {
    console.error(
      "An error has occurred while getting tvShow details!",
      error.message
    )
  }
}
