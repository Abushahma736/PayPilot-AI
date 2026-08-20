const Product = require('../models/Product');

// Check if OpenAI is available
let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    const OpenAI = require('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('OpenAI API initialized');
  } else {
    console.log('OpenAI API key not set - using fallback AI engine');
  }
} catch (e) {
  console.log('OpenAI module not available - using fallback AI engine');
}

// ---- KEYWORD EXTRACTION HELPERS ----

const categoryKeywords = {
  Electronics: ['headphone', 'headphones', 'earphone', 'earbuds', 'speaker', 'bluetooth', 'wireless', 'charger', 'cable', 'power bank', 'phone', 'tablet', 'laptop', 'monitor', 'keyboard', 'mouse', 'camera', 'smartwatch', 'watch', 'electronic'],
  Accessories: ['bag', 'backpack', 'wallet', 'case', 'cover', 'stand', 'holder', 'accessories', 'accessory', 'sunglasses', 'belt', 'strap'],
  Gaming: ['gaming', 'game', 'controller', 'gamepad', 'joystick', 'console', 'gamer', 'rgb', 'mechanical keyboard', 'gaming mouse', 'gaming headset'],
  Home: ['home', 'lamp', 'light', 'fan', 'pillow', 'blanket', 'mug', 'bottle', 'kitchen', 'decor', 'decoration', 'organizer', 'storage', 'diffuser', 'candle'],
  Fashion: ['shirt', 'tshirt', 't-shirt', 'shoes', 'sneakers', 'jacket', 'hoodie', 'jeans', 'pants', 'dress', 'fashion', 'clothing', 'wear', 'cap', 'hat', 'scarf'],
};

function extractBudget(query) {
  // Handle "3k", "3.5k", "10k" shorthand
  const kMatch = /(?:under|below|within|max|maximum|budget|upto|up to|around)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*k\b/i.exec(query);
  if (kMatch) {
    return Math.round(parseFloat(kMatch[1]) * 1000);
  }

  // Match patterns like ₹3000, Rs 3000, Rs.3000, 3000 rupees, under 5000, below 2000, budget 3000
  const patterns = [
    /(?:under|below|within|max|maximum|budget|upto|up to|around|approx|near)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/gi,
    /(?:₹|rs\.?|inr)\s*(\d[\d,]*)/gi,
    /(\d[\d,]*)\s*(?:₹|rs|rupees|inr)/gi,
    /budget\s*(?:is|of|:)?\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/gi,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(query);
    if (match) {
      const val = parseInt(match[1].replace(/,/g, ''), 10);
      if (!isNaN(val) && val > 0) return val;
    }
  }
  return null;
}

function extractCategory(query) {
  const lower = query.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword) && keyword.length > bestScore) {
        bestMatch = category;
        bestScore = keyword.length;
      }
    }
  }
  return bestMatch;
}

function extractPreferences(query) {
  const preferences = [];
  const lower = query.toLowerCase();

  const prefKeywords = {
    'good battery': 'Long battery life',
    'battery life': 'Long battery life',
    'long battery': 'Long battery life',
    'noise cancel': 'Noise cancellation',
    'anc': 'Active Noise Cancellation',
    'lightweight': 'Lightweight design',
    'light weight': 'Lightweight design',
    'comfortable': 'Comfortable fit',
    'durable': 'Durable build',
    'waterproof': 'Waterproof',
    'water resistant': 'Water resistant',
    'fast charging': 'Fast charging support',
    'premium': 'Premium quality',
    'portable': 'Portable design',
    'bass': 'Good bass quality',
    'good sound': 'Good sound quality',
    'sound quality': 'Good sound quality',
    'mic': 'Built-in microphone',
    'microphone': 'Built-in microphone',
    'rgb': 'RGB lighting',
    'wireless': 'Wireless connectivity',
    'bluetooth': 'Bluetooth enabled',
    'stylish': 'Stylish design',
    'compact': 'Compact size',
    'high quality': 'High quality',
    'value for money': 'Good value for money',
    'good rating': 'Highly rated',
    'top rated': 'Highly rated',
    'best': 'Top rated',
  };

  for (const [keyword, pref] of Object.entries(prefKeywords)) {
    if (lower.includes(keyword) && !preferences.includes(pref)) {
      preferences.push(pref);
    }
  }

  return preferences.length > 0 ? preferences : ['Good value for money', 'Highly rated'];
}

// ---- SCORING & RECOMMENDATION ----

function scoreProduct(product, budget, preferences, searchTerms) {
  let score = 0;

  // Price within budget is heavily weighted
  if (budget) {
    if (product.price <= budget) {
      score += 30;
      // Reward products closer to budget (better value)
      const priceRatio = product.price / budget;
      if (priceRatio >= 0.5 && priceRatio <= 1.0) score += 20;
      if (priceRatio >= 0.7) score += 10;
    } else {
      score -= 20;
    }
  }

  // Rating bonus
  score += product.rating * 5;

  // Keyword match in name/description
  const productText = `${product.name} ${product.description} ${product.features.join(' ')}`.toLowerCase();
  for (const term of searchTerms) {
    if (productText.includes(term.toLowerCase())) {
      score += 10;
    }
  }

  // Feature match with preferences
  for (const pref of preferences) {
    if (productText.includes(pref.toLowerCase())) {
      score += 8;
    }
  }

  return score;
}

function generateReasoning(product, budget, preferences) {
  const reasons = [];

  if (budget && product.price <= budget) {
    reasons.push(`✅ Within budget (₹${product.price.toLocaleString('en-IN')} of ₹${budget.toLocaleString('en-IN')})`);
    const savings = budget - product.price;
    if (savings > 0) reasons.push(`💰 Saves ₹${savings.toLocaleString('en-IN')} from budget`);
  } else if (budget) {
    reasons.push(`⚠️ Exceeds budget by ₹${(product.price - budget).toLocaleString('en-IN')}`);
  }

  if (product.rating >= 4) reasons.push(`⭐ Highly rated (${product.rating}/5 from ${product.ratingCount} reviews)`);
  if (product.rating >= 4.5) reasons.push('🏆 Top rated in category');

  if (product.features && product.features.length > 0) {
    const matchedFeatures = product.features.filter(f => {
      return preferences.some(p => f.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(f.toLowerCase()));
    });
    if (matchedFeatures.length > 0) {
      reasons.push(`✨ Matches preferences: ${matchedFeatures.join(', ')}`);
    }
  }

  reasons.push(`🏷️ Brand: ${product.brand}`);
  
  return reasons.join('\n');
}

// ---- MAIN AI FUNCTIONS ----

async function processWithOpenAI(query, products) {
  const systemPrompt = `You are PayPilot AI, an intelligent shopping assistant. Analyze the user's shopping request and recommend products from the available catalog.

You MUST respond with valid JSON in this exact format:
{
  "category": "detected category",
  "budget": number or null,
  "preferences": ["pref1", "pref2"],
  "reasoning": "overall explanation of your recommendation strategy",
  "recommendations": [
    {
      "productIndex": 0,
      "reason": "why this product is recommended",
      "matchScore": 95,
      "decisionFactors": ["factor1", "factor2"]
    }
  ],
  "alternatives": [
    {
      "productIndex": 1,
      "reason": "why this is an alternative"
    }
  ],
  "summary": "brief summary for the user"
}

Available products (by index):
${products.map((p, i) => `[${i}] ${p.name} - ₹${p.price} - ${p.category} - Rating: ${p.rating}/5 - ${p.brand} - Features: ${p.features.join(', ')}`).join('\n')}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const content = response.choices[0].message.content;
  try {
    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse OpenAI response as JSON:', e);
  }
  return null;
}

async function processWithFallback(query, allProducts) {
  const budget = extractBudget(query);
  const category = extractCategory(query);
  const preferences = extractPreferences(query);
  const searchTerms = query.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['need', 'want', 'looking', 'for', 'with', 'and', 'the', 'good', 'best', 'under', 'below', 'around', 'near', 'some', 'any', 'get', 'buy', 'find', 'search', 'show', 'give', 'suggest', 'recommend'].includes(w));

  // Filter products
  let filteredProducts = [...allProducts];
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  // Score and sort
  const scored = filteredProducts.map(p => ({
    product: p,
    score: scoreProduct(p, budget, preferences, searchTerms),
  }));
  scored.sort((a, b) => b.score - a.score);

  // Get top recommendations (within budget)
  let withinBudget = budget ? scored.filter(s => s.product.price <= budget) : scored;
  let isStrictBudgetMatch = true;

  if (budget && withinBudget.length === 0) {
    // If no product is within budget, take the lowest price options as closest recommendations
    isStrictBudgetMatch = false;
    withinBudget = [...scored].sort((a, b) => a.product.price - b.product.price).slice(0, 3);
  }

  const recommendations = withinBudget.slice(0, 4);

  // Get alternatives (slightly over budget or different category)
  const alternatives = budget && isStrictBudgetMatch
    ? scored.filter(s => s.product.price > budget).slice(0, 2)
    : scored.filter(s => !recommendations.some(r => r.product._id.toString() === s.product._id.toString())).slice(0, 2);

  let summary = '';
  if (!isStrictBudgetMatch && budget) {
    summary = `All matching ${category || 'products'} currently start above ₹${budget.toLocaleString('en-IN')}. Here are the closest high-value recommendations starting from ₹${recommendations[0]?.product?.price?.toLocaleString('en-IN') || 0}.`;
  } else {
    summary = `Found ${recommendations.length} ${recommendations.length === 1 ? 'product' : 'products'} matching your requirements${budget ? ` within ₹${budget.toLocaleString('en-IN')}` : ''}. ${alternatives.length > 0 ? `Also found ${alternatives.length} alternatives to consider.` : ''}`;
  }

  return {
    category: category || 'All Categories',
    budget,
    preferences,
    reasoning: !isStrictBudgetMatch && budget
      ? `Searched catalog for ${category || 'items'}, but all available options exceed ₹${budget.toLocaleString('en-IN')}. Selected the most budget-friendly options with the highest customer ratings.`
      : `I analyzed your request and ${category ? `focused on ${category}` : 'searched across all categories'}${budget ? ` within your budget of ₹${budget.toLocaleString('en-IN')}` : ''}. Products are ranked by relevance, rating, and value for money.`,
    recommendations: recommendations.map(r => ({
      product: r.product,
      reason: generateReasoning(r.product, budget, preferences),
      matchScore: Math.min(98, Math.max(60, r.score || 75)),
      decisionFactors: [
        budget && r.product.price <= budget ? 'Budget matched' : 'Closest price match',
        r.product.rating >= 4 ? `${r.product.rating}+ rating` : null,
        ...preferences.slice(0, 2),
        'Good value for money',
      ].filter(Boolean),
    })),
    alternatives: alternatives.map(a => ({
      product: a.product,
      reason: generateReasoning(a.product, budget, preferences),
    })),
    summary,
  };
}

// Main exported function
async function processShoppingQuery(query) {
  // Get all products from DB
  const allProducts = await Product.find({ inStock: true });

  if (allProducts.length === 0) {
    return {
      category: null,
      budget: extractBudget(query),
      preferences: [],
      reasoning: 'No products available in the database.',
      recommendations: [],
      alternatives: [],
      summary: 'Sorry, there are no products available at the moment. Please check back later.',
    };
  }

  // Try OpenAI first
  if (openai) {
    try {
      const aiResult = await processWithOpenAI(query, allProducts);
      if (aiResult) {
        // Map product indices to actual products
        const mapped = {
          ...aiResult,
          recommendations: (aiResult.recommendations || []).map(rec => {
            const product = allProducts[rec.productIndex];
            return product ? {
              product,
              reason: rec.reason,
              matchScore: rec.matchScore,
              decisionFactors: rec.decisionFactors,
            } : null;
          }).filter(Boolean),
          alternatives: (aiResult.alternatives || []).map(alt => {
            const product = allProducts[alt.productIndex];
            return product ? {
              product,
              reason: alt.reason,
            } : null;
          }).filter(Boolean),
        };
        return mapped;
      }
    } catch (error) {
      console.error('OpenAI processing failed, falling back:', error.message);
    }
  }

  // Use fallback engine
  return processWithFallback(query, allProducts);
}

module.exports = { processShoppingQuery, extractBudget, extractCategory, extractPreferences };
