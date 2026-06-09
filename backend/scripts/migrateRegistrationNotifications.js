'use strict';

// one-time script: creates Notification rows for existing Registration records
// that don't already have a corresponding notification.
//
// before this fix, registration notifications were "derived" on every fetch
// with read: false hardcoded, meaning they always appeared unread.
// after the fix, new registrations create a Notification row in the register()
// endpoint. this script backfills existing registrations so old data isn't lost.
//
// run once: node scripts/migrateRegistrationNotifications.js
// safe to re-run — skips registrations that already have a notification.

require('dotenv').config();
const w = console.warn; console.warn = () => {};
const { connectDB, sequelize } = require('../config/database');
const { User, Registration, Event, Notification } = require('../models');
console.warn = w;

const migrate = async () => {
  await connectDB();
  console.log('\nMigrating registration notifications...\n');

  // load all confirmed registrations with their event title
  const regs = await Registration.findAll({
    where: { status: 'Confirmed' },
    include: [{ model: Event, as: 'event', attributes: ['title'] }],
    order: [['registeredAt', 'ASC']],
  });

  let created = 0;
  let skipped = 0;

  for (const reg of regs) {
    // check if a notification for this registration already exists.
    // we match on userId + message content to avoid duplicates on re-run.
    const eventTitle = reg.event?.title || 'an event';
    const message    = `You have been registered for "${eventTitle}".`;

    const exists = await Notification.findOne({
      where: { userId: reg.userId, message },
    });

    if (exists) {
      skipped++;
      continue;
    }

    await Notification.create({
      userId:    reg.userId,
      type:      'success',
      title:     'Registration Confirmed',
      message,
      isRead:    false,
      createdAt: reg.registeredAt, // preserve original timestamp
      updatedAt: reg.registeredAt,
    });
    created++;
    console.log(`  Created  userId=${reg.userId}  "${eventTitle}"`);
  }

  console.log(`\nDone. Created: ${created}  Skipped (already existed): ${skipped}\n`);
  await sequelize.close();
};

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
