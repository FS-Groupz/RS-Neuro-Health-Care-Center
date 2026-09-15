/**
 * RS Neuro Health Care Center — Appointment Controller
 */

const { validateAppointmentInput } = require('../validation/appointmentValidation');
const { createAppointmentRequest } = require('../services/appointmentService');

async function handleCreateAppointment(req, res, body, customDb = null) {
  try {
    // 1. Validate incoming payload
    const validationResult = validateAppointmentInput(body);

    if (!validationResult.isValid) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        success: false,
        error: 'Validation failed. Please verify the required fields.',
        fieldErrors: validationResult.errors
      }));
      return;
    }

    // 2. Process and store appointment request
    const result = await createAppointmentRequest(validationResult.sanitized, customDb);

    // 3. Return successful creation response
    res.statusCode = 201;
    res.end(JSON.stringify({
      success: true,
      data: result
    }));
  } catch (err) {
    if (err.statusCode === 409) {
      res.statusCode = 409;
      res.end(JSON.stringify({
        success: false,
        error: err.message,
        existingReferenceId: err.existingReferenceId || null
      }));
      return;
    }

    // Generic internal error — never leak stack trace or SQL details
    console.error('[AppointmentController Error]', err.message || err);
    res.statusCode = 500;
    res.end(JSON.stringify({
      success: false,
      error: 'An internal server error occurred while processing your request. Please try again later or contact the clinic directly.'
    }));
  }
}

function handleHealthCheck(req, res) {
  res.statusCode = 200;
  res.end(JSON.stringify({
    status: 'ok',
    service: 'RS Neuro Health Care Center API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  }));
}

module.exports = {
  handleCreateAppointment,
  handleHealthCheck
};
