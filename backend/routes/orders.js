const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    const order = new Order({
      userId: req.user.userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

router.get('/my', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/admin/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({ totalProducts, totalOrders, totalRevenue, pendingOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

router.get('/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'username email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (String(order.userId) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.put('/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});
router.put('/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});
module.exports = router;
