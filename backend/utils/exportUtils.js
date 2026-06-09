'use strict';

const Papa  = require('papaparse');
const jsPDF = require('jspdf');
// jspdf-autotable patches jsPDF.prototype.autoTable
require('jspdf-autotable');

// PII masking
// Admin     → full data
// Organizer → masked email (a*@domain), masked studentId (*-XXXX), full name
// Staff     → masked email, masked studentId, initials-only name (A. S.)
// Attendee  → blocked at route level before reaching here

function maskPII(row, role) {
  if (role === 'Admin') return row;

  const masked = { ...row };

  // Email: keep only the first character before @, collapse rest to single *
  // Node 22+ safe lookbehind: a*@sti.edu
  if (masked.email) {
    masked.email = masked.email.replace(/(?<=.).*(?=@)/, '*');
  }

  // Student ID: keep only last 4 digits after the final hyphen
  // Handles varying prefix lengths: STI-CABA-0001 → *-0001
  if (masked.studentId) {
    masked.studentId = String(masked.studentId).replace(/.*(?=-.{4}$)/, '*');
  }

  // Full name: Staff sees initials only (Maria Clara Santos → M. C. S.)
  if (role === 'Staff' && masked.fullName) {
    masked.fullName = masked.fullName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0].toUpperCase() + '.')
      .join(' ');
  }

  return masked;
}

// Column definitions
const REPORT_HEADERS = [
  { label: 'Registration ID', key: 'registrationId' },
  { label: 'Full Name',       key: 'fullName' },
  { label: 'Email',           key: 'email' },
  { label: 'Student ID',      key: 'studentId' },
  { label: 'Department',      key: 'department' },
  { label: 'Session',         key: 'sessionTitle' },
  { label: 'Reg. Status',     key: 'registrationStatus' },
  { label: 'Attendance',      key: 'attendanceStatus' },
  { label: 'Check-in Time',   key: 'checkInTime' },
  { label: 'Registered At',   key: 'registeredAt' },
];

// CSV builder
function buildCSV(rows, role) {
  const masked = rows.map(r => maskPII(r, role));
  const fields  = REPORT_HEADERS.map(h => h.label);
  const data    = masked.map(r =>
    REPORT_HEADERS.reduce((acc, h) => {
      acc[h.label] = r[h.key] ?? '';
      return acc;
    }, {}),
  );
  return Papa.unparse({ fields, data });
}

// PDF builder
function buildPDF(rows, role, metadata = {}) {
  const masked = rows.map(r => maskPII(r, role));

  const doc = new jsPDF.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  // title block
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Event Management System — Attendance Report', 40, 40);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const meta = [
    metadata.eventTitle   ? `Event: ${metadata.eventTitle}` : null,
    metadata.sessionTitle ? `Session: ${metadata.sessionTitle}` : null,
    metadata.dateRange    ? `Period: ${metadata.dateRange}` : null,
    `Exported: ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`,
    `Role: ${role} ${role !== 'Admin' ? '(PII masked)' : ''}`,
  ].filter(Boolean).join('   |   ');
  doc.text(meta, 40, 58);

  const head  = [REPORT_HEADERS.map(h => h.label)];
  const body  = masked.map(r => REPORT_HEADERS.map(h => String(r[h.key] ?? '')));

  doc.autoTable({
    head,
    body,
    startY: 70,
    styles: {
      fontSize:   8,
      cellPadding: 4,
      overflow:   'linebreak',
    },
    headStyles: {
      fillColor:  [0, 123, 255],
      textColor:  255,
      fontStyle:  'bold',
      fontSize:   8,
    },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    margin: { left: 40, right: 40 },
  });

  // return raw Buffer — caller sets Content-Type and streams it
  return Buffer.from(doc.output('arraybuffer'));
}

module.exports = { buildCSV, buildPDF, maskPII };
