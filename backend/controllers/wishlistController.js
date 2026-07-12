const Product = require('../models/Product');
const WishlistItem = require('../models/WishlistItem');

const USER_KEY = 'demo-user';

const getWishlist = async (req, res) => {
  try {
    const items = await WishlistItem.find({ userKey: USER_KEY })
      .populate('product')
      .sort({ createdAt: -1 });

    const validItems = items.filter((item) => item.product);
    res.json({ success: true, count: validItems.length, data: validItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const existing = await WishlistItem.findOne({ userKey: USER_KEY, product: productId });
    if (existing) {
      const populatedExisting = await existing.populate('product');
      return res.status(200).json({ success: true, message: 'Product already exists in wishlist', data: populatedExisting });
    }

    const item = await WishlistItem.create({ userKey: USER_KEY, product: productId });
    const populated = await item.populate('product');

    res.status(201).json({ success: true, message: 'Product added to wishlist', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteWishlistItem = async (req, res) => {
  try {
    const deleted = await WishlistItem.findOneAndDelete({ userKey: USER_KEY, product: req.params.productId });

    if (!deleted) return res.status(404).json({ success: false, message: 'Wishlist item not found' });

    res.json({ success: true, message: 'Wishlist item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, deleteWishlistItem };
