const upload = require('../middleware/uploadCV')
const { uploadCV, downloadCV, deleteCV } = require('../controllers/uploadCV.controller')
const adminAuth = require('../middleware/adminAuth')

module.exports = (express) => {
    const router = express.Router()

    // POST /api/cv - admin
    router.post('/', adminAuth, upload.single('cv'), uploadCV)

    // GET /api/cv - public
    router.get('/', downloadCV)

    // DELETE /api/cv - admin
    router.delete('/', adminAuth, deleteCV)

    return router
}
