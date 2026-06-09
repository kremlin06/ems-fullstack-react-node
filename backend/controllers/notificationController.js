'use strict';

// notificationController — generic, role-agnostic in-app notifications.
//
// why this exists separately from attendeeController.getNotifications:
//   the attendee version merges derived Registration / SessionAssignment rows
//   and is mounted under /api/attendee/* (attendee-scoped naming).  staff,
//   organizers and admins also need to see their own Notification rows (FR-08
//   check-in confirmations, future system alerts), so this controller exposes
//   the plain Notification table to ANY authenticated role, scoped to the
//   caller's own user id.
//
// mounted at /api/notifications (see notificationRoutes.js + server.js).

const { Notification } = require('../models');
const logger = require('../utils/logger');

// GET /api/notifications
// returns the caller's most recent notifications (own rows only).
// shape matches the attendee endpoint so the same frontend list component works:
//   { id, type, title, message, createdAt, read }
exports.getMyNotifications = async (req, res) => {
  try {
    const rows = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 30,
    });

    const notifications = rows.map((n) => ({
      id:        n.id,
      type:      n.type,
      title:     n.title,
      message:   n.message,
      createdAt: n.createdAt,
      read:      n.isRead,
    }));

    return res.json(notifications);
  } catch (err) {
    logger.error('[notificationController.getMyNotifications]', err);
    return res.status(500).json({
      error: { message: 'Failed to load notifications.', code: 'INTERNAL_ERROR' },
    });
  }
};

// PATCH /api/notifications/read-all
// marks every unread notification owned by the caller as read.
exports.markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    return res.json({ ok: true });
  } catch (err) {
    logger.error('[notificationController.markAllRead]', err);
    // non-fatal — client can still mark read locally
    return res.json({ ok: false });
  }
};
