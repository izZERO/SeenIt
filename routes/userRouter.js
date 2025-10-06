const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController.js')

router.get('/profile', userController.profile_index_get)


module.exports = router
