const router = require('express').Router()
const authCtrl = require("../controllers/authController")

//API's
router.post('/sign-up', authCtrl.registerUser)


module.exports = router
