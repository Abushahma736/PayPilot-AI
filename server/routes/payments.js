const express = require('express');
const { protect } = require('../middleware/auth');
const { createOrder, verifyPayment, getRazorpayKeyId, isDemo } = require('../services/paymentService');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const router = express.Router();

// GET /api/payments/key - Get Razorpay key ID (public key only, safe to expose)
router.get('/key', (req, res) => {
  res.json({
    keyId: getRazorpayKeyId(),
    isDemo: isDemo(),
  });
});

// POST /api/payments/create-order
router.post('/create-order', protect, async (req, res, next) => {
  try {
    const { amount, shippingAddress } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.address) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Get cart items for the order
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create payment order
    const paymentOrder = await createOrder(amount);

    // Create order in DB
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      totalAmount: amount,
      shippingAddress,
      razorpayOrderId: paymentOrder.id,
      paymentStatus: 'pending',
    });

    res.json({
      order: {
        id: order._id,
        razorpayOrderId: paymentOrder.id,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        isDemo: paymentOrder.isDemo,
      },
      keyId: getRazorpayKeyId(),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/verify
router.post('/verify', protect, async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (isValid) {
      order.paymentId = razorpayPaymentId;
      order.paymentStatus = isDemo() ? 'demo' : 'completed';
      order.status = 'confirmed';
      await order.save();

      // Clear cart after successful payment
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [], budget: null }
      );

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order: {
          id: order._id,
          status: order.status,
          paymentStatus: order.paymentStatus,
        },
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
