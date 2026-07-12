const CartItem = require('../models/CartItem');
const Order = require('../models/Order');

const USER_KEY = 'demo-user';

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const cartItems = await CartItem.find({ userKey: USER_KEY }).populate('product');

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const items = cartItems
      .filter((item) => item.product)
      .map((item) => ({
        product: item.product._id,
        name: item.product.name,
        brand: item.product.brand,
        size: item.size,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl
      }));

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 25000;
    const total = subtotal + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      shippingFee,
      total,
      paymentMethod: paymentMethod || 'Bank Transfer',
      shippingAddress,
      status: 'Waiting for Payment'
    });

    await CartItem.deleteMany({ userKey: USER_KEY });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders };
