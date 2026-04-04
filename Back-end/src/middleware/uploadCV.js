const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'cv')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.memoryStorage()

function fileFilter(req, file, cb) {
  const isPdf = file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf'
  if (!isPdf) {
    const err = new Error('Only PDF files are allowed')
    err.status = 400
    return cb(err)
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
})

module.exports = upload