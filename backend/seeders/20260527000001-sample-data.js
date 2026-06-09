'use strict';

/**
 * Sample data seeder — populates events, sessions, registrations, attendances
 * for dev/demo use.
 *
 * Run:  npx sequelize-cli db:seed:all
 * Undo: npx sequelize-cli db:seed:undo:all
 *
 * Requires the users table to already have rows (run seedDevUsers.js first).
 */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // fetch seeded user IDs so we can link FK references
    const users = await queryInterface.sequelize.query(
      `SELECT id, role FROM users ORDER BY id LIMIT 20`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const adminUser  = users.find((u) => u.role === 'Admin')  || users[0];
    const attendees  = users.filter((u) => u.role === 'Attendee');
    const adminId    = adminUser?.id || 1;

    // events
    await queryInterface.bulkInsert('events', [
      { title: 'Campus Job Fair',            description: 'Annual campus job fair connecting students with employers.',          date: '2026-05-20', venue: 'STI Gymnasium',       status: 'Completed', capacity: 300, created_by: adminId, created_at: now, updated_at: now },
      { title: 'Tech Talk: AI in Education', description: 'Workshop series on artificial intelligence in modern education.',    date: '2026-05-15', venue: 'Computer Lab A',      status: 'Completed', capacity:  80, created_by: adminId, created_at: now, updated_at: now },
      { title: 'Student Council Elections',  description: 'Annual student council election for academic year 2026-2027.',       date: '2026-05-10', venue: 'Main Lobby',         status: 'Completed', capacity: 500, created_by: adminId, created_at: now, updated_at: now },
      { title: 'Hackathon 2026',             description: '24-hour coding challenge open to all CS and IT students.',           date: '2026-06-01', venue: 'Innovation Hub',      status: 'Upcoming',  capacity: 120, created_by: adminId, created_at: now, updated_at: now },
      { title: 'Research Symposium',         description: 'Annual research presentation event for graduate students.',          date: '2026-05-25', venue: 'Auditorium B',        status: 'Upcoming',  capacity: 200, created_by: adminId, created_at: now, updated_at: now },
      { title: 'Alumni Networking Night',    description: 'Evening event connecting current students with alumni professionals.',date: '2026-05-18', venue: 'Events Hall',         status: 'Ongoing',   capacity: 120, created_by: adminId, created_at: now, updated_at: now },
    ]);

    const events = await queryInterface.sequelize.query(
      `SELECT id, title FROM events ORDER BY id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const eventMap = {};
    events.forEach((e) => { eventMap[e.title] = e.id; });

    // sessions
    await queryInterface.bulkInsert('sessions', [
      { event_id: eventMap['Campus Job Fair'],            name: 'Opening Ceremony',      start_time: '2026-05-20T09:00:00Z', end_time: '2026-05-20T10:00:00Z', capacity: 250, created_at: now, updated_at: now },
      { event_id: eventMap['Tech Talk: AI in Education'], name: 'Tech Workshop A',       start_time: '2026-05-15T10:00:00Z', end_time: '2026-05-15T12:00:00Z', capacity:  80, created_at: now, updated_at: now },
      { event_id: eventMap['Tech Talk: AI in Education'], name: 'Tech Workshop B',       start_time: '2026-05-15T13:00:00Z', end_time: '2026-05-15T15:00:00Z', capacity:  80, created_at: now, updated_at: now },
      { event_id: eventMap['Research Symposium'],         name: 'Keynote Address',       start_time: '2026-05-25T09:00:00Z', end_time: '2026-05-25T10:30:00Z', capacity: 200, created_at: now, updated_at: now },
      { event_id: eventMap['Research Symposium'],         name: 'Breakout Session 1',    start_time: '2026-05-25T14:00:00Z', end_time: '2026-05-25T16:00:00Z', capacity: 100, created_at: now, updated_at: now },
      { event_id: eventMap['Alumni Networking Night'],    name: 'Networking Night',      start_time: '2026-05-18T18:00:00Z', end_time: '2026-05-18T21:00:00Z', capacity: 120, created_at: now, updated_at: now },
      { event_id: eventMap['Student Council Elections'],  name: 'Voting Hour',           start_time: '2026-05-10T08:00:00Z', end_time: '2026-05-10T12:00:00Z', capacity: 500, created_at: now, updated_at: now },
      { event_id: eventMap['Student Council Elections'],  name: 'Results Announcement',  start_time: '2026-05-10T16:00:00Z', end_time: '2026-05-10T17:00:00Z', capacity: 500, created_at: now, updated_at: now },
    ]);

    // skip registration/attendance seeding if no attendee users exist yet
    if (attendees.length === 0) return;

    const sessions = await queryInterface.sequelize.query(
      `SELECT id, name FROM sessions ORDER BY id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // registrations (D3) — first 3 attendees registered for first 3 events
    const regRows = [];
    const regStatuses = ['Confirmed', 'Confirmed', 'Pending', 'Cancelled', 'Confirmed'];
    attendees.slice(0, 5).forEach((user, i) => {
      events.slice(0, 4).forEach((event, j) => {
        regRows.push({
          user_id: user.id,
          event_id: event.id,
          status: regStatuses[(i + j) % regStatuses.length],
          registered_at: new Date(Date.now() - (i + j) * 3600000),
          created_at: now,
          updated_at: now,
        });
      });
    });
    if (regRows.length > 0) await queryInterface.bulkInsert('registrations', regRows);

    // attendances (D4)
    const attStatuses = ['Present', 'Late', 'Present', 'Absent', 'Present'];
    const attRows = [];
    attendees.slice(0, 5).forEach((user, i) => {
      sessions.slice(0, 6).forEach((session, j) => {
        attRows.push({
          user_id: user.id,
          session_id: session.id,
          status: attStatuses[(i + j) % attStatuses.length],
          check_in_time: new Date(Date.now() - (i + j) * 7200000),
          created_at: now,
          updated_at: now,
        });
      });
    });
    if (attRows.length > 0) await queryInterface.bulkInsert('attendances', attRows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('attendances', null, {});
    await queryInterface.bulkDelete('registrations', null, {});
    await queryInterface.bulkDelete('sessions', null, {});
    await queryInterface.bulkDelete('events', null, {});
  },
};
