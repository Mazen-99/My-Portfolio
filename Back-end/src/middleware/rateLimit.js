const rateLimit = require('express-rate-limit');

// Rate limiter for admin routes: 5 attempts per 10 minutes
const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many attempts, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for contact form: 5 requests per 10 minutes
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many contact requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  adminLimiter,
  contactLimiter,
};
