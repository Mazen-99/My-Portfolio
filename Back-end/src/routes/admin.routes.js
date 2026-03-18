const adminAuth = require('../middleware/adminAuth');
const { adminLimiter } = require('../middleware/rateLimit');

// POST /api/admin/check - Check if admin password is correct
const checkAdmin = (req, res) => {
  // If adminAuth middleware passes, password is correct
  res.status(200).json({ message: 'Authorized' });
};

module.exports = (express) => {
  const router = express.Router();

  // Admin check endpoint with rate limiting
  router.post('/check', adminLimiter, adminAuth, checkAdmin);

  return router;
};
