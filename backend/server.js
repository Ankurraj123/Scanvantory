

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


const itemRoutes = require('./src/routes/itemRoutes');
const authRoutes = require('./src/routes/authRoutes');
const contactRoutes = require('./src/routes/contactRoutes');


// Database Connection Middleware (MUST be before routes)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Test DB Endpoint
app.get("/test-db", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    // Ensure we are connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();

    res.json({
      success: true,
      message: "MongoDB Connected ✅",
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "MongoDB NOT connected ❌",
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});


app.get('/', (req, res) => {
  res.json({ success: true, message: 'Inventory API is running' });
});


app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});


app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project2';
const PORT = process.env.PORT || 5000;

// Production Check: MONGO_URI logic
if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
  if (!process.env.MONGO_URI) {
    console.error('❌ CRITICAL ERROR: MONGO_URI environment variable is MISSING!');
    console.error('⚠️ The backend is currently using the DEFAULT localhost address, which will NOT work on Vercel.');
    console.error('👉 ACTION REQUIRED: Add MONGO_URI to your Vercel Project Settings.');
  } else if (process.env.MONGO_URI.includes('localhost')) {
    console.warn('⚠️ WARNING: MONGO_URI is pointing to localhost in a production environment.');
  }
}

// Database Connection Function
let isConnected = false; // Track connection state

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    // Basic diagnostic: show URI format (masked)
    const maskedUri = MONGO_URI.replace(/\/\/.*@/, '//****:****@');
    console.log(`📡 Attempting to connect to MongoDB: ${maskedUri}`);

    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Log full stack in production to help diagnose Vercel issues
    if (process.env.NODE_ENV === 'production' || !process.env.NODE_ENV) {
      console.error(err.stack);
    }
  }
};

// Database Connection Logic removed from here (it's handled above)

// Only listen if strict development or run directly
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  });
}

module.exports = app;
