const router = require('express').Router()
const listCtrl = require('../controllers/listController')

//API's
router.get("/watchlist", listCtrl.watchList_index_get)
router.put("/watchlist", listCtrl.watchList_add_put)

module.exports = router
