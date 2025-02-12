const nodemailer = require('nodemailer');

// For production, use environment variables or Firebase Function config for credentials.
// Example: functions.config().email.user, functions.config().email.pass


const emailUser = process.env.EMAIL_USER || 'your-email@gmail.com';
const emailPass = process.env.EMAIL_PASS || 'your-password-or-app-password';

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVER, // or "SMTP", or a custom service if you have your own SMTP server
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Export the transporter to be used in other files
module.exports = transporter;
