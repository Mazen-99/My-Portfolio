const Project = require('../schemas/Project');
const fs = require('fs');
const path = require('path');

// GET /api/projects - Public endpoint
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/projects - Admin only
exports.createProject = async (req, res) => {
  try {
    const { title, description, liveUrl, githubUrl } = req.body;
    let techStack = req.body.techStack || [];

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Parse techStack if it's a string (from form data)
    if (typeof techStack === 'string') {
      techStack = JSON.parse(techStack);
    }

    // Ensure techStack is an array
    if (!Array.isArray(techStack)) {
      techStack = [];
    }

    // Create full image URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/projects/${req.file.filename}`;

    const newProject = new Project({
      title: title.trim(),
      description: description.trim(),
      image: imageUrl,
      liveUrl: liveUrl ? liveUrl.trim() : '',
      githubUrl: githubUrl ? githubUrl.trim() : '',
      techStack,
    });

    await newProject.save();
    res.status(201).json({
      message: 'Project created successfully',
      project: newProject,
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/projects/:id - Admin only
exports.updateProject = async (req, res) => {
  try {
    const { title, description, liveUrl, githubUrl } = req.body;
    let techStack = req.body.techStack || [];

    // Find project
    const project = await Project.findById(req.params.id);
    if (!project) {
      // Delete uploaded file if error occurs
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update fields
    if (title && title.trim()) project.title = title.trim();
    if (description && description.trim())
      project.description = description.trim();
    if (liveUrl) project.liveUrl = liveUrl.trim();
    if (githubUrl) project.githubUrl = githubUrl.trim();

    // Update techStack
    if (techStack) {
      if (typeof techStack === 'string') {
        techStack = JSON.parse(techStack);
      }
      if (Array.isArray(techStack)) {
        project.techStack = techStack;
      }
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if it exists
      if (project.image) {
        const oldImageFileName = project.image.split('/').pop();
        const oldImagePath = path.join(
          __dirname,
          '../../uploads/projects',
          oldImageFileName,
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      // Set new image URL with full URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      project.image = `${baseUrl}/uploads/projects/${req.file.filename}`;
    }

    await project.save();
    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/projects/:id - Admin only
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete image from filesystem
    if (project.image) {
      // Extract filename from URL
      const imageFileName = project.image.split('/').pop();
      const imagePath = path.join(
        __dirname,
        '../../uploads/projects',
        imageFileName,
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
