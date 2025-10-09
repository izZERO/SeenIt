const router = require("express").Router()
const listCtrl = require("../controllers/listController")

//API's
router.get("/watchlist", listCtrl.watchList_index_get)
router.put("/watchlist", listCtrl.watchList_add_put)
router.delete("/watchlist", listCtrl.watchList_deleteItem_delete)
router.get("/favouritelist", listCtrl.favList_index_get)
router.put("/favouritelist", listCtrl.favList_add_put)
router.delete("/favouritelist", listCtrl.favList_deleteItem_delete)
router.post("/list", listCtrl.customList_create_post)
router.get("/list/:listId", listCtrl.customList_view_get)
router.put("/list/:listId", listCtrl.customList_add_put)
router.delete("/list/:listId/:id", listCtrl.customList_deleteItem_delete)
router.delete("/list/:listId", listCtrl.customList_delete_delete)

module.exports = router
