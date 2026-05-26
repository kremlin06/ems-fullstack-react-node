'use strict';

const { User }                = require('../models');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, refreshCookieOptions } = require('../utils/generateTokens');
const { hashPassword: hashToken, comparePassword: compareToken } = require('../utils/hashPassword');

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
  id:         user.id,
  fullName:   user.fullName,
  email:      user.email,
  studentId:  user.studentId   ?? null,
  department: user.department  ?? null,
  role:       user.role,
  createdAt:  user.created_at  ?? user.createdAt,
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

// ─── Controllers ──────────────────────────────────────────────────────────────

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

module.exports = { register, login, logout, getCurrentUser, refreshAccessToken };
