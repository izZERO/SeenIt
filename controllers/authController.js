const bcrypt = require('bcrypt')
const User = require('../models/User.js')
const List = require("../models/List")

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
      followers: [],
    })

    const user = await User.findOne({email: req.body.email})
    const userId = user._id
    // create watchList
    await List.create({
      user: userId,
      title: "WatchList",
      movie: [],
      tv: [],
      isWatchList: true
    })
      // create favList
      await List.create({
      user: userId,
      title: "FavList",
      movie: [],
      tv: [],
      isFavList: true
    })

    await User.findByIdAndUpdate(userId,{
      watchList:  await List.findOne({user: userId, isWatchList: true}),
      favList:  await List.findOne({user: userId, isFavList: true})
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
    const userInDatabase = await User.findOne({ email: req.body.email })
    if (!userInDatabase) {
      return res.send('no user has been found')
    }
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )
    if (!validPassword) {
      return res.send('wrong password! please try again.')
    }
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }
    res.redirect(`/explore`)
  } catch (error) {
    console.error('An error has occurred signing in a user!', error.message)
  }
}

exports.auth_signout_get = async (req, res) => {
  try {
req.session.destroy()
res.redirect('/explore')
  } catch (error) {
    console.error('an error has occurred signing out  user!', error.message)
  }
}


exports.auth_updatePassword_put = async (req, res) => {
  try {
const user = await User.findById(req.params.id)
if (!user) {
  return res.send('no user with that id')
}
  const validPassword = bcrypt.compareSync(
    req.body.oldPassword,
    user.password

  )
  if (!validPassword) {
    return res.send('your password was not correct, try again')
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.send('password and confirm password must match')
  }
  const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10)
  user.password = hashedPassword
  await user.save()
  res.render('./auth/confirm.ejs', {user})
  } catch (error) {
  console.error(
      "An error has occurred updating a user's password!",
      error.message
    )
  }
}

