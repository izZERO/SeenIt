const express = require("express")
require('dotenv').config()
const morgan = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')
const db = require('./db')


const PORT = process.env.PORT ? process.env.PORT : 3000


//use Middleware
const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

// Auth Route
const authRouter = require('./routes/authRouter.js')
app.use('/auth', authRouter)

// Movie Route
const movieRouter = require("./routes/movieRouter")
app.use("/movies", movieRouter)

const tvRouter = require("./routes/tvRouter")
app.use("/tvshows", tvRouter)

// Main Route
app.get('/', (req, res) => {
  res.render('index.ejs')
})




app.listen(PORT, () => {
  console.log(`Running Server on Port ${PORT} . . . `)
})
