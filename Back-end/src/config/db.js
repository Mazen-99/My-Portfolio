require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const mongoUrl = process.env.MONGO_URI;
  if (!mongoUrl) {
    throw new Error("MONGO_URI environment variable is MISSING! Did you add it to Vercel/Netlify?");
  }

  try {
    mongoose.set('strictQuery', false)
    mongoose.set('bufferCommands', false)
    await mongoose.connect(mongoUrl, {
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    })
    console.log("Connected to MongoDB ✅")
  }
  catch (err) {
    console.error("Database Connection Error ❌:", err.message)
    throw err;
  }
}

module.exports = connectDB;
