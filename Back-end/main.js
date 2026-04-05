require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/db')
const path = require('path')

// Initialize Express app
const app = express()

// Middleware
app.set('trust proxy', 1)
app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Import routes
const adminRoutes = require('./src/routes/admin.routes')
const aboutRoutes = require('./src/routes/about.routes')
const projectRoutes = require('./src/routes/project.routes')
const contactRoutes = require('./src/routes/contact.routes')
const uploadCVRoutes = require('./src/routes/uploadCV.routes')
const themeRoutes = require('./src/routes/theme.routes')
const serviceRoutes = require('./src/routes/service.routes')

// Global DB connection middleware (ensures connection is ready for serverless requests)
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    res.status(500).json({ 
      message: 'Database connection failed ❌', 
      error: err.message,
      tip: "Make sure MONGO_URI is set and IP Whitelisting is open (0.0.0.0/0)" 
    })
  }
})

// Register routes
app.use('/api/admin', adminRoutes(express))
app.use('/api/about', aboutRoutes(express))
app.use('/api/projects', projectRoutes(express))
app.use('/api/theme', themeRoutes(express))
app.use('/api/contact', contactRoutes(express))
app.use('/api/cv', uploadCVRoutes(express))
app.use('/api/services', serviceRoutes(express))

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running ✅' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  if (err && (err.name === 'MulterError' || err.message === 'Only PDF files are allowed' || err.status === 400)) {
    return res.status(err.status || 400).json({ message: err.message || 'Invalid file upload' })
  }
  res.status(500).json({ message: 'Internal server error' })
})

// Export app instance (Required for Vercel)
module.exports = app

// Only listen locally, Vercel handles this via exports
const PORT = process.env.PORT || 5000
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && !process.env.VERCEL_ENV) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/ ✅`)
  })
}
