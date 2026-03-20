const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project2';

const Item = require('../models/Item');
const User = require('../models/User');
const Contact = require('../models/Contact');

async function clearData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log('Deleting all items...');
        await Item.deleteMany({});
        console.log('✅ Items deleted');

        console.log('Deleting all users...');
        await User.deleteMany({});
        console.log('✅ Users deleted');

        console.log('Deleting all contact submissions...');
        await Contact.deleteMany({});
        console.log('✅ Contact submissions deleted');

        console.log('✨ Database cleared successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error clearing data:', err.message);
        process.exit(1);
    }
}

clearData();
