const express = require('express')
const { createLike } = require('../controllers/likeControllers')
const { protect } = require('../controllers/authControllers')

const router = express.Router()

// Create new like routes.
router.route('/:commentId').post(protect, createLike)

module.exports = router
