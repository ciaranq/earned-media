/**
 * Simple Rate Limiting Middleware
 * Prevents API abuse by limiting requests per IP
 */

const requestMap = new Map();

/**
 * Rate limiting configuration
 * @type {object}
 */
const CONFIG = {
  maxRequests: 50,        // Max requests per window
  windowMs: 15 * 60 * 1000, // 15-minute window
  cleanupInterval: 60 * 1000, // Clean old entries every minute
};

// Start cleanup interval
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestMap.entries()) {
    if (now - value.resetTime > CONFIG.windowMs) {
      requestMap.delete(key);
    }
  }
}, CONFIG.cleanupInterval);

/**
 * Rate limiter middleware for Next.js API routes
 * Usage: const isAllowed = rateLimiter(req);
 *
 * @param {object} req - Next.js request object
 * @returns {boolean} - true if request allowed, false if rate limited
 */
function rateLimiter(req) {
  // Get client IP (handle proxies like Vercel)
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown';

  const now = Date.now();
  const record = requestMap.get(ip);

  if (!record) {
    // First request from this IP
    requestMap.set(ip, {
      count: 1,
      resetTime: now,
    });
    return true;
  }

  // Check if window has expired
  if (now - record.resetTime > CONFIG.windowMs) {
    record.count = 1;
    record.resetTime = now;
    return true;
  }

  // Check if limit exceeded
  if (record.count >= CONFIG.maxRequests) {
    return false;
  }

  // Increment counter
  record.count++;
  return true;
}

/**
 * Get remaining requests for an IP
 * @param {object} req - Next.js request object
 * @returns {number} - Remaining requests in current window
 */
function getRemainingRequests(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown';

  const record = requestMap.get(ip);
  if (!record) return CONFIG.maxRequests;

  const now = Date.now();
  if (now - record.resetTime > CONFIG.windowMs) {
    return CONFIG.maxRequests;
  }

  return Math.max(0, CONFIG.maxRequests - record.count);
}

module.exports = {
  rateLimiter,
  getRemainingRequests,
  CONFIG,
};
