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
