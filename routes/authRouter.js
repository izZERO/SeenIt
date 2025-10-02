const router = require('express').Router()
const authCtrl = require('../controllers/authController')

//API's
router.post('/sign-up', authCtrl.registerUser)
router.post('/sign-in', authCtrl.signInUser)
router.get('/sign-in', (req, res) => {
  res.render('./auth/sign-in.ejs')
})
router.get('/sign-out', authCtrl.signOutUser)
module.exports = router
