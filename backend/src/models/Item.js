// Mongoose model for inventory items
// Each item will have a unique SKU and a QR code that encodes the MongoDB _id

const mongoose = require('mongoose');
const QRCode = require('qrcode'); // npm install qrcode

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
      default: () =>
        `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    qrCode: {
      // Store a data URL string of the generated QR code image
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate QR code if not already set
itemSchema.pre('save', async function () {
  if (!this.qrCode) {
    try {
      // Encode either the _id or the SKU in the QR code
      const qrData = this._id.toString(); // or use this.sku
      this.qrCode = await QRCode.toDataURL(qrData);
    } catch (err) {
      console.error('Error generating QR code:', err.message);
      // Don’t call next(err) in async hooks — just throw
      throw err;
    }
  }
});

module.exports = mongoose.model('Item', itemSchema);
