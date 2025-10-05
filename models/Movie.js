const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  genres: [
    {
      type: Object,
      required: true,
      id: Number,
      name: String,
    },
  ],
  duration: {
    type: Number,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
})

const Movie = mongoose.model("Movie", movieSchema)
module.exports = Movie
