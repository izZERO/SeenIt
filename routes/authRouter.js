const router = require('express').Router()
const authCtrl = require('../controllers/authController')

//API's
router.get("/sign-up", authCtrl.auth_signup_get)
router.post('/sign-up', authCtrl.auth_signup_post)
router.get("/sign-in", authCtrl.auth_signin_get)
router.post('/sign-in', authCtrl.auth_signin_post)
router.get('/sign-out', authCtrl.auth_signout_get)
module.exports = router
