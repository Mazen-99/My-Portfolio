const adminAuth = require('../middleware/adminAuth');
const { adminLimiter } = require('../middleware/rateLimit');
const { trackVisit, getVisitors, deleteVisitor, deleteAllVisitors } = require('../controllers/admin.controller');

// POST /api/admin/check - Check if admin password is correct
const checkAdmin = (req, res) => {
  // If adminAuth middleware passes, password is correct
  res.status(200).json({ message: 'Authorized' });
};

module.exports = (express) => {
  const router = express.Router();

  // Public endpoint to track visit
  router.post('/track-visit', trackVisit);

  // Admin check endpoint
  router.post('/check', adminLimiter, adminAuth, checkAdmin);

  // Admin Visitors Endpoints
  router.get('/visitors', adminAuth, getVisitors);
  router.delete('/visitors', adminAuth, deleteAllVisitors);
  router.delete('/visitors/:id', adminAuth, deleteVisitor);

  return router;
};
