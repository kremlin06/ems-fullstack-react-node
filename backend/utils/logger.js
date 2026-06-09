'use strict';

// zero-dependency structured JSON logger
// dev  : writes to console only
// prod : writes to console + appends to <project-root>/logs/app.log
// never throws — file-write failures are silently swallowed

const fs   = require('fs');
const path = require('path');

const IS_PROD   = process.env.NODE_ENV === 'production';
const LOG_FILE  = path.join(__dirname, '..', '..', 'logs', 'app.log');
let   logDirOk  = false; // lazy-initialised on first prod write

// helpers

function ensureLogDir() {
  if (logDirOk) return;
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    logDirOk = true;
  } catch {
    // silently continue without file logging if directory cannot be created
  }
}

function serializeMeta(meta) {
  if (meta === undefined || meta === null) return undefined;
  if (meta instanceof Error) {
    return { message: meta.message, stack: meta.stack, name: meta.name };
  }
  return meta;
}

function write(level, message, meta) {
  const entry = {
    ts:    new Date().toISOString(),
    level,
    msg:   String(message),
    ...(meta !== undefined && { meta: serializeMeta(meta) }),
  };

  const line = JSON.stringify(entry);

  // always write to console
  const consoleFn = level === 'error' ? console.error
                  : level === 'warn'  ? console.warn
                  : console.log;
  consoleFn(line);

  // in production also append to file
  if (IS_PROD) {
    try {
      ensureLogDir();
      if (logDirOk) fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
    } catch {
      // silently swallow — never let logging crash the request cycle
    }
  }
}

// public API

const logger = {
  info:  (message, meta) => write('info',  message, meta),
  warn:  (message, meta) => write('warn',  message, meta),
  error: (message, meta) => write('error', message, meta),
  debug: (message, meta) => { if (!IS_PROD) write('debug', message, meta); },
};

module.exports = logger;
