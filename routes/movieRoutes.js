const express = require('express')
const { getMovies } = require('../controllers/movieControllers')
const commentRouter = require('./commentRoutes')

const router = express.Router()

// Nested routes for creating a comment on a movie.
router.use('/:movieId/comments', commentRouter)

// Get 100 movies routes.
router.route('/').get(getMovies)

module.exports = router
