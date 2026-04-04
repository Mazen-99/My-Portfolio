const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
})

const AboutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  titles: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skills: {
    type: [skillSchema],
    default: [],
  },
  skillCategories: {
    type: [String],
  },
  cv: {
    type: String,
    default: null,
  },
  socials: {
    whatsapp: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    facebook: { type: String, default: '' },
    github: { type: String, default: '' }
  }
})

module.exports = mongoose.model('About', AboutSchema)
