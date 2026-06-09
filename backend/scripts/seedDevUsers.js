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

// SEED_USERS is an array of objects — each object is one test user.
// when we run 'node scripts/seedDevUsers.js', this creates these users in the database.
// the 'email' field is what they use to log in AND where the reset email goes.
// for accounts with real emails (like jhonkenth@gmail.com), the reset email
// will actually arrive in that gmail inbox — great for demos!
// for accounts still using @sti.edu, the email goes to ethereal (fake preview inbox).
//
// members waiting for real emails to be provided (still using sti.edu for now):
//   angelo@sti.edu       — waiting
//   milesderek@sti.edu   — waiting
//   justinebuban@sti.edu — waiting
//   enricomiguel@sti.edu — waiting
//   josesoriano@sti.edu  — waiting
// when you get their real emails, update the 'email' field here and re-run this script.
const SEED_USERS = [
  {
    fullName: 'System Admin',
    // admin@sti.edu is a fake email — reset links go to ethereal preview url.
    // if you want to receive the reset email in a real inbox,
    // change this to a gmail or real school email you actually own.
    email: 'admin@sti.edu',
    password: 'Admin1234',
    role: 'Admin',
    studentId:  null,
    department: null,
  },
  {
    fullName: 'Event Staff',
    // same as above — staff@sti.edu is fake, goes to ethereal.
    email: 'staff@sti.edu',
    password:'Staff1234',
    role: 'Staff',
    studentId: null,
    department: null,
  },
  {
    fullName:   'Angelo Santiago',
    // waiting for angelo's real email — still using the old one for now.
    email: 'angelo@sti.edu',
    password: 'Attend1234',
    role: 'Attendee',
    studentId: '341383',
    department: 'BSCS',
  },
  {
    fullName: 'Jhon Kenth Delfin',
    // real gmail! reset emails for this account will actually arrive in this inbox.
    // updated from 'jhonkenth@sti.edu' (fake) to the real gmail address.
    email: 'jhonkenth1307@gmail.com',
    password: 'Attend1234',
    role: 'Attendee',
    studentId: '02000341383',
    department: 'BSCS',
  },
  {
    fullName:   'Sheika Ishi Torres Ducut',
    // real gmail! reset emails for this account will actually arrive in this inbox.
    // updated from 'sheikaishi@sti.edu' (fake) to the real gmail address.
    email: 'ducutsheikaishi@gmail.com',
    password: 'Attend1234',
    role: 'Attendee',
    studentId: '02000353637',
    department: 'BSCS',
  },
  {
    fullName:   'Miles Derek Blanco Cabadon',
    // waiting for real email — goes to ethereal for now.
    email: 'milesderek@sti.edu',
    password: 'Attend1234',
    role: 'Attendee',
    studentId: '02000123456',
    department: 'BSCS',
  },
  {
    fullName:   'Justine Buban',
    // waiting for real email — goes to ethereal for now.
    email: 'justinebuban@sti.edu',
    password: 'Attend1234',
    role: 'Attendee',
    studentId: '02000234567',
    department: 'BSCS',
  },
  {
    fullName: 'Enrico Miguel Remo Tamayo',
    // waiting for real email — goes to ethereal for now.
    email: 'enricomiguel@sti.edu',
    password: 'Attend1234',
    role: 'Attendee',
    studentId:  null,
    department: 'BSCS',
  },
  {
    fullName:   'Jose Soriano III',
    // waiting for real email — goes to ethereal for now.
    email: 'josesoriano@sti.edu',
    password: 'Attend1234',
    role: 'Attendee',
    studentId:'02000345678',
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
      fullName: userData.fullName,
      email: userData.email,
      passwordHash,
      role: userData.role,
      studentId:  userData.studentId,
      department: userData.department,
    });

    console.log(` Created  ${userData.email}  [${userData.role}]  password: ${userData.password}`);
  }

  console.log('\nSeeding complete.\n');
  await sequelize.close();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
