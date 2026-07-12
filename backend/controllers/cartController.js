const Product = require('../models/Product');
const CartItem = require('../models/CartItem');

const USER_KEY = 'demo-user';

const getCart = async (req, res) => {
  try {
    const items = await CartItem.find({ userKey: USER_KEY })
      .populate('product')
      .sort({ createdAt: -1 });

    const validItems = items.filter((item) => item.product);
    const subtotal = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    res.json({ success: true, count: validItems.length, subtotal, data: validItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const selectedSize = size || product.sizes[0] || 'All Size';
    const selectedQuantity = Math.max(Number(quantity) || 1, 1);

    if (product.sizes.length > 0 && !product.sizes.includes(selectedSize)) {
      return res.status(400).json({ success: false, message: 'Selected size is not available' });
    }

    const existing = await CartItem.findOne({ userKey: USER_KEY, product: productId, size: selectedSize });

    if (existing) {
      existing.quantity += selectedQuantity;
      await existing.save();
      const populated = await existing.populate('product');
      return res.status(200).json({ success: true, message: 'Cart item quantity updated', data: populated });
    }

    const item = await CartItem.create({
      userKey: USER_KEY,
      product: productId,
      size: selectedSize,
      quantity: selectedQuantity
    });

    const populated = await item.populate('product');
    res.status(201).json({ success: true, message: 'Product added to cart', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity, size } = req.body;

    const item = await CartItem.findOne({ _id: req.params.id, userKey: USER_KEY });
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });

    if (quantity !== undefined) {
      const newQuantity = Number(quantity);
      if (newQuantity < 1) return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
      item.quantity = newQuantity;
    }

    if (size) {
      const product = await Product.findById(item.product);
      if (product.sizes.length > 0 && !product.sizes.includes(size)) {
        return res.status(400).json({ success: false, message: 'Selected size is not available' });
      }
      item.size = size;
    }

    await item.save();
    const populated = await item.populate('product');
    res.json({ success: true, message: 'Cart item updated', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const item = await CartItem.findOneAndDelete({ _id: req.params.id, userKey: USER_KEY });
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });

    res.json({ success: true, message: 'Cart item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ userKey: USER_KEY });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, deleteCartItem, clearCart };
