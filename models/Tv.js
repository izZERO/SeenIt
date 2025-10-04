const mongoose = require("mongoose")

const tvSchema = new mongoose.Schema({
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
    },
  ],
  duration: {
    type: Array,
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
  seasons: [
    {
      type: Object,
      required: true,
    },
  ],
  numberOfSeasons: {
    type: Number,
    required: true,
  },
  numberOfEpisodes: {
    type: Number,
    required: true,
  },
})

const Tv = mongoose.model("Tv", tvSchema)
module.exports = Tv
