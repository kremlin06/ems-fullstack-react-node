'use strict';

const xlsx    = require('xlsx');
const Joi     = require('joi');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');

const { User, Registration, SessionAssignment, Session, sequelize } = require('../models');
const { Op }       = require('sequelize');
const { Transaction } = require('sequelize');
const logActivity  = require('./logActivity');

const DEPARTMENTS      = ['BSIT', 'BSCS', 'BSBA', 'BSTM', 'BSHM', 'BSE', 'BEED', 'Other'];
const CHUNK_SIZE       = 500;
const ERROR_THRESHOLD  = 0.05; // 5%

// row schema — all optional except fullName + email
const rowSchema = Joi.object({
  fullName:     Joi.string().trim().min(2).max(100).required()
    .messages({ 'any.required': 'Full name is required', 'string.min': 'Full name too short' }),
  email:        Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required()
    .messages({ 'any.required': 'Email is required', 'string.email': 'Invalid email address' }),
  studentId:    Joi.string().trim().uppercase().max(30).optional().allow('', null),
  department:   Joi.string().valid(...DEPARTMENTS).optional().allow('', null),
  sessionTitle: Joi.string().trim().max(255).optional().allow('', null),
});

// normalize raw column headers to canonical field names (case-insensitive, whitespace-tolerant)
function normalizeRow(raw) {
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = String(k).trim().toLowerCase().replace(/[\s_\-]+/g, '');
    const val = v === null || v === undefined ? '' : String(v).trim();
    if      (key === 'fullname' || key === 'name' || key === 'attendeename') out.fullName     = val;
    else if (key === 'email'    || key === 'emailaddress')                    out.email        = val.toLowerCase();
    else if (key === 'studentid'|| key === 'studentno' || key === 'idno')     out.studentId    = val.toUpperCase() || null;
    else if (key === 'department'|| key === 'dept' || key === 'course')       out.department   = val || null;
    else if (key === 'sessiontitle' || key === 'session')                     out.sessionTitle = val || null;
  }
  return out;
}

// parse buffer to array of plain objects (handles both xlsx and csv via xlsx library)
function parseBuffer(buffer, mimetype) {
  const isXlsx = mimetype.includes('spreadsheetml') || mimetype.includes('ms-excel');
  const opts   = isXlsx ? { type: 'buffer' } : { type: 'buffer', raw: false };
  const wb     = xlsx.read(buffer, opts);
  const ws     = wb.Sheets[wb.SheetNames[0]];
  return xlsx.utils.sheet_to_json(ws, { defval: '', raw: false });
}

/**
 * Main entry point: parse file, validate rows, batch-insert via transaction.
 *
 * @param {Buffer} buffer      - file buffer from multer
 * @param {string} mimetype    - MIME type (determines xlsx vs csv parser path)
 * @param {number} eventId     - target event for registrations
 * @param {number} actorUserId - user performing the upload (for audit log)
 * @returns {{ aborted, total, successCount, errorCount, warningRows, message? }}
 */
async function parseAndInsert(buffer, mimetype, eventId, actorUserId) {
  // 1. Parse
  let rawRows;
  try {
    rawRows = parseBuffer(buffer, mimetype);
  } catch (parseErr) {
    const err = new Error(`Could not parse file: ${parseErr.message}`);
    err.status = 422;
    throw err;
  }

  const total = rawRows.length;
  if (total === 0) {
    const err = new Error('File contains no data rows. Check that the first row is a header.');
    err.status = 422;
    throw err;
  }

  // 2. Per-row validation
  const validRows  = [];
  const errorRows  = [];

  for (let i = 0; i < total; i++) {
    const normalized = normalizeRow(rawRows[i]);
    const { error, value } = rowSchema.validate(normalized, {
      abortEarly:   true,
      stripUnknown: true,
      convert:      true,
    });

    if (error) {
      errorRows.push({
        row:       i + 2, // +2: row 1 is header, +1 for 0-index
        email:     normalized.email     || '',
        studentId: normalized.studentId || '',
        field:     error.details[0].context?.key ?? 'unknown',
        error:     error.details[0].message,
      });
    } else {
      validRows.push({ _idx: i + 2, ...value });
    }
  }

  // 3. Threshold check
  const errorRate = errorRows.length / total;
  if (errorRate > ERROR_THRESHOLD) {
    return {
      aborted:      true,
      total,
      successCount: 0,
      errorCount:   errorRows.length,
      warningRows:  errorRows,
      message: `Upload aborted: ${errorRows.length} of ${total} rows failed validation ` +
               `(${(errorRate * 100).toFixed(1)}% exceeds the 5% threshold). ` +
               `Fix the errors below and re-upload.`,
    };
  }

  // 4. Batch DB cross-reference
  const emails     = [...new Set(validRows.map(r => r.email).filter(Boolean))];
  const studentIds = [...new Set(validRows.map(r => r.studentId).filter(Boolean))];

  const existingUsers = await User.findAll({
    where: {
      [Op.or]: [
        { email: { [Op.in]: emails } },
        ...(studentIds.length ? [{ studentId: { [Op.in]: studentIds } }] : []),
      ],
    },
    attributes: ['id', 'email', 'studentId'],
  });

  const byEmail     = Object.fromEntries(existingUsers.map(u => [u.email,     u]));
  const byStudentId = Object.fromEntries(
    existingUsers.filter(u => u.studentId).map(u => [u.studentId, u])
  );

  // 5. Duplicate registration check
  const existingIds = existingUsers.map(u => u.id);
  let alreadyRegistered = new Set();
  if (existingIds.length > 0) {
    const existingRegs = await Registration.findAll({
      where: { userId: { [Op.in]: existingIds }, eventId },
      attributes: ['userId'],
    });
    alreadyRegistered = new Set(existingRegs.map(r => r.userId));
  }

  // 6. Resolve session titles to IDs
  const sessionTitles = [...new Set(validRows.map(r => r.sessionTitle).filter(Boolean))];
  const sessionMap    = {};
  if (sessionTitles.length > 0) {
    const sessions = await Session.findAll({
      where:      { eventId, title: { [Op.in]: sessionTitles } },
      attributes: ['id', 'title'],
    });
    sessions.forEach(s => { sessionMap[s.title] = s.id; });
  }

  // 7. Classify rows
  const toCreateUsers = [];  // rows where we must create a stub user
  const toInsert      = [];  // { row, existingUser|null }
  const dupErrors     = [];

  for (const row of validRows) {
    const existing = byEmail[row.email] || (row.studentId && byStudentId[row.studentId]) || null;

    if (existing && alreadyRegistered.has(existing.id)) {
      dupErrors.push({
        row:       row._idx,
        email:     row.email,
        studentId: row.studentId || '',
        field:     'email',
        error:     'Already registered for this event',
      });
      continue;
    }

    if (!existing) toCreateUsers.push(row);
    toInsert.push({ row, existingUser: existing });
  }

  // generate stub password once per batch (random bytes hashed at low cost — never usable for login)
  const stubPasswordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 4);

  // 8. Transactional insert
  const t = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ });
  let successCount = 0;

  try {
    // 8a. Bulk-create stub users in chunks
    const stubRows = toCreateUsers.map(row => ({
      fullName:     row.fullName,
      email:        row.email,
      studentId:    row.studentId || null,
      department:   row.department || null,
      passwordHash: stubPasswordHash,
      role:         'Attendee',
      isStub:       true,
    }));

    const createdUsers = [];
    for (let i = 0; i < stubRows.length; i += CHUNK_SIZE) {
      const chunk = await User.bulkCreate(stubRows.slice(i, i + CHUNK_SIZE), {
        transaction: t,
        returning:   true,
        ignoreDuplicates: false,
      });
      createdUsers.push(...chunk);
    }
    const createdByEmail = Object.fromEntries(createdUsers.map(u => [u.email, u]));

    // 8b. Build registration + assignment rows
    const regRows    = [];
    const assignRows = [];

    for (const { row, existingUser } of toInsert) {
      const user = existingUser || createdByEmail[row.email];
      if (!user) continue;

      const sessionId = row.sessionTitle ? (sessionMap[row.sessionTitle] ?? null) : null;
      regRows.push({ userId: user.id, eventId, sessionId, status: 'Confirmed' });

      if (sessionId) {
        assignRows.push({ attendeeId: user.id, sessionId });
      }
    }

    // 8c. Bulk-create registrations
    for (let i = 0; i < regRows.length; i += CHUNK_SIZE) {
      await Registration.bulkCreate(regRows.slice(i, i + CHUNK_SIZE), {
        transaction:      t,
        ignoreDuplicates: true,
        returning:        false,
      });
    }

    // 8d. Bulk-create session assignments
    for (let i = 0; i < assignRows.length; i += CHUNK_SIZE) {
      await SessionAssignment.bulkCreate(assignRows.slice(i, i + CHUNK_SIZE), {
        transaction:      t,
        ignoreDuplicates: true,
        returning:        false,
      });
    }

    await t.commit();
    successCount = regRows.length;

  } catch (txErr) {
    await t.rollback();
    throw txErr;
  }

  // 9. Audit log (non-blocking)
  const allWarnings = [...errorRows, ...dupErrors];
  await logActivity(
    actorUserId,
    'ATTENDEES_BULK_UPLOADED',
    'Attendee',
    null,
    `Bulk-uploaded ${successCount} attendees to event ${eventId}`,
    { eventId, successCount, errorCount: allWarnings.length },
  );

  return {
    aborted:      false,
    total,
    successCount,
    errorCount:   allWarnings.length,
    warningRows:  allWarnings,
  };
}

module.exports = { parseAndInsert };
