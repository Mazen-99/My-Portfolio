const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller')
const adminAuth = require('../middleware/adminAuth')
const upload = require('../config/multer')

module.exports = (express) => {
  const router = express.Router()

  // GET /api/projects - Public endpoint to fetch all projects
  router.get('/', getProjects)

  // POST /api/projects - Admin only endpoint with file upload
  router.post('/', adminAuth, upload.single('image'), createProject)

  // PUT /api/projects/:id - Admin only endpoint with optional file upload
  router.put('/:id', adminAuth, upload.single('image'), updateProject)

  // DELETE /api/projects/:id - Admin only endpoint
  router.delete('/:id', adminAuth, deleteProject)

  return router
}
