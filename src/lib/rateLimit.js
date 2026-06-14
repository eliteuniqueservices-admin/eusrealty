// Lightweight sliding-window rate-limiting utility for Next.js Route Handlers

const trackingMap = new Map();

// Periodic cleanup of stale IPs to prevent memory leaks
if (typeof global !== 'undefined') {
  if (!global.rateLimitCleanupInterval) {
    global.rateLimitCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of trackingMap.entries()) {
        // Remove timestamps older than 10 minutes
        const validTimestamps = timestamps.filter(ts => now - ts < 600000);
        if (validTimestamps.length === 0) {
          trackingMap.delete(key);
        } else {
          trackingMap.set(key, validTimestamps);
        }
      }
    }, 120000); // Run cleanup every 2 minutes
    
    if (global.rateLimitCleanupInterval.unref) {
      global.rateLimitCleanupInterval.unref();
    }
  }
}

/**
 * Checks if a given IP has exceeded the allowed rate limit.
 * @param {string} ip - Client IP address
 * @param {number} limit - Allowed request count within the window
 * @param {number} windowMs - Window duration in milliseconds (default: 60000ms / 1 min)
 * @returns {boolean} - True if the request is rate-limited, false otherwise
 */
export function isRateLimited(ip, limit = 10, windowMs = 60000) {
  if (!ip) return false; // Fail open if IP cannot be determined, or apply strict mode
  
  const now = Date.now();
  if (!trackingMap.has(ip)) {
    trackingMap.set(ip, [now]);
    return false;
  }

  const timestamps = trackingMap.get(ip);
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (validTimestamps.length >= limit) {
    trackingMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  trackingMap.set(ip, validTimestamps);
  return false;
}
