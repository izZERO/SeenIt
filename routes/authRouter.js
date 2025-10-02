const router = require('express').Router()
const authCtrl = require('../controllers/authController')

//API's
router.get('/sign-up', (req, res) => {
  res.render('./auth/sign-up.ejs')
})
router.post('/sign-up', authCtrl.registerUser)
router.post('/sign-in', authCtrl.signInUser)
router.get('/sign-in', (req, res) => {
  res.render('./auth/sign-in.ejs')
})
module.exports = router
