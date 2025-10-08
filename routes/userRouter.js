const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController.js')
const upload= require("../middleware/upload")


router.get('/profile', userController.profile_index_get)

router.get('/profile/edit', userController.profile_edit_get)
router.post('/profile/edit', upload.fields([
{ name: 'profile_Picture', maxCount: 1 },
{ name: 'cover_Picture', maxCount: 1 }

]), userController.profile_edit_post
)
module.exports = router
