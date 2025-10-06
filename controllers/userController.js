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
      followers: user.followers,
      // favList: user.favList,
      // watchList: user.watchList,
      // customLists: user.customLists
    }
    res.render('seenIt/profile.ejs', { user: data })
  } catch (error) {
    console.error('an error has occurred finding a user', error.message)
  }
}
