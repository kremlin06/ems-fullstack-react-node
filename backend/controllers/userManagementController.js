'use strict';

// this controller handles the two user management endpoints:
//   GET  /api/admin/users   list all users in the system (paginated, searchable)
//   POST /api/admin/users   create a new Admin, Organizer, or Staff account
//
// both routes are protected by verifyToken + requireRole('Admin') so only an
// authenticated Admin can reach these functions. the middleware runs before this
// code even starts, so by the time we get here we know req.user is a real Admin.

const logger = require('../utils/logger');

// the User model talks to the users table in postgresql via sequelize.
// Op is sequelize's operator object, used for complex where conditions like Op.or
const { User } = require('../models');
const { Op }   = require('sequelize');

// hashPassword is our bcrypt wrapper. we never store a plain-text password.
// bcrypt turns "MyPassword123" into a long hash like "$2b$12$..."
// the 12 rounds in our config means it takes ~250ms to hash, which slows
// brute-force attacks significantly.
const { hashPassword } = require('../utils/hashPassword');


// get /api/admin/users
// returns a paginated, searchable list of every user in the system.
// the admin can filter by role (Admin / Organizer / Staff / Attendee) and
// search by name or email using the q query param.
exports.listUsers = async (req, res) => {
  try {
    // parseInt with radix 10 converts the string "1" from query params to the number 1.
    // we clamp pageSize to a max of 100 so a client cannot request 10000 rows at once.
    const page     = Math.max(1, parseInt(req.query.page,     10) || 1);
    const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 20);
    const { q, role } = req.query;

    // we start with an empty where object and add conditions as needed.
    // this is cleaner than building a big if-else chain.
    const where = {};

    // if a role filter was passed, add it to the where clause
    if (role) where.role = role;

    // if a search term was passed, search across full name and email.
    // Op.iLike is case-insensitive LIKE — %q% matches anywhere in the string.
    // we only add the Or condition when q exists, otherwise the where stays clean.
    if (q) {
      where[Op.or] = [
        { fullName: { [Op.iLike]: `%${q}%` } },
        { email:    { [Op.iLike]: `%${q}%` } },
      ];
    }

    // findAndCountAll returns both the rows and the total count in one query.
    // we need the count to tell the frontend how many pages there are.
    // attributes lists exactly which columns to select — we never return passwordHash.
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['id', 'fullName', 'email', 'role', 'createdAt', 'isStub'],
      order:  [['createdAt', 'DESC']],
      limit:  pageSize,
      offset: (page - 1) * pageSize,
    });

    return res.json({
      total:    count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      users: rows.map(u => ({
        id:        u.id,
        fullName:  u.fullName,
        email:     u.email,
        role:      u.role,
        createdAt: u.createdAt,
        isStub:    u.isStub,
      })),
    });

  } catch (err) {
    logger.error('[userManagementController.listUsers]', err);
    return res.status(500).json({
      error: { message: 'Failed to fetch users.', code: 'INTERNAL_ERROR' },
    });
  }
};


// post /api/admin/users
// creates a new Admin, Organizer, or Staff account.
// the body has been validated by the createUser Joi schema before this runs,
// so fullName, email, password, and role are guaranteed to be present and clean.
exports.createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    // check for a duplicate email before trying to insert.
    // we could rely on the unique constraint in the database to catch this,
    // but that would throw a SequelizeUniqueConstraintError which is less clear.
    // checking first lets us return a friendlier message.
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        error: {
          message: 'An account with this email already exists.',
          code:    'EMAIL_TAKEN',
          field:   'email',
        },
      });
    }

    // never store plain-text passwords. hashPassword runs bcrypt with the
    // BCRYPT_ROUNDS value from .env (currently 12). this is a one-way hash.
    const passwordHash = await hashPassword(password);

    // create the new user row in the database.
    // isStub: false means this is a full account, not a placeholder stub
    // created by the bulk-upload or manual entry flows.
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role,
      isStub: false,
    });

    logger.info(`[userManagementController.createUser] created ${role} account for ${email} by Admin ${req.user.id}`);

    // return only the safe fields, never the hash
    return res.status(201).json({
      id:        user.id,
      fullName:  user.fullName,
      email:     user.email,
      role:      user.role,
      createdAt: user.createdAt,
    });

  } catch (err) {
    logger.error('[userManagementController.createUser]', err);

    // sequelize unique constraint — belt-and-suspenders in case the findOne above
    // had a race condition with another request creating the same email
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: { message: 'An account with this email already exists.', code: 'EMAIL_TAKEN', field: 'email' },
      });
    }

    return res.status(500).json({
      error: { message: 'Failed to create user.', code: 'INTERNAL_ERROR' },
    });
  }
};
