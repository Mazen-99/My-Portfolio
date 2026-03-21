require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/db')
const path = require('path')

// Initialize Express app
const app = express()

// Middleware
app.use(cors({
  origin: 'https://mazen-ahmed-portfolio.vercel.app',
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Connect to MongoDB
connectDB()

// Import routes
const adminRoutes = require('./src/routes/admin.routes')
const aboutRoutes = require('./src/routes/about.routes')
const projectRoutes = require('./src/routes/project.routes')
const contactRoutes = require('./src/routes/contact.routes')
const uploadCVRoutes = require('./src/routes/uploadCV.routes')
const themeRoutes = require('./src/routes/theme.routes')
const serviceRoutes = require('./src/routes/service.routes')

// Register routes
app.use('/api/admin', adminRoutes(express))
app.use('/api/about', aboutRoutes(express))
app.use('/api/projects', projectRoutes(express))
app.use('/api/theme', themeRoutes(express))
app.use('/api/contact', contactRoutes(express))
app.use('/api/cv', uploadCVRoutes(express))
app.use('/api/services', serviceRoutes(express))

app.use('/uploads', express.static(path.join(__dirname, "uploads")))

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  // Multer file type / size errors
  if (err && (err.name === 'MulterError' || err.message === 'Only PDF files are allowed' || err.status === 400)) {
    return res.status(err.status || 400).json({ message: err.message || 'Invalid file upload' })
  }
  res.status(500).json({ message: 'Internal server error' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
