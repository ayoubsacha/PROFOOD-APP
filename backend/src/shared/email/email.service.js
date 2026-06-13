const nodemailer = require('nodemailer');
const env = require('../../config/env');

function isEmailConfigured() {
  return Boolean(env.email.host && env.email.user && env.email.pass);
}

async function sendMail({ to, subject, text, html }) {
  if (!isEmailConfigured()) {
    console.log('Email fallback:', { to, subject, text });
    return { logged: true };
  }

  const transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.port === 465,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });

  return transporter.sendMail({
    from: `"Profood Admin" <${env.email.user}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = {
  sendMail,
};
