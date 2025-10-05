const bcrypt = require('bcrypt')
const User = require('../models/User.js')

exports.auth_signup_get = async (req, res) => {
  res.render('auth/sign-up.ejs')
}

exports.auth_signup_post = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })

    if (userInDatabase) {
      return res.send('Username already taken!')
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm password Must match')
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      profilePicture: '../images/Profile/pfp.svg',
      coverPicture: '../images/Profile/cover.jpg',
      following: [],
      followers: []
    })
    res.send('Thanks for signing up!')
  } catch (error) {
    console.error('An error has occurred registering a user!', error.message)
  }
}

exports.auth_signin_get = async (req, res) => {
  res.render('auth/sign-in.ejs')
}

exports.auth_signin_post = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.send('no user has been found')
    }
    const validPassword = bcrypt.compareSync(req.body.password, user.password)
    if (!validPassword) {
      return res.send('wrong password! please try again.')
    }
    req.session.user = {
      email: user.email,
      _id: user._id
    }
    res.redirect(`/users/${user._id}`)
  } catch (error) {
    console.error('An error has occurred signing in a user!', error.message)
  }
}

exports.auth_signout_get = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    console.error('an error has occurred signing out  user!', error.message)
  }
}

exports.auth_updatePassword_get = async (req, res) => {
  res.render('auth/updatePassword')
}

exports.auth_updatePassword_put = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.send('No user with that ID')
    }
    const validPassword = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    )
    if (!validPassword) {
      return res.send('Your old password was not correct')
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.send('Password and confirm password must match')
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10)
    user.password = hashedPassword
    await user.save()
    res.send(`Your password has been updated, ${user.username}!`)
  } catch (error) {
    console.error(
      'An error has occurred updating a user password',
      error.message
    )
  }
}
