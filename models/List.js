const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  movie: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie"
  }],
  tv: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tv"
  }]


})

const List = mongoose.model("List", listSchema)
module.exports = List
