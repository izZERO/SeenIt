const router = require('express').Router()
const authCtrl = require("../controllers/authController")

//API's
router.post('/sign-up', authCtrl.registerUser)
router.post('/sign-in', authCtrl.signInUser)

module.exports = router
