const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    userKey: { type: String, default: 'demo-user' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, default: 'All Size' },
    quantity: { type: Number, required: true, min: 1, default: 1 }
  },
  { timestamps: true }
);

cartItemSchema.index({ userKey: 1, product: 1, size: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
