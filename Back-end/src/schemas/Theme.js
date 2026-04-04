const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  primary: { type: String, required: true },
  darkHeadline: { type: String, required: true },
  lightHeadline: { type: String, required: true },
  description: { type: String, required: true },
  darkPrimarySection: { type: String, required: true },
  lightPrimarySection: { type: String, required: true },
  darkSecondarySection: { type: String, required: true },
  lightSecondarySection: { type: String, required: true },
});

module.exports = mongoose.model('Theme', themeSchema);
