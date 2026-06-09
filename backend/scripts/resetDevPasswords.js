'use strict';

/**
 * resetDevPasswords.js — resets all seeded dev users back to their original passwords.
 *
 * Run: node scripts/resetDevPasswords.js
 *
 * Only updates accounts listed here. Unknown accounts (e.g. manually created ones) are left alone.
 * Safe to run multiple times.
 */

require('dotenv').config();

const origWarn = console.warn;
console.warn = () => {};
const { connectDB, sequelize } = require('../config/database');
const { User } = require('../models');
const { hashPassword } = require('../utils/hashPassword');
console.warn = origWarn;

const RESET_LIST = [
  { email: 'admin@sti.edu',               password: 'Admin1234'  },
  { email: 'staff@sti.edu',               password: 'Staff1234'  },
  { email: 'angelo@sti.edu',              password: 'Attend1234' },
  { email: 'jhonkenth1307@gmail.com',     password: 'Attend1234' },
  { email: 'ducutsheikaishi@gmail.com',   password: 'Attend1234' },
  { email: 'milesderek@sti.edu',          password: 'Attend1234' },
  { email: 'justinebuban@sti.edu',        password: 'Attend1234' },
  { email: 'enricomiguel@sti.edu',        password: 'Attend1234' },
  { email: 'josesoriano@sti.edu',         password: 'Attend1234' },
];

const reset = async () => {
  await connectDB();
  console.log('\n Resetting dev user passwords...\n');

  for (const entry of RESET_LIST) {
    const user = await User.findOne({ where: { email: entry.email } });

    if (!user) {
      console.log(`  Skipped  ${entry.email} (not found in DB)`);
      continue;
    }

    const passwordHash = await hashPassword(entry.password);
    await user.update({ passwordHash });
    console.log(`  Reset    ${entry.email}  →  ${entry.password}`);
  }

  console.log('\nDone.\n');
  await sequelize.close();
};

reset().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
