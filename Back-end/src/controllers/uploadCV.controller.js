const fs = require('fs')
const path = require('path')
const About = require('../schemas/About')
const uploadsBase = path.join(__dirname, '..', '..', 'uploads')
const cvRelativePath = path.join('cv', 'cv.pdf')

function getBaseUrl(req) {
    const envBase = (process.env.BASE_URL || '').replace(/\/$/, '')
    if (envBase) return envBase
    return `${req.protocol}://${req.get('host')}`
}

// Upload CV - POST /api/cv (admin only)
exports.uploadCV = async (req, res, next) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'No file uploaded. Please attach a PDF file under the field name "cv".' })
        }

        const cvDir = path.join(uploadsBase, 'cv')
        fs.mkdirSync(cvDir, { recursive: true })

        const about = await About.findOne()
        if (!about) {
            return res.status(500).json({ message: 'About document not found. Create an About document before uploading a CV.' })
        }

        if (about.cv) {
            try {
                const parsed = new URL(about.cv)
                const existingPath = path.join(__dirname, '..', '..', parsed.pathname)
                if (fs.existsSync(existingPath)) {
                    fs.unlinkSync(existingPath)
                }
            } catch (e) {
                const fallback = path.join(uploadsBase, 'cv', 'cv.pdf')
                if (fs.existsSync(fallback)) {
                    try { fs.unlinkSync(fallback) } catch (er) { }
                }
            }
        }

        const destPath = path.join(cvDir, 'cv.pdf')
        fs.writeFileSync(destPath, req.file.buffer)

        const baseUrl = getBaseUrl(req)
        const publicUrl = `${baseUrl.replace(/\/$/, '')}/uploads/cv/cv.pdf`

        about.cv = publicUrl
        await about.save()

        return res.status(200).json({ message: 'CV uploaded successfully', cv: publicUrl })
    } catch (err) {
        next(err)
    }
}

// Download CV - GET /api/cv (public)
exports.downloadCV = async (req, res, next) => {
    try {
        const about = await About.findOne()
        if (!about || !about.cv) {
            return res.status(404).json({ message: 'CV not found' })
        }

        let filePath
        try {
            const parsed = new URL(about.cv)
            filePath = path.join(__dirname, '..', '..', parsed.pathname)
        } catch (e) {
            filePath = path.join(uploadsBase, 'cv', 'cv.pdf')
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'CV file not found on server' })
        }

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="Mazen Ahmed CV.pdf"')
        return res.download(filePath, 'Mazen Ahmed CV.pdf', (err) => {
            if (err) return next(err)
        })
    } catch (err) {
        next(err)
    }
}

// Delete CV - DELETE /api/cv (admin only)
exports.deleteCV = async (req, res, next) => {
    try {
        const about = await About.findOne()
        if (!about || !about.cv) {
            return res.status(404).json({ message: 'CV not found' })
        }

        // Delete file from disk
        try {
            const parsed = new URL(about.cv)
            const filePath = path.join(__dirname, '..', '..', parsed.pathname)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        } catch (e) {
            // Fallback: try deleting from default location
            const fallback = path.join(uploadsBase, 'cv', 'cv.pdf')
            if (fs.existsSync(fallback)) {
                try { fs.unlinkSync(fallback) } catch (er) { }
            }
        }

        // Remove CV from database
        about.cv = null
        await about.save()

        return res.status(200).json({ message: 'CV deleted successfully' })
    } catch (err) {
        next(err)
    }
}
