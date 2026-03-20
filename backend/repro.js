const mongoose = require('mongoose');
const Item = require('./src/models/Item');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project2';

async function run() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
            console.log('Connected to DB');
        }

        const userId = new mongoose.Types.ObjectId(); // Dummy user ID

        console.log('Creating 5 items sequentially...');
        for (let i = 0; i < 5; i++) {
            try {
                const item = await Item.create({
                    itemName: `Stress Test Item ${i}`,
                    category: 'StressTest',
                    quantity: 10 + i,
                    location: 'A1',
                    userId: userId
                });
                console.log(`Item ${i + 1} created: _id=${item._id}, sku=${item.sku}`);
            } catch (e) {
                console.error(`Failed to create item ${i + 1}:`, e.message);
                if (e.code === 11000) {
                    console.error('Duplicate key error details:', JSON.stringify(e.keyValue));
                }
            }
        }

        console.log('Finished creation loop.');

    } catch (err) {
        console.error('Global Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

run();
