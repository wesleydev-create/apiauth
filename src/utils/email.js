const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // seu gmail
    pass: process.env.EMAIL_PASS  // senha de app
  }
});

async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"SmartOdonto" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

module.exports = sendEmail;