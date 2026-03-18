const { getAbout, updateAbout } = require('../controllers/about.controller');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const upload = multer({
  limits: { fieldSize: 50 * 1024 * 1024 } // 50MB limit for text fields
});

module.exports = (express) => {
  const router = express.Router();

  // GET /api/about - Public endpoint
  router.get('/', getAbout);

  // PUT /api/about - Admin only endpoint
  router.put('/', adminAuth, upload.any(), updateAbout);

  return router;
};
