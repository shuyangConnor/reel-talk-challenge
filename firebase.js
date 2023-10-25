const {
  initializeApp,
  applicationDefault,
  cert,
} = require('firebase-admin/app')
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require('firebase-admin/firestore')
const { getAuth } = require('firebase-admin/auth')

const serviceAccount = require('./serviceAccountKey.json')

initializeApp({
  credential: cert(serviceAccount),
})

// Initialize Firebase
exports.db = getFirestore()
exports.auth = getAuth()
