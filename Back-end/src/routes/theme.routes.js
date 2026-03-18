const { getTheme, setTheme } = require('../controllers/theme.controller')
const adminAuth = require('../middleware/adminAuth')

module.exports = (express) => {
    const router = express.Router()

    // GET /api/theme - Public endpoint to fetch theme data
    router.get('/', getTheme)

    // POST /api/theme - Admin only endpoint to set theme data
    router.post('/', adminAuth, setTheme)

    return router
}