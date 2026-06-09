'use strict';

const logger = require('../utils/logger');

// sequelize's Op (operators) lets us do special WHERE conditions in queries.
// example: Op.gt means "greater than", Op.lt means "less than"
// we use Op.gt below to check if a timestamp is still in the future (not expired).
const { Op } = require('sequelize');

// require('../models') imports the sequelize models index file.
// User is our database model — each User instance represents one row in the users table.
// when we do User.findOne(), User.create(), etc. — we're talking to the database.
const { User } = require('../models');

const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, refreshCookieOptions, generateResetToken, hashResetToken } = require('../utils/generateTokens');
const { hashPassword: hashToken, comparePassword: compareToken } = require('../utils/hashPassword');

// i added this import when i needed to actually SEND the reset email.
// before this, forgotPassword() just printed the link to the terminal with console.log.
// now it calls sendPasswordResetEmail() which uses nodemailer + ethereal to send a real email.
// syntax: const { functionName } = require('./path/to/file')
//   the curly braces {} here are called "destructuring" — we're pulling just the function
//   we need out of the exported object, instead of importing the whole object.
const { sendPasswordResetEmail } = require('../utils/emailService');

// Helpers

/**
 * Build the safe user payload returned to the client after login/register.
 * Never include passwordHash or refreshToken — toJSON() strips them,
 * but we also explicitly select only what the frontend needs.
 *
 * @param {User} user - Sequelize User instance
 * @returns {{ id, fullName, email, studentId, department, role, createdAt }}
 */
const toPublicUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  studentId: user.studentId ?? null,
  department: user.department ?? null,
  role:user.role,
  createdAt: user.created_at ?? user.createdAt,
});

/**
 * Issue both tokens and set the refresh token cookie.
 * Extracted to avoid repetition between register and login.
 *
 * @param {import('express').Response} res
 * @param {User} user
 * @returns {{ accessToken: string }}
 */
const issueTokens = async (res, user) => {
  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Hash the refresh token before storing — if the DB is compromised,
  // raw tokens can't be used to impersonate users
  const hashedRefresh = await hashToken(refreshToken);
  await user.update({ refreshToken: hashedRefresh });

  // Set refresh token as HTTP-only cookie (inaccessible to JavaScript)
  res.cookie('refreshToken', refreshToken, refreshCookieOptions());

  return { accessToken };
};

// Controllers

/**
 * POST /api/auth/register
 *
 * Creates a new Attendee account.
 * Validation is handled upstream by the validate('register') middleware,
 * so req.body is already trimmed, lowercased, and schema-checked here.
 *
 * Responses:
 *   201 — user created, access token returned, refresh cookie set
 *   409 — email or studentId already taken
 *   500 — unexpected server error
 */
const register = async (req, res) => {
  const { fullName, email, password, studentId, department } = req.body;

  // Check for duplicate email (unique constraint would catch it too,
  // but we want a clear error message, not a raw Sequelize error)
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({
      error: { message: 'An account with this email already exists.', code: 'EMAIL_TAKEN', field: 'email' },
    });
  }

  // Check for duplicate studentId if provided
  if (studentId) {
    const existingStudent = await User.findOne({ where: { studentId } });
    if (existingStudent) {
      return res.status(409).json({
        error: { message: 'This Student ID is already registered.', code: 'STUDENT_ID_TAKEN', field: 'studentId' },
      });
    }
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    studentId:  studentId  || null,
    department: department || null,
    role: 'Attendee',  // self-registration always creates Attendee; Admin assigns roles later
  });

  const { accessToken } = await issueTokens(res, user);

  return res.status(201).json({
    accessToken,
    user: toPublicUser(user),
  });
};

/**
 * POST /api/auth/login
 *
 * Validates credentials and issues new tokens.
 * Generic error messages are intentional — "invalid credentials" rather than
 * "email not found" prevents user enumeration attacks.
 *
 * Responses:
 *   200 — access token returned, refresh cookie set
 *   401 — invalid email or password
 *   500 — unexpected server error
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user — include passwordHash (normally excluded by toJSON)
  const user = await User.findOne({ where: { email } });

  if (!user) {
    // Deliberately identical message to the wrong-password case below
    return res.status(401).json({
      error: { message: 'Invalid email or password.', code: 'INVALID_CREDENTIALS' },
    });
  }

  const passwordMatch = await comparePassword(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({
      error: { message: 'Invalid email or password.', code: 'INVALID_CREDENTIALS' },
    });
  }

  const { accessToken } = await issueTokens(res, user);

  return res.status(200).json({
    accessToken,
    user: toPublicUser(user),
  });
};

/**
 * POST /api/auth/logout
 *
 * Clears the refresh token from the DB and expires the cookie.
 * Accepts requests from unauthenticated users gracefully (idempotent).
 *
 * Why clear from DB?
 *   The refresh token cookie is HTTP-only, so JavaScript can't clear it.
 *   The server must both expire the cookie AND revoke the stored hash
 *   so the token can never be reused even if the browser ignores Set-Cookie.
 *
 * Responses:
 *   200 — always (even if user wasn't found — prevents information leakage)
 */
const logout = async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (incomingToken) {
    try {
      const decoded = verifyRefreshToken(incomingToken);
      const user    = await User.findByPk(decoded.sub);

      if (user && user.refreshToken) {
        const tokenMatches = await compareToken(incomingToken, user.refreshToken);
        if (tokenMatches) {
          await user.update({ refreshToken: null });
        }
      }
    } catch {
      // Token is expired or malformed — fine, we're logging out anyway
    }
  }

  // Expire the cookie regardless of whether we found a matching user
  res.clearCookie('refreshToken', refreshCookieOptions(true));

  return res.status(200).json({ message: 'Logged out successfully.' });
};

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's profile.
 * Protected by verifyToken middleware — req.user is guaranteed to exist.
 *
 * Why hit the DB here instead of just decoding the JWT?
 *   The JWT payload only contains { sub, role }. The frontend needs
 *   fullName, email, studentId, department for the dashboard header,
 *   profile page, etc. We fetch fresh data so role changes are reflected
 *   immediately rather than waiting for token expiry.
 *
 * Responses:
 *   200 — user object
 *   404 — user was deleted after token was issued (edge case)
 */
const getCurrentUser = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({
      error: { message: 'User account not found.', code: 'USER_NOT_FOUND' },
    });
  }

  return res.status(200).json({ user: toPublicUser(user) });
};

/**
 * POST /api/auth/refresh
 *
 * Issues a new access token using a valid refresh token cookie.
 * Called automatically by the frontend Axios interceptor when a 401 is received.
 *
 * Responses:
 *   200 — new access token
 *   401 — refresh token missing, expired, or revoked
 */
const refreshAccessToken = async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (!incomingToken) {
    return res.status(401).json({
      error: { message: 'No refresh token. Please log in again.', code: 'NO_REFRESH_TOKEN' },
    });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingToken);
  } catch {
    return res.status(401).json({
      error: { message: 'Refresh token expired. Please log in again.', code: 'REFRESH_TOKEN_EXPIRED' },
    });
  }

  const user = await User.findByPk(decoded.sub);
  if (!user || !user.refreshToken) {
    return res.status(401).json({
      error: { message: 'Session revoked. Please log in again.', code: 'SESSION_REVOKED' },
    });
  }

  // Verify the token matches what we stored (detects token theft / reuse after logout)
  const tokenMatches = await compareToken(incomingToken, user.refreshToken);
  if (!tokenMatches) {
    // Possible token reuse attack — revoke all sessions for this user
    await user.update({ refreshToken: null });
    res.clearCookie('refreshToken', refreshCookieOptions(true));
    return res.status(401).json({
      error: { message: 'Invalid session. Please log in again.', code: 'TOKEN_REUSE_DETECTED' },
    });
  }

  // Issue a new access token (rotate refresh token too for better security)
  const { accessToken } = await issueTokens(res, user);

  return res.status(200).json({ accessToken });
};

/**
 * POST /api/auth/forgot-password
 *
 * Initiates a password-reset flow.
 * Always returns 200 with a generic message — no matter whether the email
 * exists in the DB — to prevent user enumeration attacks.
 *
 * In dev: prints the reset link to the server console for easy copy/paste.
 * In prod: replace the console.log with Nodemailer + SendGrid/Mailgun.
 *
 * Responses:
 *   200 — always (generic message)
 *   500 — unexpected server error
 */
const forgotPassword = async (req, res) => {
  // req.body is the data the frontend sent in the POST request body.
  // { email } is destructuring — same as: const email = req.body.email
  const { email } = req.body;

  // we always send back the same message whether the email exists or not.
  // this is called "preventing user enumeration" — it stops hackers from
  // figuring out which emails are registered by trying thousands of them.
  // if we said "email not found" for unknown emails, they'd know which ones exist.
  const GENERIC_MESSAGE = "If an account with that email exists, you'll receive reset instructions shortly.";

  try {
    // User.findOne() searches the database for the first row matching { where: condition }.
    // it returns the user object if found, or null if not found.
    // 'await' pauses here and waits for the database query to finish.
    const user = await User.findOne({ where: { email } });

    // if no user found, we still return 200 (not 404) — same generic message.
    // never return 404 here, that would tell the attacker "this email isn't registered".
    if (!user) {
      return res.status(200).json({ message: GENERIC_MESSAGE });
    }

    // generateResetToken() creates a random 64-character hex string.
    // this is the raw token we'll put in the reset link url.
    // example: 'a3f8c2...' (64 random characters)
    // it uses crypto.randomBytes(32) under the hood — truly random, not guessable.
    const rawToken = generateResetToken();

    // we NEVER store the raw token in the database.
    // instead we store a SHA-256 hash of it — hashResetToken() does this.
    // why? because if someone hacks the database and sees the stored token,
    // they still can't use it (they'd need the original). same idea as hashing passwords.
    // the user gets the raw token in their email link. we hash it to check against the db.
    const tokenHash = hashResetToken(rawToken);

    // Date.now() returns the current time in milliseconds (a large number like 1716800000000).
    // we add 60 * 60 * 1000 milliseconds = 1 hour from now.
    // new Date(timestamp) converts that number into a proper date object.
    // this is when the reset link expires — after 1 hour it won't work.
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // user.update() saves new values to this user's row in the database.
    // we store the hashed token and the expiry time so we can verify it later.
    // 'await' waits for the database write to complete before moving on.
    await user.update({
      passwordResetToken:  tokenHash,
      passwordResetExpiry: expiry,
    });

    // build the full url the user will click to reset their password.
    // this url contains the RAW token — the user's browser sends it back to us,
    // we hash it, compare to the stored hash, and if they match — we let them reset.
    // process.env.FRONTEND_URL lets us configure this for production easily.
    // if not set, we fall back to localhost:5173 (our vite dev server).
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink   = `${frontendUrl}/reset-password/${rawToken}`;

    // sendPasswordResetEmail() is the function from utils/emailService.js that i wrote.
    // it accepts three arguments:
    //   1. to           — who to send the email to (the user's email address)
    //   2. recipientName — their name, so we can say "Hi Jhon Kenth" in the email
    //   3. resetLink    — the url they click to reset their password
    //
    // in development: this sends to ethereal (fake inbox) and logs a preview url
    // in production:  this sends a real email to the actual inbox
    //
    // we wrap it in try/catch separately so an email failure doesn't block the response.
    // the user still gets "check your inbox" even if the email service hiccups.
    // we just log the error so we (the developers) know something went wrong.
    try {
      // 'email' here is the variable we got from req.body at the top of this function.
      // it's the email address the user typed into the forgot-password form.
      await sendPasswordResetEmail(email, user.fullName, resetLink);
    } catch (emailErr) {
      // logger.error() logs the error to the terminal but does NOT crash the server.
      // we don't return an error to the user here — we still want them to see
      // the "check your inbox" screen even if the email itself failed to send.
      logger.error('[forgotPassword] email send failed:', emailErr.message);
    }

    // res.status(200).json() sends the http response back to the frontend.
    // status(200) = "OK" — the request was successful.
    // .json({ ... }) sends the data as a json object — the frontend reads this.
    return res.status(200).json({ message: GENERIC_MESSAGE });

  } catch (err) {
    // this outer catch handles unexpected errors (database down, network issue, etc.)
    // logger.error() logs the full error so we can debug it.
    logger.error('[forgotPassword] unexpected error:', err);
    return res.status(500).json({
      error: { message: 'Internal server error.', code: 'INTERNAL_ERROR' },
    });
  }
};

/**
 * POST /api/auth/reset-password
 *
 * Verifies the reset token and updates the user's password.
 * The raw token from the URL is hashed and compared against the stored hash.
 * Tokens are single-use: the fields are cleared after a successful reset.
 *
 * Body: { token: string (64-char hex), newPassword: string }
 *
 * Responses:
 *   200 — password updated
 *   400 — token invalid or expired
 *   500 — unexpected server error
 */
const resetPassword = async (req, res) => {
  const { token: rawToken, newPassword } = req.body;

  try {
    const tokenHash = hashResetToken(rawToken);

    // Find a user whose stored token hash matches AND whose token hasn't expired.
    const user = await User.findOne({
      where: {
        passwordResetToken:  tokenHash,
        passwordResetExpiry: { [Op.gt]: new Date() }, // must be in the future
      },
    });

    if (!user) {
      return res.status(400).json({
        error: {
          message: 'This password reset link is invalid or has expired. Please request a new one.',
          code:    'INVALID_RESET_TOKEN',
        },
      });
    }

    // Hash the new password and clear the one-time reset fields atomically.
    const newPasswordHash = await hashPassword(newPassword);

    await user.update({
      passwordHash:        newPasswordHash,
      passwordResetToken:  null,  // single-use: invalidate immediately after use
      passwordResetExpiry: null,
      refreshToken:        null,  // force re-login on all devices after password change
    });

    // Expire the refresh cookie just in case the user is on the same browser.
    res.clearCookie('refreshToken', refreshCookieOptions(true));

    return res.status(200).json({
      message: 'Password updated successfully. You can now log in with your new password.',
    });
  } catch (err) {
    logger.error('[resetPassword] Unexpected error:', err);
    return res.status(500).json({
      error: { message: 'Internal server error.', code: 'INTERNAL_ERROR' },
    });
  }
};

module.exports = { register, login, logout, getCurrentUser, refreshAccessToken, forgotPassword, resetPassword };

