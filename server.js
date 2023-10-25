const dotenv = require('dotenv')

// Handle 'uncaughtException' error and exit gracefully.
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...')
  console.log(err)
  process.exit(1)
})

// Set up configuration file.
dotenv.config({ path: './config.env' })

// Import Express app after the 'uncaughtException' error listener.
const app = require('./app')

// Start the server on port 3000.
const server = app.listen(3000, () => {
  console.log(`App running on port 3000...`)
})

// Handle 'unhandledRejection' error and exit gracefully.
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down.')
  console.log(err)
  server.close(() => {
    process.exit(1)
  })
})
