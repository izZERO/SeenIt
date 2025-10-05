const router = require('express').Router()
const listCtrl = require('../controllers/listController')

//API's
router.get("/watchlist", listCtrl.watchList_index_get)

module.exports = router
