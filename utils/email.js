const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'QQ',
  auth: {
    user: process.env.QQ_USERNAME,
    pass: process.env.QQ_PASSWORD,
  },
})

const sendPasswordReset = async (link, email) => {
  await transporter.sendMail({
    from: `${process.env.QQ_USERNAME}`,
    to: `${email}`,
    subject: 'Password Reset Request',
    html: `<b>Hello, this is your password reset link ${link}</b>`,
  })
}

module.exports = sendPasswordReset
