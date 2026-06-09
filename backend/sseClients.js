'use strict';

// Shared SSE client registry — one Map instance reused across all modules.
// Key: sessionId (integer), Value: Set<Express.Response>
// Usage: sseClients.get(sessionId)?.forEach(res => res.write(...))
const sseClients = new Map();

module.exports = sseClients;
