const catchAsync = require('../utils/catchAsync')
const { db } = require('../firebase')
const { Timestamp, FieldValue } = require('firebase-admin/firestore')
const { v4: uuidv4 } = require('uuid')

exports.setMovieId = (req, res, next) => {
  // Allow Nested Routes
  if (!req.body.movieId) {
    req.body.movieId = req.params.movieId
  }

  // If there is not sufficient information in request body, return a 400 error.
  if (!req.body.movieId || !req.body.text) {
    const err = new Error(
      'To create a comment, there must be a movieId and text.'
    )
    err.statusCode = 400
    return next(err)
  }

  // Nothing wrong, call the next middleware.
  next()
}

exports.createComment = catchAsync(async (req, res, next) => {
  // Creating ref for collection movies
  const movieRef = db.collection('movies').doc(req.body.movieId)

  // Use transaction to read and write to handle request concurrency.
  const commentId = await db.runTransaction(async (t) => {
    // Try to get the movie doc with the provided movieId.
    const movieDoc = await t.get(movieRef)

    // If there is no movie with the provided movieId, throw a 400 error.
    if (!movieDoc.exists) {
      const err = new Error("The movie with the movieId doesn't exist.")
      err.statusCode = 400
      throw err
    }

    // Genereate a random id for the comment and store it in the database.
    const uuid = uuidv4()
    t.set(movieRef.collection('comments').doc(uuid), {
      uid: req.user.uid,
      text: req.body.text,
      likes: 0,
      timestamp: FieldValue.serverTimestamp(),
      commentId: uuid,
    })
    return uuid
  })

  // Get the newly created comment doc.
  const commentDoc = await db
    .collection('movies')
    .doc(req.body.movieId)
    .collection('comments')
    .doc(commentId)
    .get()

  const comment = commentDoc.data()

  // Sends back the comment document to client.
  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  })
})
