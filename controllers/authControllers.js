const catchAsync = require('../utils/catchAsync')
const { db, auth } = require('../firebase')
const axios = require('axios')
const sendPasswordReset = require('../utils/email')

// Check if password satisfy the requirements.
// The password must be at least 8 characters in length and include both at least one uppercase and at least one lowercase letter.
const isValidPassword = (password) => {
  const hasUppercase = password !== password.toLowerCase()
  const hasLowercase = password !== password.toUpperCase()
  return hasUppercase && hasLowercase && password.length >= 8
}

const signInAndSendToken = async (user, password, statusCode, req, res) => {
  try {
    // Sign in with Firebase Rest API. A way around to sign in with Firebase Admin SDK.
    const response = await axios({
      method: 'POST',
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      data: {
        email: user.email,
        password,
        returnSecureToken: true,
      },
    })
    console.log(response.data)

    // Set up idToken as cookie.
    res.cookie('idToken', response.data.idToken, {
      expires: new Date(
        Date.now() + process.env.ID_TOKEN_EXPIRES_IN * 60 * 1000 // Expires in 60 minutes. The same as idToken from Firebase Auth by default.
      ),
      httpOnly: true, // Cookies can't be accessed by JS.
      secure: req.secure, // https Only.
    })

    // Sends back user token with the newly created user info.
    res.status(statusCode).json({
      status: 'success',
      token: response.data.idToken,
      data: {
        user,
      },
    })
  } catch (err) {
    // Sends back error if there is one.
    res.status(400).json({
      status: 'error',
      message: 'Password is wrong.',
      data: {
        err,
      },
    })
  }
}

exports.signUp = catchAsync(async (req, res, next) => {
  // Destruct information from request body.
  const { email, password, passwordConfirm, phoneNumber, userName } = req.body

  // Information provided validation
  if (!email || !password || !passwordConfirm || !phoneNumber || !userName) {
    const err = new Error('Please provide enough information to sign up!')
    err.statusCode = 400
    return next(err)
  }

  // Password requirements validation
  if (!isValidPassword(password)) {
    const err = new Error(
      'The password must be at least 8 characters in length and include both at least one uppercase and at least one lowercase letter.'
    )
    err.statusCode = 400
    return next(err)
  }

  // Password confirm validation
  if (password !== passwordConfirm) {
    const err = new Error('Password and passwordConfirm must be the same')
    err.statusCode = 400
    return next(err)
  }

  // Create user at Firebase Auth
  const user = await auth.createUser({
    email: req.body.email,
    emailVerfied: false,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    displayName: req.body.userName,
  })

  // Create user in Firestore users collection
  await db.collection('users').doc(user.uid).set({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    userName: req.body.userName,
  })

  // Login and send the token.
  signInAndSendToken(user, password, 201, req, res)
})

exports.login = catchAsync(async (req, res, next) => {
  // Destruct information from request body.
  const { email, password } = req.body

  // Information provided validation
  if (!email || !password) {
    const err = new Error('Please provide your email and password to login.')
    err.statusCode = 400
    return next(err)
  }

  // Retrieve user information.
  const user = await auth.getUserByEmail(email)

  // Login and send the token.
  signInAndSendToken(user, password, 200, req, res)
})

// Protect routes that needs user to authenticated before access.
exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  const token = req.cookies.idToken

  // If the user is not logged in, send back a 401 error.
  if (!token) {
    const err = new Error('You are not logged in! Please log in to get access')
    err.statusCode = 401
    return next(err)
  }

  // Verify token
  const user = await auth.verifyIdToken(token)

  // Store user information in request and pass it to the next middleware.
  req.user = user

  // Nothing wrong, call the next middleware.
  next()
})

// Firebase email service settings.
const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for
  // this URL must be whitelisted in the Firebase Console.
  url: 'https://www.google.com',
  // This must be true for email link sign-in.
  handleCodeInApp: true,
}

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // If request body doesn't have the email address, sends back a 400 error.
  if (!req.body.email) {
    const err = new Error(
      'Please provide your email in order to reset password.'
    )
    err.statusCode = 400
    return next(err)
  }

  // Generate password reset link.
  const link = await auth.generatePasswordResetLink(
    req.body.email,
    actionCodeSettings
  )

  await sendPasswordReset(link, req.body.email)

  // Sends back the link.
  res.status(200).json({
    status: 'success',
  })
})
