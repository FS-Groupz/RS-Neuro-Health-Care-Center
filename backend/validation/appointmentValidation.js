/**
 * RS Neuro Health Care Center — Server-side Appointment Validation
 * Validates and sanitizes patient appointment request inputs
 */

const ALLOWED_SERVICES = [
  'Neurological Evaluation & Diagnosis',
  'Spine & Peripheral Nerve Care',
  'Headache & Migraine Management',
  'Neuro-Rehabilitation & Therapy',
  'Cognitive & Memory Health',
  'Neuromuscular Care & Consultation',
  // Allow bracketed placeholders if user selects placeholder
  '[Neurological Evaluation & Diagnosis]',
  '[Spine & Peripheral Nerve Care]',
  '[Headache & Migraine Management]',
  '[Neuro-Rehabilitation & Therapy]',
  '[Cognitive & Memory Health]',
  '[Neuromuscular Care & Consultation]'
];

const ALLOWED_CONTACT_METHODS = ['phone', 'whatsapp', 'email'];

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  // Strip HTML tags and normalize whitespace
  return str.replace(/<[^>]*>?/gm, '').trim();
}

function validateAppointmentInput(body) {
  const errors = {};

  if (!body || typeof body !== 'object') {
    return {
      isValid: false,
      errors: { _general: 'Malformed or missing request body' },
      sanitized: null
    };
  }

  // 1. Full Name
  const rawName = sanitizeString(body.fullName || body.full_name || '');
  if (!rawName || rawName.length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters.';
  } else if (rawName.length > 100) {
    errors.fullName = 'Full Name cannot exceed 100 characters.';
  }

  // 2. Mobile Phone
  const rawPhone = String(body.phone || '').trim();
  const phoneDigits = rawPhone.replace(/\D/g, '');
  // Indian mobile: 10 digits starting with 6, 7, 8, or 9 (allow leading 0 or 91)
  const normalizedPhone = phoneDigits.length === 12 && phoneDigits.startsWith('91')
    ? phoneDigits.slice(2)
    : (phoneDigits.length === 11 && phoneDigits.startsWith('0') ? phoneDigits.slice(1) : phoneDigits);

  if (!normalizedPhone || !/^[6-9]\d{9}$/.test(normalizedPhone)) {
    errors.phone = 'Please provide a valid 10-digit Indian mobile number.';
  }

  // 3. Email
  const rawEmail = String(body.email || '').trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!rawEmail || !emailRegex.test(rawEmail)) {
    errors.email = 'Please provide a valid email address.';
  } else if (rawEmail.length > 100) {
    errors.email = 'Email address cannot exceed 100 characters.';
  }

  // 4. Consultation Service
  const rawService = sanitizeString(body.service || '');
  if (!rawService) {
    errors.service = 'Please select a clinical consultation service.';
  } else if (rawService.length > 150) {
    errors.service = 'Service name exceeds allowed length.';
  }

  // 5. Preferred Doctor
  const rawDoctor = sanitizeString(body.preferredDoctor || body.preferred_doctor || '');
  if (!rawDoctor) {
    errors.preferredDoctor = 'Please select a preferred specialist doctor.';
  } else if (rawDoctor.length > 120) {
    errors.preferredDoctor = 'Doctor name exceeds allowed length.';
  }

  // 6. Preferred Date
  const rawDate = String(body.preferredDate || body.preferred_date || '').trim();
  if (!rawDate || !/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    errors.preferredDate = 'Please select a valid date in YYYY-MM-DD format.';
  } else {
    const selectedDate = new Date(rawDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      errors.preferredDate = 'Invalid date selected.';
    } else if (selectedDate < today) {
      errors.preferredDate = 'Preferred appointment date cannot be in the past.';
    }
  }

  // 7. Preferred Time Slot
  const rawTime = sanitizeString(body.preferredTime || body.preferred_time || '');
  if (!rawTime) {
    errors.preferredTime = 'Please select a preferred consultation time window.';
  } else if (rawTime.length > 60) {
    errors.preferredTime = 'Time slot selection exceeds allowed length.';
  }

  // 8. Preferred Contact Method
  const rawMethod = String(body.contactMethod || body.contact_method || '').trim().toLowerCase();
  if (!rawMethod || !ALLOWED_CONTACT_METHODS.includes(rawMethod)) {
    errors.contactMethod = 'Please select a valid contact method (phone, whatsapp, or email).';
  }

  // 9. Additional Notes / Message
  const rawMessage = sanitizeString(body.message || '');
  if (rawMessage.length > 500) {
    errors.message = 'Medical notes cannot exceed 500 characters.';
  }

  // 10. Patient Consent
  const consentVal = body.consent;
  const isConsentGiven = consentVal === true || consentVal === 'true' || consentVal === 'on' || consentVal === 1;
  if (!isConsentGiven) {
    errors.consent = 'You must agree to the appointment request guidelines and privacy notice.';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitized: isValid ? {
      full_name: rawName,
      phone: normalizedPhone,
      email: rawEmail.toLowerCase(),
      service: rawService,
      preferred_doctor: rawDoctor,
      preferred_date: rawDate,
      preferred_time: rawTime,
      contact_method: rawMethod,
      message: rawMessage || null
    } : null
  };
}

module.exports = {
  validateAppointmentInput,
  sanitizeString,
  ALLOWED_SERVICES,
  ALLOWED_CONTACT_METHODS
};
