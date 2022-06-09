const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const smtpOptions = {
  host: String(process.env.MAIL_HOST),
  port: String(process.env.MAIL_PORT),
  auth: {
    user: String(process.env.MAIL_USER),
    pass: String(process.env.MAIL_PASS),
  },
};

async function sendEmail({
  to,
  subject,
  html,
  from = String(process.env.MAIL_EMAIL),
}) {
  const transporter = nodemailer.createTransport(smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}

async function sendVerificationEmail(user, origin) {
  let message;
  message = `<p>Veuillez utiliser le jeton ci-dessous pour vérifier votre adresse e-mail
    <p><code>${user.verificationToken}</code></p>`;

  await sendEmail({
    to: user.email,
    subject: "Vérification de l'inscription ",
    html: `<p>Merci de vous être enregistré!</p> ${message}`,
  });
}

async function sendAlreadyRegisteredEmail(email, origin) {
  let message;
  if (origin) {
    message = `<p>Si vous ne connaissez pas votre mot de passe, visitez le <a href="${origin}/app/account/forgot-password">La page mot de passe oublié</a> page.</p>`;
  } else {
    message = `<p>Si vous ne connaissez pas votre mot de passe, vous pouvez le réinitialiser via le <code>/account/forgot-password</code> route api.</p>`;
  }

  await sendEmail({
    to: email,
    subject: "API de vérification d'inscription - Courriel déjà enregistré",
    html: `<h4>Email déjà enregistré</h4>
               <p>Votre email <strong>${email}</strong> est déjà enregistré.</p>
               ${message}`,
  });
}

async function sendPasswordResetEmail(user, origin) {
  let message;
  const resetUrl = `${origin}/me/changepass?token=${user.resetToken.token}`;
  message = `<p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe, le lien sera valable 1 jour:</p>
                 <p><a href="${resetUrl}">réinitialiser</a></p>`;
  await sendEmail({
    to: user.email,
    subject: "Réinitialiser le mot de passe",
    html: `<h4>Réinitialiser le mot de passe</h4> ${message}`,
  });
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendAlreadyRegisteredEmail,
  sendPasswordResetEmail,
};
