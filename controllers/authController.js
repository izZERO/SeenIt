const bcrypt = require("bcrypt")
const User = require("../models/User.js")

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })

    if (userInDatabase) {
      return res.send("Username already taken!")
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm password Must match")
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      profilePicture: "../images/Profile/pfp.svg",
      coverPicture: "../images/Profile/cover.jpg",
      following: [],
      followers: [],
    })
    res.send("Thanks for signing up!")
  } catch (error) {
    console.error("An error has occurred registering a user!", error.message)
  }
}

const signInUser = async (req, res) => {
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
    res.redirect(`/users/${user._id}!`)
  } catch (error) {
    console.error('An error has occurred signing in a user!', error.message)
  }
}

module.exports = {
  registerUser,
  signInUser
}
