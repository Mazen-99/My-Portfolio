const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  primary: { type: String, required: true },
  headline: { type: String, required: true },
  description: { type: String, required: true },
  primarySection: { type: String, required: true },
  secondarySection: { type: String, required: true },
});

module.exports = mongoose.model('Theme', themeSchema);
