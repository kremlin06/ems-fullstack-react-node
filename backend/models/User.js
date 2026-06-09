'use strict';

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * User model — base authentication and identity record for all roles.
 *
 * Every person in the system (Admin, Organizer, Staff, Attendee) has a User row.
 * Role-specific data (student ID, department, office, etc.) lives here for Phase 1.
 * In Phase 2 we can extract Attendee/Staff into separate tables linked by userId.
 *
 * Columns
 * id              Auto-increment PK. Simple integer; no enumeration risk since
 *                 auth uses JWTs (not guessable ID-in-URL patterns).
 *
 * fullName        Display name shown in the UI. Free-form string; server trims
 *                 whitespace before saving.
 *
 * email           Unique campus email used as the login identifier.
 *                 Stored lowercase. Frontend also allows username login (see
 *                 authController.js — it searches both fields).
 *
 * studentId       Optional — Admins and Staff may not have one.
 *                 Unique constraint prevents the duplicate-enrollment problem
 *                 described in US-03. Stored uppercase (STI-BAL-2024-00123).
 *
 * department      Academic department for attendee categorisation and analytics.
 *                 Optional for non-student roles.
 *
 * passwordHash    Bcrypt hash (cost 12). NEVER store or log plaintext passwords.
 *                 Column is excluded from all toJSON() output (see below).
 *
 * role            ENUM enforced at DB level. Defaults to 'Attendee' for
 *                 self-registration. Admin assignment happens via seed or a
 *                 protected admin endpoint (Phase 2).
 *
 * refreshToken    Hashed refresh token stored here for Phase 1 simplicity.
 *                 Phase 2 can move this to a RefreshTokens table for multi-device
 *                 support. NULL means the user is logged out.
 *                 Also excluded from toJSON().
 *
 * createdAt /
 * updatedAt       Managed by Sequelize automatically.
 */
class User extends Model {
  /**
   * Placeholder for Sequelize associations.
   * Called by models/index.js after all models are loaded.
   * Uncomment and expand when Phase 2 adds Attendee / Session / etc.
   *
   * @param {Object} db - All registered models
   */
  static associate(db) {
    User.hasMany(db.Registration, { foreignKey: 'userId', as: 'registrations' });
    User.hasMany(db.SessionAssignment, { foreignKey: 'attendeeId', as: 'sessionAssignments' });
    // User.hasMany(db.Attendance, { foreignKey: 'userId' }); // Phase 3
  }
}

User.init(
  {
    // Primary Key 
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Identity 
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'full_name',  // snake_case in DB, camelCase in JS
      validate: {
        notEmpty: { msg: 'Full name cannot be blank' },
        len: { args: [2, 100], msg: 'Full name must be between 2 and 100 characters' },
      },
      set(value) {
        // Trim leading/trailing whitespace before saving
        this.setDataValue('fullName', value?.trim());
      },
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { name: 'users_email_unique', msg: 'This email is already registered' },
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
        notEmpty: { msg: 'Email cannot be blank' },
      },
      set(value) {
        // Always store lowercase — prevents "Admin@sti.edu" vs "admin@sti.edu" dupes
        this.setDataValue('email', value?.trim().toLowerCase());
      },
    },

    // Campus-specific fields 
    studentId: {
      type: DataTypes.STRING(30),
      allowNull: true,  // Admins / Staff may not have a student ID
      unique: { name: 'users_student_id_unique', msg: 'This Student ID is already registered' },
      field: 'student_id',
      set(value) {
        // Uppercase for consistency (STI-BAL-2024-00123)
        this.setDataValue('studentId', value ? value.trim().toUpperCase() : null);
      },
    },

    department: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: {
          args: [['BSIT', 'BSCS', 'BSBA', 'BSTM', 'BSHM', 'BSE', 'BEED', 'Other', null]],
          msg: 'Invalid department value',
        },
      },
    },

    // Auth 
    passwordHash: {
      type: DataTypes.STRING(255), // bcrypt output is 60 chars; 255 gives headroom
      allowNull: false,
      field: 'password_hash',
      // No validation here — authController handles hashing before saving
    },

    role: {
      type: DataTypes.ENUM('Admin', 'Organizer', 'Staff', 'Attendee'),
      allowNull: false,
      defaultValue: 'Attendee',
      validate: {
        isIn: {
          args: [['Admin', 'Organizer', 'Staff', 'Attendee']],
          msg: 'Invalid role',
        },
      },
    },

    refreshToken: {
      // Hashed refresh token (bcrypt). NULL = logged out.
      // TEXT instead of STRING because bcrypt hashes can be up to ~60 chars,
      // and we want room if we ever switch algorithm.
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      field: 'refresh_token',
    },

    // Password Reset 
    passwordResetToken: {
      // SHA-256 hash of the raw reset token sent to the user.
      // We store only the hash so a DB breach can't be used to reset passwords.
      // NULL means no active reset request.
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      field: 'password_reset_token',
    },

    passwordResetExpiry: {
      // UTC timestamp after which the reset token is invalid.
      // Set to 1 hour from now when a reset request is created.
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: 'password_reset_expiry',
    },

    // added Phase 2 — bulk upload creates stub users for attendees who haven't self-registered.
    // stub users have a bcrypt hash of random bytes as their password; they cannot log in.
    isStub: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_stub',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',      // lowercase, plural — standard SQL convention
    timestamps: true,
    // Map camelCase JS accessors to snake_case DB columns
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: true,  // tells Sequelize: JS camelCase → DB snake_case automatically

    // Scopes 
    // Use User.scope('public') when returning user data to the client to
    // guarantee sensitive fields are never accidentally included.
    scopes: {
      // Strips passwordHash and refreshToken for API responses
      public: {
        attributes: { exclude: ['passwordHash', 'refreshToken'] },
      },
    },

    // Indexes
    indexes: [
      { unique: true, fields: ['email'] },
      { unique: true, fields: ['student_id'], where: { student_id: { [require('sequelize').Op.ne]: null } } },
      { fields: ['role'] },  // analytics queries filter by role frequently
    ],
  }
);

// toJSON override 
// called automatically whenever a User instance is serialised (res.json, JSON.stringify).
// this is the LAST LINE OF DEFENCE against leaking sensitive fields.
// even if a future developer accidentally sends `user` directly in a response,
// passwordHash and refreshToken will be stripped.
const originalToJSON = User.prototype.toJSON;
User.prototype.toJSON = function () {
  const values = originalToJSON.call(this);
  delete values.passwordHash;
  delete values.password_hash;
  delete values.refreshToken;
  delete values.refresh_token;
  delete values.passwordResetToken;
  delete values.password_reset_token;
  delete values.passwordResetExpiry;
  delete values.password_reset_expiry;
  return values;
};

module.exports = User;
