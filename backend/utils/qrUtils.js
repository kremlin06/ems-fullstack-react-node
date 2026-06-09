'use strict';

const crypto = require('crypto');
const env    = require('../config/env');

const PREFIX = 'EMS';

/**
 * Generate an HMAC-signed QR payload for an attendee + event pair.
 * The payload is safe to embed in a QR code and display to the attendee.
 *
 * Format: EMS:{userId}:{studentId}:{eventId}:{hmac-sha256-hex}
 */
function generatePayload(userId, studentId, eventId) {
  const data = `${PREFIX}:${userId}:${studentId}:${eventId}`;
  const hmac = crypto
    .createHmac('sha256', env.HMAC_SECRET)
    .update(data)
    .digest('hex');
  return `${data}:${hmac}`;
}

/**
 * Verify an attendee QR payload and extract its fields.
 * Throws a descriptive Error if the format is wrong or the HMAC doesn't match.
 *
 * Returns: { userId: number, studentId: string, eventId: number }
 */
function verifyPayload(attendeeCode) {
  if (typeof attendeeCode !== 'string') throw new Error('QR payload must be a string');

  const parts = attendeeCode.split(':');
  // Expected: ["EMS", userId, studentId, eventId, hmac]
  // studentId can itself contain colons (e.g. "STI:0001") — handle by treating
  // the last segment as hmac and everything between index 3 and last as studentId.
  if (parts.length < 5 || parts[0] !== PREFIX) {
    throw new Error('Invalid QR payload format');
  }

  const providedHmac = parts[parts.length - 1];
  const userId       = parseInt(parts[1], 10);
  const eventId      = parseInt(parts[parts.length - 2], 10);
  const studentId    = parts.slice(2, parts.length - 2).join(':');

  if (!Number.isFinite(userId) || !Number.isFinite(eventId)) {
    throw new Error('QR payload contains non-numeric IDs');
  }

  // Reconstruct the data string exactly as it was signed
  const data         = `${PREFIX}:${userId}:${studentId}:${eventId}`;
  const expectedHmac = crypto
    .createHmac('sha256', env.HMAC_SECRET)
    .update(data)
    .digest('hex');

  // Constant-time comparison prevents timing attacks
  const expected = Buffer.from(expectedHmac, 'hex');
  const provided = Buffer.from(providedHmac.padEnd(expectedHmac.length, '0'), 'hex');

  if (
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(expected, provided)
  ) {
    throw new Error('QR signature invalid');
  }

  return { userId, studentId, eventId };
}

module.exports = { generatePayload, verifyPayload };
