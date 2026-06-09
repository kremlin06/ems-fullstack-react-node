'use strict';

const bcrypt = require('bcryptjs');
const env = require('../config/env');

/**
 * Hash a plaintext password using bcrypt.
 *
 * Cost factor is read from env.BCRYPT_ROUNDS (default 12).
 * At 12 rounds: ~250ms on modern hardware — slow enough to make brute-force
 * impractical, fast enough that login feels instant to a human.
 *
 * @param {string} plaintext - The raw password from the registration form.
 * @returns {Promise<string>} The bcrypt hash to store in the database.
 * @throws {Error} If plaintext is empty or not a string.
 */
const hashPassword = async (plaintext) => {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('hashPassword: plaintext must be a non-empty string');
  }
  const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS);
  return bcrypt.hash(plaintext, salt);
};

/**
 * Compare a plaintext password against a stored bcrypt hash.
 *
 * Always runs to completion (constant-time) — safe against timing attacks.
 * Do NOT add early returns or short-circuits to this function.
 *
 * @param {string} plaintext  - Password the user just submitted.
 * @param {string} storedHash - The password_hash value from the database row.
 * @returns {Promise<boolean>} true if password matches, false otherwise.
 */
const comparePassword = async (plaintext, storedHash) => {
  if (!plaintext || !storedHash) return false;
  return bcrypt.compare(plaintext, storedHash);
};

module.exports = { hashPassword, comparePassword };
