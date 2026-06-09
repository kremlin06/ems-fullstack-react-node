'use strict';

// emailService.js
// i wrote this file when i needed a way to send emails from the backend.
// before this, the forgot-password function just printed the reset link to the
// terminal. that works for me alone, but for a real demo or defense, you want
// the email to actually ARRIVE somewhere you can open.
//
// what this file does:
//   1. sets up a "transporter" — think of it as the postal truck that carries emails
//   2. builds a nice-looking html email template for the password reset link
//   3. exports a single function: sendPasswordResetEmail(to, resetLink)
//
// in development (NODE_ENV=development):
//   we use ETHEREAL — a fake email service. it catches the email and gives us
//   a preview url we can open in the browser to SEE the email.
//   no real email is delivered. perfect for testing with fake addresses.
//
// in production (NODE_ENV=production):
//   we switch to a real smtp service (sendgrid, mailgun, gmail, etc.)
//   the email actually gets delivered to the recipient's inbox.

// require() is how node.js imports a library or file.
// syntax: const myVar = require('packageName')
// nodemailer is the library we installed with: npm install nodemailer
// it handles COMPOSING and SENDING emails — like ms word + a postal truck combined
const nodemailer = require('nodemailer');

// we load our env config so we can check if we're in development or production.
// process.env.NODE_ENV is set in the .env file: NODE_ENV=development
const env = require('../config/env');

// we also import our logger so we can log useful info to the terminal.
// logger.info() = informational message (green/white in terminal)
// logger.error() = error message (red in terminal)
const logger = require('./logger');


// step 1: create the transporter
// a transporter is the "connection" to an email server.
// we configure it once here, then reuse it every time we need to send an email.
//
// in node.js, we sometimes need to do async work at module-level (when the file first loads).
// the pattern for this is an IIFE (immediately invoked function expression):
//   const thing = await (async () => { ... })();
// this runs the async function right away and gives us the result.
//
// we use 'let' here (not 'const') because in production we might reassign it
// with different config. let allows reassignment, const does not.
let transporter;

// previewUrl is the ethereal link we print to the terminal in development.
// we store it here so the sendPasswordResetEmail function can access it.
let lastPreviewUrl = null;

// this async IIFE runs immediately when the file is first require()'d by node.
// it sets up the transporter before any email is sent.
(async () => {
  if (env.NODE_ENV === 'production') {

    // production path
    // in production, we use a REAL smtp server (sendgrid, mailgun, etc.)
    // the credentials come from environment variables — never hardcode them here!
    //
    // nodemailer.createTransport() takes a config object:
    //   host    : the smtp server address (e.g. 'smtp.sendgrid.net')
    //   port    : 587 = standard smtp with STARTTLS encryption
    //   secure  : false means "use STARTTLS" (upgrades to encrypted after connect)
    //             true means "use SSL from the start" (port 465)
    //   auth    : object with user (username/api key) and pass (password/api key)
    transporter = nodemailer.createTransport({
      host:   process.env.MAIL_HOST   || 'smtp.sendgrid.net',
      port:   Number(process.env.MAIL_PORT) || 587,
      secure: false,                         // use STARTTLS — not raw SSL
      auth: {
        user: process.env.MAIL_USER,         // e.g. 'apikey' for sendgrid
        pass: process.env.MAIL_PASS,         // your sendgrid/mailgun api key
      },
    });

    logger.info('[emailService] production transporter ready');

  } else {

    // development path
    // in development we use ETHEREAL — a fake smtp service.
    // it catches emails and shows them at a preview url instead of delivering them.
    // this means even fake emails like 'jhonkenth@sti.edu' appear to "work".
    //
    // nodemailer.createTestAccount() is an async function provided by nodemailer.
    // it calls the ethereal API and gets us a temporary test account:
    //   { user, pass, smtp: { host, port, secure }, web }
    // syntax: const account = await nodemailer.createTestAccount()
    //   'await' means: pause here and wait for the promise to resolve before continuing
    //   you can only use 'await' inside an 'async' function
    const account = await nodemailer.createTestAccount();

    // now create the transporter using the ethereal smtp settings from the account.
    // we use the SAME nodemailer.createTransport() function — just different settings.
    // account.smtp.host  = 'smtp.ethereal.email'
    // account.smtp.port  = 587
    // account.smtp.secure = false
    transporter = nodemailer.createTransport({
      host:   account.smtp.host,
      port:   account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    logger.info(`[emailService] ethereal test account ready → ${account.user}`);
  }
})();


// step 2: build the html email template
// this is a plain javascript function (not async — it doesn't call any api).
// it takes two strings: recipientName and resetLink
// it returns a string of html that will be the email body.
//
// template literals in javascript use backticks ` ` (not quotes).
// inside a template literal, ${variable} inserts the value of that variable.
// this is like f-strings in python or string interpolation in other languages.
//
// syntax:
//   const myHtml = `<h1>Hello ${name}</h1>`;
const buildResetEmail = (recipientName, resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your EMS password</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Inter',Arial,sans-serif;">

  <!-- outer wrapper: centers the card horizontally -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- the main email card -->
        <!-- max-width:560px keeps it readable on any screen size -->
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- header bar with brand colour -->
          <tr>
            <td style="background:#1c2536;padding:28px 32px;text-align:center;">
              <span style="font-size:1.25rem;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
                Event Management System
              </span>
              <br/>
              <span style="font-size:0.75rem;color:#94a3b8;letter-spacing:0.06em;text-transform:uppercase;margin-top:4px;display:block;">
                STI College Balagtas
              </span>
            </td>
          </tr>

          <!-- body content -->
          <tr>
            <td style="padding:40px 32px 32px;">

              <p style="margin:0 0 8px;font-size:1.5rem;font-weight:700;color:#1c2536;letter-spacing:-0.02em;">
                Reset your password
              </p>
              <p style="margin:0 0 24px;font-size:0.9375rem;color:#64748b;line-height:1.6;">
                Hi <strong style="color:#1c2536;">${recipientName}</strong>, we received a request to reset the
                password for your EMS account. Click the button below to set a new password.
              </p>

              <!-- the big cta button -->
              <!-- we use a table inside to make the button work in all email clients -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background:#3b82f6;border-radius:8px;">
                    <a href="${resetLink}"
                       style="display:inline-block;padding:14px 32px;font-size:0.9375rem;font-weight:600;
                              color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- plain-text fallback for the link -->
              <p style="margin:0 0 8px;font-size:0.8125rem;color:#94a3b8;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px;font-size:0.8125rem;word-break:break-all;">
                <a href="${resetLink}" style="color:#3b82f6;text-decoration:underline;">${resetLink}</a>
              </p>

              <!-- warning / expiry note -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#fef3c7;border-radius:8px;border-left:4px solid #f59e0b;margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;font-size:0.8125rem;color:#92400e;line-height:1.5;">
                    <strong>This link expires in 1 hour.</strong>
                    If you didn't request a password reset, you can safely ignore this email —
                    your password will not be changed.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:0.75rem;color:#94a3b8;line-height:1.6;">
                EMS Development Team &bull; STI College Balagtas<br/>
                BSCS System Integration &amp; Software Engineering 2 Project
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;


// step 3: the main export function
// this is the function that other files (like authController.js) will import and call.
// it accepts two arguments:
//   to           — the recipient's email address (string)
//   recipientName — their full name, used to personalise the email (string)
//   resetLink    — the full url the user clicks to reset their password (string)
//
// it is an async function because sending an email involves a network call
// (connecting to the smtp server), which takes time. 'async' lets us use 'await'
// inside it to pause and wait for the network call to finish.
//
// syntax: const myFunc = async (arg1, arg2) => { ... }
//   this is an "arrow function". it's the same as:
//   async function myFunc(arg1, arg2) { ... }
//   both work — arrow functions are just shorter to write.
const sendPasswordResetEmail = async (to, recipientName, resetLink) => {

  // guard: if the transporter hasn't been set up yet (very fast restarts),
  // we don't want the server to crash. we just log a warning and return.
  // 'if (!transporter)' means: "if transporter is null / undefined / falsy"
  if (!transporter) {
    logger.warn('[emailService] transporter not ready yet — email not sent');
    return { success: false, reason: 'transporter not ready' };
  }

  // mailOptions is the object we pass to transporter.sendMail().
  // it tells nodemailer: who is it from, who to send it to, what's the subject,
  // and what html to put in the body.
  // the 'from' field has two parts: a display name and the email address.
  // format: '"Display Name" <email@address.com>'
  const mailOptions = {
    from:    '"EMS No-Reply" <noreply@ems-balagtas.edu.ph>',
    to,                                  // shorthand for 'to: to' — es6 object shorthand
    subject: 'Reset your EMS password',
    html:    buildResetEmail(recipientName, resetLink),
    // text is a plain-text fallback for email clients that don't render html
    text: `Hi ${recipientName},\n\nReset your EMS password by visiting this link:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you did not request this, ignore this email.`,
  };

  // transporter.sendMail() is the actual function that sends the email.
  // it returns a 'promise' — a placeholder for a value we'll get in the future.
  // 'await' unwraps that promise: it pauses this function until the send is done.
  // if sending fails, it 'throws' an error which we catch in the try/catch below.
  //
  // 'info' is the result object from nodemailer. it contains:
  //   info.messageId  — a unique id for the sent message
  //   info.response   — the smtp server's response string
  const info = await transporter.sendMail(mailOptions);

  // nodemailer.getTestMessageUrl() is ONLY available when using ethereal.
  // it returns a url where we can PREVIEW the email in a browser.
  // example: https://ethereal.email/message/abc123...
  // this is what we log to the terminal in development — open this url to see the email!
  //
  // in production (real smtp), getTestMessageUrl() returns undefined/false,
  // so we only log it when it exists.
  const previewUrl = nodemailer.getTestMessageUrl(info);
  lastPreviewUrl = previewUrl || null;

  if (previewUrl) {
    // this log only appears in development (ethereal)
    // \n adds a blank line before/after for readability in the terminal
    logger.info(`\n[email preview] open this url in your browser to see the email (ethereal dev only):\n    ${previewUrl}\n`);
  }

  logger.info(`[emailService] email sent → ${to} (messageId: ${info.messageId})`);

  // we return an object with useful info so the caller (authController) can
  // log it or use the previewUrl if needed.
  // { success: true } is a shorthand object literal — equivalent to { success: true }
  return { success: true, messageId: info.messageId, previewUrl };
};


// module.exports is how node.js (commonjs) exports values from a file.
// any file that does: const { sendPasswordResetEmail } = require('./utils/emailService')
// will get this function. we also export getLastPreviewUrl so authController can
// log the preview link separately if it wants to.
module.exports = {
  sendPasswordResetEmail,
  // getLastPreviewUrl() is a small helper that returns the last ethereal preview url.
  // useful for logging it in the terminal from authController after sending.
  getLastPreviewUrl: () => lastPreviewUrl,
};
