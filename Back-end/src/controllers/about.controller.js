const About = require('../schemas/About');

// GET /api/about
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: 'About information not found' });
    }
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/about
exports.updateAbout = async (req, res) => {
  try {
    let { name, phone, email, titles, bio, description, skills, skillCategories, cv, socials } = req.body;

    // Handle FormData stringified fields
    if (typeof titles === 'string') {
      try { titles = JSON.parse(titles); } catch (e) { /* use as is */ }
    }
    if (typeof skills === 'string') {
      try { skills = JSON.parse(skills); } catch (e) { /* use as is */ }
    }
    if (typeof socials === 'string') {
      try { socials = JSON.parse(socials); } catch (e) { /* use as is */ }
    }
    if (typeof skillCategories === 'string') {
      try { skillCategories = JSON.parse(skillCategories); } catch (e) { /* use as is */ }
    }

    if (skills && Array.isArray(skills)) {
      for (const skill of skills) {
        if (!skill.name || !skill.icon || !skill.category) {
          return res.status(400).json({
            message: 'Each skill must have a name, icon, and category',
          });
        }
      }
    }

    let about = await About.findOne();

    if (!about) {
      about = new About({
        name,
        phone,
        email,
        titles,
        bio,
        description,
        skills,
        skillCategories,
        cv,
        socials
      });
    } else {
      about.name = name;
      about.phone = phone;
      about.email = email;
      about.titles = titles;
      about.bio = bio;
      about.description = description;
      if (skills) about.skills = skills;
      if (skillCategories) about.skillCategories = skillCategories;
      if (cv !== undefined) about.cv = cv;
      if (socials) about.socials = socials;
    }

    await about.save();

    res.status(200).json({
      message: 'About updated successfully',
      about,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
