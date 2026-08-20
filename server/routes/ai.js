const express = require('express');
const { protect } = require('../middleware/auth');
const { processShoppingQuery } = require('../services/aiService');
const AIInteraction = require('../models/AIInteraction');
const Order = require('../models/Order');

const router = express.Router();

// POST /api/ai/chat - Process a shopping query
router.post('/chat', protect, async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const result = await processShoppingQuery(query);

    // Save interaction to history
    const interaction = await AIInteraction.create({
      user: req.user._id,
      query,
      category: result.category,
      budget: result.budget,
      preferences: result.preferences,
      recommendedProducts: result.recommendations.map(r => r.product._id || r.product),
      reasoning: result.reasoning,
      response: result,
    });

    res.json({
      id: interaction._id,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/ai/history - Get user's AI interaction history
router.get('/history', protect, async (req, res, next) => {
  try {
    const interactions = await AIInteraction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('recommendedProducts');
    res.json(interactions);
  } catch (error) {
    next(error);
  }
});

// GET /api/ai/insights - Get AI insights and stats
router.get('/insights', protect, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get order stats
    const orders = await Order.find({ user: userId, paymentStatus: { $in: ['completed', 'demo'] } });
    const totalPurchases = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgOrderValue = totalPurchases > 0 ? Math.round(totalSpent / totalPurchases) : 0;

    // Get AI interaction stats
    const interactions = await AIInteraction.find({ user: userId });
    const totalInteractions = interactions.length;

    // Most searched category
    const categoryCounts = {};
    interactions.forEach(i => {
      if (i.category) {
        categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
      }
    });
    const mostSearchedCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Estimate money saved (sum of budget - actual spent where budget was set)
    let moneySaved = 0;
    interactions.forEach(i => {
      if (i.budget && i.response?.recommendations?.length > 0) {
        const cheapestRecommended = Math.min(
          ...i.response.recommendations
            .map(r => r.product?.price || Infinity)
            .filter(p => p !== Infinity)
        );
        if (cheapestRecommended < i.budget) {
          moneySaved += (i.budget - cheapestRecommended);
        }
      }
    });

    res.json({
      totalPurchases,
      totalSpent,
      avgOrderValue,
      totalInteractions,
      mostSearchedCategory,
      moneySaved: Math.round(moneySaved),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
