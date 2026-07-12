const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    brand: String,
    size: String,
    price: Number,
    quantity: Number,
    imageUrl: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Bank Transfer' },
    shippingAddress: { type: String, required: true },
    status: { type: String, default: 'Waiting for Payment' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
