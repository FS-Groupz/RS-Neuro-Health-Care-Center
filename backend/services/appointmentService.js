/**
 * RS Neuro Health Care Center — Appointment Service
 * Business logic for reference ID generation, duplicate detection, and persistence
 */

const crypto = require('node:crypto');
const db = require('../database/db');

function generateReferenceId() {
  // Format: RSNC-2026-XXXXXX (6 uppercase hex characters from cryptographic random bytes)
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  const year = new Date().getFullYear();
  return `RSNC-${year}-${randomHex}`;
}

function computeIdempotencyHash(phone, preferredDate, service) {
  return crypto.createHash('sha256')
    .update(`${phone}|${preferredDate}|${service.toLowerCase()}`)
    .digest('hex');
}

async function createAppointmentRequest(sanitizedData, customDb = null) {
  // 1. Check for duplicate submission within rolling 5-minute window
  const duplicate = db.findRecentDuplicate(
    sanitizedData.phone,
    sanitizedData.preferred_date,
    sanitizedData.service,
    customDb
  );

  if (duplicate) {
    const error = new Error('DUPLICATE_REQUEST');
    error.statusCode = 409;
    error.existingReferenceId = duplicate.appointment_id;
    error.message = `A consultation request for this mobile number, date, and service was already submitted recently (Reference ID: ${duplicate.appointment_id}). Please wait a few minutes before submitting another request or contact the clinic.`;
    throw error;
  }

  // 2. Generate unique reference ID
  const referenceId = generateReferenceId();
  const createdAt = new Date().toISOString();
  const idempotencyHash = computeIdempotencyHash(
    sanitizedData.phone,
    sanitizedData.preferred_date,
    sanitizedData.service
  );

  // 3. Assemble authoritative record (status is always 'pending' on creation)
  const record = {
    appointment_id: referenceId,
    created_at: createdAt,
    full_name: sanitizedData.full_name,
    phone: sanitizedData.phone,
    email: sanitizedData.email,
    service: sanitizedData.service,
    preferred_doctor: sanitizedData.preferred_doctor,
    preferred_date: sanitizedData.preferred_date,
    preferred_time: sanitizedData.preferred_time,
    contact_method: sanitizedData.contact_method,
    message: sanitizedData.message || null,
    status: 'pending',
    idempotency_hash: idempotencyHash
  };

  // 4. Persist to database
  db.insertAppointment(record, customDb);

  // 5. Return sanitized confirmation payload
  return {
    referenceId: record.appointment_id,
    status: record.status,
    createdAt: record.created_at,
    details: {
      fullName: record.full_name,
      service: record.service,
      preferredDoctor: record.preferred_doctor,
      preferredDate: record.preferred_date,
      preferredTime: record.preferred_time,
      contactMethod: record.contact_method
    },
    message: 'Your appointment request has been recorded with status: Pending Confirmation. The clinic team will contact you to verify scheduling.'
  };
}

module.exports = {
  generateReferenceId,
  computeIdempotencyHash,
  createAppointmentRequest
};
