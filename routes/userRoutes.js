const express = require('express')
const {
  login,
  signUp,
  forgetPassword,
} = require('../controllers/authControllers')

const router = express.Router()

router.route('/login').post(login)
router.route('/signup').post(signUp)
router.route('/forgetPassword').post(forgetPassword)

module.exports = router
