const express = require('express')
const { createLike, getLikes } = require('../controllers/likeControllers')
const { protect } = require('../controllers/authControllers')

const router = express.Router()

// Get like routes.
router.route('/').get(protect, getLikes)

// Create new like routes.
router.route('/:commentId').post(protect, createLike)

module.exports = router
