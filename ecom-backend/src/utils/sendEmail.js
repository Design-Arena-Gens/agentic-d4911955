const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration incomplete');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const from = process.env.EMAIL_FROM || 'no-reply@example.com';
  const transporter = createTransporter();

  await transporter.sendMail({
    from,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
