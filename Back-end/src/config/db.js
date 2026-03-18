require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to Database');
  } catch (error) {
    console.error('❌ Failed to connect to Database:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
