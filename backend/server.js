

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

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Only listen if strict development or run directly
    if (require.main === module) {
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    // Vercel might not like process.exit, but okay for dev
    if (require.main === module) process.exit(1);
  });

module.exports = app;
