const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;

if (!emailUser || !emailPass) {
  console.error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.');
}

const transporterConfig = smtpHost ? {
  host: smtpHost,
  port: parseInt(smtpPort) || 587,
  secure: parseInt(smtpPort) === 465,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
} : {
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
};

const transporter = nodemailer.createTransport(transporterConfig);

module.exports = transporter;
