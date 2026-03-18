const { sendContact, sendOTP } = require('../controllers/contact.controller');
const { contactLimiter } = require('../middleware/rateLimit');

module.exports = (express) => {
  const router = express.Router();

  // POST /api/contact/send-otp - send verification code
  router.post('/send-otp', contactLimiter, sendOTP);

  // POST /api/contact - Public endpoint with rate limiting
  router.post('/', contactLimiter, sendContact);

  return router;
};
