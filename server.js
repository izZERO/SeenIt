const express = require("express")
require("dotenv").config()
const morgan = require("morgan")
const methodOverride = require("method-override")
const session = require("express-session")
const db = require("./db")
const multer = require("multer")
const upload = multer({ dest: "./public/uploads/" })
const passUserToView = require("./middleware/pass-user-to-view")
const isSignedIn = require("./middleware/is-signed-in")

const PORT = process.env.PORT ? process.env.PORT : 3000

//use Middleware
const app = express()
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(methodOverride("_method"))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passUserToView)

app.use(async (req, res, next) => {
  if (req.session.user) {
    try {
      const User = require("./models/User")
      const fullUser = await User.findById(req.session.user._id)
      res.locals.user = fullUser
    } catch (error) {
      console.error("Error fetching user data:", error)
      res.locals.user = req.session.user
    }
  } else {
    res.locals.user = null
  }
  next()
})

// Auth Route
const authRouter = require("./routes/authRouter.js")
app.use("/auth", authRouter)

// Explore Route
const exploreRouter = require("./routes/exploreRouter")
app.use("/", exploreRouter)

// Movie Route 
const movieRouter = require("./routes/movieRouter")
app.use("/movies", movieRouter)

// Tv Route
const tvRouter = require("./routes/tvRouter")
app.use("/tv", tvRouter)

app.use(isSignedIn)

// List Route
const listRouter = require("./routes/ListRouter")
app.use("/", listRouter)

// User Route
const userRouter = require("./routes/userRouter")
app.use("/", userRouter)

// Main Route
app.get("/", (req, res) => {
  res.redirect("/explore")
})

app.listen(PORT, () => {
  console.log(`Running Server on Port ${PORT} . . . `)
})
