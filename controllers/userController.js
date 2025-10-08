const User = require('../models/User')
const List = require('../models/List')

exports.profile_index_get = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
    // const list = await List.find({ author: user._id})
    const data = {
      username: user.username,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      following: user.following,
      followers: user.followers
      // favList: user.favList,
      // watchList: user.watchList,
      // customLists: user.customLists
    }
    res.render('seenIt/profile/profile.ejs', { user: data })
  } catch (error) {
    console.error('an error has occurred finding a user', error.message)
  }
}

exports.profile_edit_get = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/sign-in')
    }
    const userId = req.session.user._id
    const user = await User.findById(userId)
    if (!user) {
      return res.redirect('/auth/sign-in')
    }
    res.render('seenIt/profile/edit.ejs', { user })
  } catch (error) {
    console.error('error with edit profile page', error)
    res.redirect('/profile')
  }
}

exports.profile_edit_post = async (req, res) => {
  console.log(req.body);

  try {
    if (!req.session.user) {
      return res.redirect('/auth/sign-in')
    }
    const userId = req.session.user._id
    const { username } = req.body

    const profilePicture = req.files?.profile_Picture?.[0]?.filename
    const coverPicture = req.files?.cover_Picture?.[0]?.filename
    const updateFields = {username}
    if (profilePicture) updateFields.profilePicture = profilePicture
    if (coverPicture) updateFields.coverPicture = coverPicture
    await User.findByIdAndUpdate(userId, updateFields, {new: true})
    res.redirect('/profile')
  } catch (error) {
    console.error('error updating profile')
    res.redirect('/profile/edit')
  }
}

