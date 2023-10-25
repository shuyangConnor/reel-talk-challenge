const express = require('express')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/userRoutes')
const movieRouter = require('./routes/movieRoutes')
const commentRouter = require('./routes/commentRoutes')
const likeRouter = require('./routes/likeRoutes')
const errorHandler = require('./controllers/errorControllers')

// Initialize Express.
const app = express()

// Parse request body and cookies.
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Set up routers.
app.use('/api/v1/users', userRouter)
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/likes', likeRouter)

// If the request url doesn't hit a router, return a 404 error.
app.all('*', (req, res, next) => {
  error = new Error(`Can't find ${req.originalUrl} on this server.`)
  error.statusCode = '404'
  next(error)
})

// Set up global error handler.
app.use(errorHandler)

module.exports = app
