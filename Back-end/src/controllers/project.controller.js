const Project = require('../schemas/Project');
const cloudinary = require('cloudinary').v2;

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

    const newProject = new Project({
      title: title.trim(),
      description: description.trim(),
      image: req.file.path, // Cloudinary URL
      cloudinary_id: req.file.filename, // Cloudinary public_id
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
    // Delete uploaded image from Cloudinary if error occurs
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
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
      // Delete uploaded image from Cloudinary if not used
      if (req.file && req.file.filename) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update fields
    if (title && title.trim()) project.title = title.trim();
    if (description && description.trim())
      project.description = description.trim();
    if (liveUrl !== undefined) project.liveUrl = liveUrl.trim();
    if (githubUrl !== undefined) project.githubUrl = githubUrl.trim();

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
      // Delete old image from Cloudinary
      if (project.cloudinary_id) {
        await cloudinary.uploader.destroy(project.cloudinary_id);
      }
      // Set new image URL and ID
      project.image = req.file.path;
      project.cloudinary_id = req.file.filename;
    }

    await project.save();
    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    // Delete uploaded image from Cloudinary if error occurs
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/projects/:id - Admin only
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete image from Cloudinary
    if (project.cloudinary_id) {
      await cloudinary.uploader.destroy(project.cloudinary_id);
    }

    await project.deleteOne();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
