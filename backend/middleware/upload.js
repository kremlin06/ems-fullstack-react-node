'use strict';

const multer = require('multer');
const path = require('path');

const ALLOWED_MIME_TYPES = new Set([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

const ALLOWED_EXTENSIONS = new Set(['.csv', '.xlsx', '.xls']);

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME_TYPES.has(file.mimetype) || ALLOWED_EXTENSIONS.has(ext)) {
    return cb(null, true);
  }
  const err = new Error('Only CSV and Excel files (.csv, .xlsx, .xls) are accepted.');
  err.status = 400;
  cb(err, false);
};

// store in memory — buffer passed directly to xlsx parser, no temp files needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB hard ceiling
  fileFilter,
});

// single-file middleware for attendee upload — field name: 'file'
const uploadSingle = upload.single('file');

// wrap multer to turn its callback errors into proper Express errors
const uploadMiddleware = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (!err) return next();

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: { message: 'File too large. Maximum size is 10 MB.', code: 'FILE_TOO_LARGE' },
      });
    }
    return res.status(err.status || 400).json({
      error: { message: err.message, code: 'INVALID_FILE' },
    });
  });
};

module.exports = uploadMiddleware;
