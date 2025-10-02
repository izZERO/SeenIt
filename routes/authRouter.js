const router = require('express').Router()
const authCtrl = require("../controllers/authController")

//API's
router.get('/sign-up', (req, res) => {
  res.render('./auth/sign-up.ejs')
})
router.post('/sign-up', authCtrl.registerUser)
router.post('/sign-in', authCtrl.signInUser)

module.exports = router
