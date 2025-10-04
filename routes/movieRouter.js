const router = require('express').Router()
const movieCtrl = require('../controllers/movieController')

// API's
router.get("/", movieCtrl.movie_index_get)
router.get("/:movieId", movieCtrl.movie_show_get)


module.exports = router
