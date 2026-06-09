'use strict';

// 301-redirect HTTP → HTTPS in production when behind a proxy that sets
// x-forwarded-proto (Heroku, Railway, Render, Nginx, etc.).
// No-op in development so local http://localhost still works.

const IS_PROD = process.env.NODE_ENV === 'production';

function httpsRedirect(req, res, next) {
  if (!IS_PROD) return next();

  // trust the first hop; proxies set x-forwarded-proto to 'https' or 'http'
  const proto = req.headers['x-forwarded-proto'];
  if (proto && proto !== 'https') {
    const target = `https://${req.headers.host}${req.originalUrl}`;
    return res.redirect(301, target);
  }

  next();
}

module.exports = httpsRedirect;
