const router = require('express').Router()
const exploreCtrl = require('../controllers/exploreController')

// API's
router.get("/explore", exploreCtrl.explore_index_get)



module.exports = router
