// Global error handler.
module.exports = (err, req, res, next) => {
  // If statusCode not defined, assume it is internal server error.
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  // Firebase error always comes with a code property. Make it a 400 bad request error.
  if (err.code) {
    err.statusCode = 400
  }

  // Log error in console.
  console.log(err)

  // Sends back the error message.
  return res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    err,
  })
}
