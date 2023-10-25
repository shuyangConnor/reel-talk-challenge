const express = require('express')
const {
  setMovieId,
  createComment,
} = require('../controllers/commentControllers')
const { protect } = require('../controllers/authControllers')

// Allow merged parameters for nested routes.
const router = express.Router({ mergeParams: true })

// Create a new comment.
router.route('/').post(protect, setMovieId, createComment)

module.exports = router
