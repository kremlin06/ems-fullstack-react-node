'use strict';

/**
 * fixStudentIds.js — one-time migration to update existing user records
 * that were seeded with the old STI-BAL-YYYY-XXXXX campus prefix format
 * to the school's actual numeric student ID format.
 *
 * Run ONCE:  node scripts/fixStudentIds.js
 *
 * Safe to re-run — skips rows that already have the correct format.
 */

require('dotenv').config();

const origWarn = console.warn;
console.warn = () => {};
const { connectDB, sequelize } = require('../config/database');
const { User }                 = require('../models');
console.warn = origWarn;

// map old (wrong) student ID → new (correct) numeric ID
// add more entries here if there are other seeded users with the old format
const FIXES = [
  { email: 'angelo@sti.edu', oldStudentId: 'STI-BAL-2024-00001', newStudentId: '341383' },
];

const fix = async () => {
  await connectDB();
  console.log('\n Fixing student ID formats...\n');

  for (const { email, oldStudentId, newStudentId } of FIXES) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(`  Not found  ${email} — skipped`);
      continue;
    }

    if (user.studentId === newStudentId) {
      console.log(`  Already correct  ${email}  studentId: ${newStudentId} — skipped`);
      continue;
    }

    const prev = user.studentId;
    await user.update({ studentId: newStudentId });
    console.log(`  Updated  ${email}  "${prev}"  →  "${newStudentId}"`);
  }

  console.log('\n Done.\n');
  await sequelize.close();
};

fix().catch((err) => {
  console.error('Fix failed:', err);
  process.exit(1);
});
