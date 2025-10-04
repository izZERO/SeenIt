const router = require("express").Router()
const tvCtrl = require('../controllers/tvController')

// API's
router.get("/", tvCtrl.tv_index_get)
router.get("/:tvId", tvCtrl.tv_show_get)


module.exports = router
