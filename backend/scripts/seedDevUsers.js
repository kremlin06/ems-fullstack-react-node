'use strict';

/**
 * seedDevUsers.js — creates test users for local development.
 *
 * Run: node scripts/seedDevUsers.js
 *
 * Creates:
 *   admin@sti.edu   / Admin1234   — role: Admin
 *   staff@sti.edu   / Staff1234   — role: Staff
 *   angelo@sti.edu  / Attend1234  — role: Attendee  (with studentId + department)
 *
 * Safe to re-run — skips users that already exist.
 * Never run this in production. It's for local dev only.
 */

require('dotenv').config();

// Suppress placeholder secret warnings during seeding
const origWarn = console.warn;
console.warn = () => {};
const { connectDB, sequelize } = require('../config/database');
const { User }                 = require('../models');
const { hashPassword }         = require('../utils/hashPassword');
console.warn = origWarn;

const SEED_USERS = [
  {
    fullName:   'System Admin',
    email:      'admin@sti.edu',
    password:   'Admin1234',
    role:       'Admin',
    studentId:  null,
    department: null,
  },
  {
    fullName:   'Event Staff',
    email:      'staff@sti.edu',
    password:   'Staff1234',
    role:       'Staff',
    studentId:  null,
    department: null,
  },
  {
    fullName:   'Angelo Santiago',
    email:      'angelo@sti.edu',
    password:   'Attend1234',
    role:       'Attendee',
    studentId:  'STI-BAL-2024-00001',
    department: 'BSCS',
  },
];

const seed = async () => {
  await connectDB();
  console.log('\n Seeding development users...\n');

  for (const userData of SEED_USERS) {
    const existing = await User.findOne({ where: { email: userData.email } });

    if (existing) {
      console.log(`  Skipped  ${userData.email} (already exists)`);
      continue;
    }

    const passwordHash = await hashPassword(userData.password);
    await User.create({
      fullName:   userData.fullName,
      email:      userData.email,
      passwordHash,
      role:       userData.role,
      studentId:  userData.studentId,
      department: userData.department,
    });

    console.log(` Created  ${userData.email}  [${userData.role}]  password: ${userData.password}`);
  }

  console.log('\n✨ Seeding complete.\n');
  await sequelize.close();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
