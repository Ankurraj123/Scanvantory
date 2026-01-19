

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


app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);


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

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project2';
const PORT = process.env.PORT || 5000;

// Database Connection Function
let isConnected = false; // Track connection state

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Only listen if strict development or run directly
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  });
}

module.exports = app;
