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

// Fixed Paths (one level up)
const itemRoutes = require('../src/routes/itemRoutes');
const authRoutes = require('../src/routes/authRoutes');
const contactRoutes = require('../src/routes/contactRoutes');

// Database Connection Logic (Kept from server.js)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project2';
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const maskedUri = MONGO_URI.replace(/\/\/.*@/, '//****:****@');
    console.log(`📡 Attempting to connect to MongoDB: ${maskedUri}`);
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error(err.stack);
  }
};

// Database Connection Middleware
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
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    res.json({ success: true, message: "MongoDB Connected ✅", result });
  } catch (error) {
    res.status(500).json({ success: false, message: "MongoDB NOT connected ❌", error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Inventory API is running via /api/index.js' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
