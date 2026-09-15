/**
 * RS Neuro Health Care Center — SQLite Database Access Layer
 * Uses Node.js v22+ native node:sqlite DatabaseSync for zero-dependency persistence
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

let dbInstance = null;

function getDb(customPath = null) {
  if (dbInstance) return dbInstance;

  const dbPath = customPath || process.env.DATABASE_PATH || path.join(__dirname, 'appointments.db');

  // Ensure directory exists if not memory
  if (dbPath !== ':memory:') {
    const dir = path.dirname(path.resolve(dbPath));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  dbInstance = new DatabaseSync(dbPath);

  // Initialize schema
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      service TEXT NOT NULL,
      preferred_doctor TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      contact_method TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      idempotency_hash TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_appointments_id ON appointments(appointment_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_duplicate ON appointments(phone, preferred_date, service);
  `);

  return dbInstance;
}

function insertAppointment(appointmentData, customDb = null) {
  const db = customDb || getDb();
  const stmt = db.prepare(`
    INSERT INTO appointments (
      appointment_id,
      created_at,
      full_name,
      phone,
      email,
      service,
      preferred_doctor,
      preferred_date,
      preferred_time,
      contact_method,
      message,
      status,
      idempotency_hash
    ) VALUES (
      :appointment_id,
      :created_at,
      :full_name,
      :phone,
      :email,
      :service,
      :preferred_doctor,
      :preferred_date,
      :preferred_time,
      :contact_method,
      :message,
      :status,
      :idempotency_hash
    )
  `);

  stmt.run({
    appointment_id: appointmentData.appointment_id,
    created_at: appointmentData.created_at,
    full_name: appointmentData.full_name,
    phone: appointmentData.phone,
    email: appointmentData.email,
    service: appointmentData.service,
    preferred_doctor: appointmentData.preferred_doctor,
    preferred_date: appointmentData.preferred_date,
    preferred_time: appointmentData.preferred_time,
    contact_method: appointmentData.contact_method,
    message: appointmentData.message || null,
    status: appointmentData.status || 'pending',
    idempotency_hash: appointmentData.idempotency_hash || null,
  });

  return appointmentData;
}

function findRecentDuplicate(phone, preferredDate, service, customDb = null) {
  const db = customDb || getDb();
  // Check if an appointment with same phone, preferred date, and service was created in the last 5 minutes
  const stmt = db.prepare(`
    SELECT appointment_id, created_at FROM appointments
    WHERE phone = :phone AND preferred_date = :preferred_date AND service = :service
    ORDER BY id DESC LIMIT 1
  `);

  const record = stmt.get({
    phone: phone,
    preferred_date: preferredDate,
    service: service
  });

  if (!record) return null;

  // Check timestamp within 5 minutes (300,000 ms)
  const createdTime = new Date(record.created_at).getTime();
  const now = Date.now();
  if (now - createdTime < 5 * 60 * 1000) {
    return record;
  }

  return null;
}

function getAppointmentById(appointmentId, customDb = null) {
  const db = customDb || getDb();
  const stmt = db.prepare(`
    SELECT appointment_id, created_at, full_name, phone, email, service,
           preferred_doctor, preferred_date, preferred_time, contact_method,
           message, status
    FROM appointments WHERE appointment_id = :appointment_id
  `);
  return stmt.get({ appointment_id: appointmentId });
}

function closeDb() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

module.exports = {
  getDb,
  insertAppointment,
  findRecentDuplicate,
  getAppointmentById,
  closeDb
};
