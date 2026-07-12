const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema(
  {
    userKey: { type: String, default: 'demo-user' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
  },
  { timestamps: true }
);

wishlistItemSchema.index({ userKey: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);
