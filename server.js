const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')
const db = require('./db')
const multer = require('multer')
const upload = multer({ dest: './public/uploads/' })
const passUserToView = require('./middleware/pass-user-to-view')
const isSignedIn = require('./middleware/is-signed-in')

const PORT = process.env.PORT ? process.env.PORT : 3000

//use Middleware
const app = express()
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(passUserToView)

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

app.post('/public/uploads', upload.single('avatar'), function (req, res, next) {

} )

app.post('/public/upload', upload.array('photo', 10), function (req, res, next) {

}
)
app.post('/stats', upload.single('uploaded_file'), function (req, res) {

})

// Auth Route
const authRouter = require('./routes/authRouter.js')
app.use('/auth', authRouter)

// Movie Route
const movieRouter = require('./routes/movieRouter')
app.use('/movies', movieRouter)


// Tv Route
const tvRouter = require("./routes/tvRouter")
app.use("/tv", tvRouter)

// List Route
const listRouter = require("./routes/listRouter")
app.use("/", listRouter)

// Explore Route
const exploreRouter = require("./routes/exploreRouter")
app.use("/", exploreRouter)

// User Route
const userRouter = require("./routes/userRouter")
app.use("/", userRouter)

// Main Route
app.get('/', (req, res) => {
  res.render('index.ejs')
})




app.listen(PORT, () => {
  console.log(`Running Server on Port ${PORT} . . . `)
})
