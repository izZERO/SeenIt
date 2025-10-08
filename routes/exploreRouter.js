const router = require("express").Router()
const exploreCtrl = require("../controllers/exploreController")

// API's
router.get("/explore", exploreCtrl.explore_index_get)
router.get("/explore/search", exploreCtrl.explore_search_get)
router.post("/explore/search", exploreCtrl.explore_search_post)
router.get("/explore/search/:query", exploreCtrl.explore_searchResults_get)

module.exports = router
