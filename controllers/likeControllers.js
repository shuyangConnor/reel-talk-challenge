const catchAsync = require('../utils/catchAsync')
const { db } = require('../firebase')
const { FieldValue } = require('firebase-admin/firestore')
const { v4: uuidv4 } = require('uuid')

exports.createLike = catchAsync(async (req, res, next) => {
  // Get the comment doc that the user likes.
  const commentDoc = await db
    .collectionGroup('comments')
    .where('commentId', '==', req.params.commentId)
    .get()

  // If the comment with the commentId not found, sends back a 400 error.
  if (commentDoc.empty) {
    const err = new Error("The comment with the commentId doesn't exist.")
    err.statusCode = 400
    return next(err)
  }

  // The first doc in the query snapshot will be the comment user liked.
  const commentRef = commentDoc.docs[0].ref

  // Generate a random id for comment. Need this id to update to do id querying in "likes" collectionGroup.
  const uuid = uuidv4()

  // Create comment in subcollection "likes" under collection "users"
  await db.collection('users').doc(req.user.uid).collection('likes').doc().set({
    comment_ref: commentRef,
    timestamp: FieldValue.serverTimestamp(),
    likeId: uuid,
  })

  // Increment likes count in comment doc.
  await commentRef.update({
    likes: FieldValue.increment(1),
  })

  // Sends back a success respond.
  res.status(201).json({
    status: 'success',
  })
})

exports.getLikes = catchAsync(async (req, res, next) => {
  // Retrieve all the like documents.
  const likeDocs = await db
    .collection('users')
    .doc(req.user.uid)
    .collection('likes')
    .get()

  // If the user haven't liked anything, send a sucess response and indicate that.
  if (likeDocs.empty) {
    res.status(200).json({
      status: 'success',
      message: "The user haven't liked anything.",
    })
  }

  // Get data from all the documentation.
  const likeData = likeDocs.docs.map((likeDoc) => {
    return likeDoc.data()
  })

  // Retrieve the comment that associates with each use like, stores it in data and delete the comment reference.
  await Promise.all(
    likeData.map(async (el) => {
      const commentDoc = await el.comment_ref.get()
      el.comment = commentDoc.data()
      delete el.comment_ref
      return commentDoc
    })
  )

  // Sends back all the comment user liked.
  res.status(200).json({
    status: 'success',
    data: {
      likes: likeData,
    },
  })
})
