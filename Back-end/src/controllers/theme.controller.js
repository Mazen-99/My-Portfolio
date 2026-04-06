const Theme = require('../schemas/Theme');

// GET Theme - GET /api/theme
exports.getTheme = async (req, res) => {
    try {
        let theme = await Theme.findOne();
        if (!theme) {
            // Seed a default if none exists
            theme = new Theme({
                lightPrimary: '#f97316',
                darkPrimary: '#f97316',
                lightDescription: '#64748b',
                darkDescription: '#cbd5e1',
                darkHeadline: '#ffffff',
                lightHeadline: '#0f172a',
                darkPrimarySection: '#0f172a',
                lightPrimarySection: '#f8fafc',
                darkSecondarySection: '#1e293b',
                lightSecondarySection: '#f1f5f9'
            });
            await theme.save();
        } else {
            // Migration check: Ensure new fields exist
            let updated = false;
            if (theme.primary && !theme.lightPrimary) { theme.lightPrimary = theme.primary; updated = true; }
            if (theme.primary && !theme.darkPrimary) { theme.darkPrimary = theme.primary; updated = true; }
            if (theme.description && !theme.lightDescription) { theme.lightDescription = theme.description; updated = true; }
            if (theme.description && !theme.darkDescription) { theme.darkDescription = theme.description; updated = true; }
            
            if (updated) await theme.save();
        }
        res.status(200).json(theme);
    } catch (error) {
        console.error('getTheme error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update Theme - POST /api/theme (admin only)
exports.setTheme = async (req, res) => {
    try {
        const { lightPrimary, darkPrimary, lightDescription, darkDescription, darkHeadline, lightHeadline, darkPrimarySection, lightPrimarySection, darkSecondarySection, lightSecondarySection } = req.body;

        let theme = await Theme.findOne();
        if (!theme) {
            theme = new Theme({
                lightPrimary, darkPrimary, lightDescription, darkDescription, darkHeadline, lightHeadline, darkPrimarySection, lightPrimarySection, darkSecondarySection, lightSecondarySection
            });
            await theme.save();
            res.status(201).json(theme);
        } else {
            theme.lightPrimary = lightPrimary;
            theme.darkPrimary = darkPrimary;
            theme.lightDescription = lightDescription;
            theme.darkDescription = darkDescription;

            theme.darkHeadline = darkHeadline;
            theme.lightHeadline = lightHeadline;
            
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