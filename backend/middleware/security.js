/**
 * RS Neuro Health Care Center — Security & Rate Limiting Middleware
 */

const ipRequests = new Map();

// Clean up stale rate-limit IP records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipRequests.entries()) {
    const valid = timestamps.filter(t => now - t < 10 * 60 * 1000);
    if (valid.length === 0) {
      ipRequests.delete(ip);
    } else {
      ipRequests.set(ip, valid);
    }
  }
}, 10 * 60 * 1000).unref();

function checkRateLimit(ip, windowMs = 5 * 60 * 1000, maxRequests = 15) {
  const now = Date.now();
  const timestamps = ipRequests.get(ip) || [];
  const recent = timestamps.filter(t => now - t < windowMs);

  if (recent.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  recent.push(now);
  ipRequests.set(ip, recent);
  return true;
}

function setSecurityHeaders(res, origin = '*') {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

function parseJsonBody(req, maxSizeBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let rawData = '';
    let bytesReceived = 0;
    let isTooLarge = false;

    req.on('data', chunk => {
      if (isTooLarge) return;
      bytesReceived += chunk.length;
      if (bytesReceived > maxSizeBytes) {
        isTooLarge = true;
        req.pause();
        reject(new Error('PAYLOAD_TOO_LARGE'));
        return;
      }
      rawData += chunk;
    });

    req.on('end', () => {
      if (isTooLarge) return;
      if (!rawData) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(rawData);
        resolve(parsed);
      } catch (err) {
        reject(new Error('INVALID_JSON'));
      }
    });

    req.on('error', err => {
      reject(err);
    });
  });
}

module.exports = {
  checkRateLimit,
  setSecurityHeaders,
  parseJsonBody
};
