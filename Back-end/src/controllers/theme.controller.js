const Theme = require('../schemas/Theme');

// GET Theme - GET /api/theme
exports.getTheme = async (req, res) => {
    try {
        let theme = await Theme.findOne();
        if (!theme) {
            // Seed a default if none exists
            theme = new Theme({
                primary: '#f97316',
                darkHeadline: '#ffffff',
                lightHeadline: '#0f172a',
                description: '#cbd5e1',
                darkPrimarySection: '#0f172a',
                lightPrimarySection: '#f8fafc',
                darkSecondarySection: '#1e293b',
                lightSecondarySection: '#f1f5f9'
            });
            await theme.save();
        }
        res.status(200).json(theme);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update Theme - POST /api/theme (admin only)
exports.setTheme = async (req, res) => {
    try {
        const { primary, darkHeadline, lightHeadline, description, darkPrimarySection, lightPrimarySection, darkSecondarySection, lightSecondarySection } = req.body;

        const theme = await Theme.findOne();
        if (!theme) {
            const newTheme = new Theme({
                primary, darkHeadline, lightHeadline, description, darkPrimarySection, lightPrimarySection, darkSecondarySection, lightSecondarySection
            });
            await newTheme.save();
            res.status(201).json(newTheme);
        } else {
            theme.primary = primary;
            theme.darkHeadline = darkHeadline;
            theme.lightHeadline = lightHeadline;
            theme.description = description;

            theme.darkPrimarySection = darkPrimarySection;
            theme.lightPrimarySection = lightPrimarySection;
            theme.darkSecondarySection = darkSecondarySection;
            theme.lightSecondarySection = lightSecondarySection;
            await theme.save();
            res.status(200).json({ message: 'Theme updated successfully', theme });
        }
    } catch (error) {
        console.error('setTheme error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}