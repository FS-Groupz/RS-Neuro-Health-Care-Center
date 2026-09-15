/**
 * RS Neuro Health Care Center — Backend HTTP Server
 * Standard Node.js v24 HTTP server with native SQLite persistence
 */

const http = require('node:http');
const path = require('node:path');
const { checkRateLimit, setSecurityHeaders, parseJsonBody } = require('./middleware/security');
const { handleCreateAppointment, handleHealthCheck } = require('./controllers/appointmentController');
const { getDb, closeDb } = require('./database/db');

const PORT = parseInt(process.env.PORT || '3000', 10);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || '*')
  .split(',')
  .map(o => o.trim());

function resolveOrigin(reqOrigin) {
  if (ALLOWED_ORIGINS.includes('*') || !reqOrigin) return '*';
  if (ALLOWED_ORIGINS.includes(reqOrigin)) return reqOrigin;
  return ALLOWED_ORIGINS[0];
}

function createServer(customDb = null) {
  const server = http.createServer(async (req, res) => {
    const origin = resolveOrigin(req.headers.origin);
    setSecurityHeaders(res, origin);

    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    // Reject unsupported HTTP methods
    if (!['GET', 'POST', 'OPTIONS'].includes(req.method)) {
      res.setHeader('Allow', 'GET, POST, OPTIONS');
      res.statusCode = 405;
      res.end(JSON.stringify({
        success: false,
        error: 'Method Not Allowed'
      }));
      return;
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // 2. Health check route (unthrottled)
    if (req.method === 'GET' && (pathname === '/api/health' || pathname === '/health')) {
      handleHealthCheck(req, res);
      return;
    }

    // 3. Rate limiting for mutating endpoints
    const isRateLimited = !checkRateLimit(clientIp);
    if (isRateLimited) {
      res.statusCode = 429;
      res.end(JSON.stringify({
        success: false,
        error: 'Too many requests. Please wait a few moments before trying again.'
      }));
      return;
    }

    // 4. Appointments POST endpoint
    if (req.method === 'POST' && pathname === '/api/appointments') {
      const contentType = req.headers['content-type'] || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        res.statusCode = 415;
        res.end(JSON.stringify({
          success: false,
          error: 'Unsupported Media Type. Content-Type must be application/json.'
        }));
        return;
      }

      try {
        const body = await parseJsonBody(req, 64 * 1024);
        await handleCreateAppointment(req, res, body, customDb);
      } catch (err) {
        if (err.message === 'PAYLOAD_TOO_LARGE') {
          res.statusCode = 413;
          res.end(JSON.stringify({
            success: false,
            error: 'Request payload too large. Maximum allowed size is 64KB.'
          }));
        } else if (err.message === 'INVALID_JSON') {
          res.statusCode = 400;
          res.end(JSON.stringify({
            success: false,
            error: 'Malformed JSON in request body.'
          }));
        } else {
          res.statusCode = 500;
          res.end(JSON.stringify({
            success: false,
            error: 'Server error processing request.'
          }));
        }
      }
      return;
    }

    // 5. 404 Not Found for any other API route
    res.statusCode = 404;
    res.end(JSON.stringify({
      success: false,
      error: 'Endpoint not found.'
    }));
  });

  return server;
}

// Start standalone server if executed directly
if (require.main === module) {
  // Ensure DB initializes
  getDb();

  const server = createServer();
  server.listen(PORT, () => {
    console.log(`[RS Neuro Care Backend] Running on http://localhost:${PORT}`);
  });

  process.on('SIGINT', () => {
    console.log('\n[RS Neuro Care Backend] Shutting down cleanly...');
    closeDb();
    server.close(() => process.exit(0));
  });
}

module.exports = {
  createServer
};
