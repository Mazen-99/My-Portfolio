const Theme = require('../schemas/Theme');

// Get Theme - GET /api/theme
exports.getTheme = async (req, res) => {
    try {
        const theme = await Theme.findOne();
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        res.status(200).json(theme);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update Theme - POST /api/theme (admin only)
exports.setTheme = async (req, res) => {
    try {
        const { primary, headline, description, primarySection, secondarySection } = req.body;

        if (!primary || !headline || !description || !primarySection || !secondarySection) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const theme = await Theme.findOne();
        if (!theme) {
            const newTheme = new Theme({
                primary,
                headline,
                description,
                primarySection,
                secondarySection,
            });
            await newTheme.save();
            res.status(201).json(newTheme);
        } else {
            theme.primary = primary;
            theme.headline = headline;
            theme.description = description;
            theme.primarySection = primarySection;
            theme.secondarySection = secondarySection;
            await theme.save();
            res.status(200).json({ message: 'Theme updated successfully', theme });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}