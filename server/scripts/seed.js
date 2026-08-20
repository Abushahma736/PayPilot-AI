require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  // ===== ELECTRONICS =====
  {
    name: 'boAt Rockerz 450 Bluetooth Headphones',
    description: 'Wireless Bluetooth on-ear headphones with 40mm drivers, 15 hours playback, padded ear cushions, and integrated controls.',
    price: 1299,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    rating: 4.2,
    ratingCount: 12453,
    brand: 'boAt',
    features: ['40mm drivers', '15 hours battery', 'Bluetooth 5.0', 'Lightweight design', 'Built-in microphone'],
  },
  {
    name: 'Sony WH-CH520 Wireless Headphones',
    description: 'Premium on-ear wireless headphones with 50 hours battery life, multipoint connection, and DSEE sound enhancement.',
    price: 2990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
    rating: 4.5,
    ratingCount: 8920,
    brand: 'Sony',
    features: ['50 hours battery', 'DSEE sound enhancement', 'Multipoint connection', 'Lightweight 147g', 'Fast charging'],
  },
  {
    name: 'JBL Tune 760NC Noise Cancelling Headphones',
    description: 'Over-ear Active Noise Cancelling headphones with JBL Pure Bass sound, 35 hours battery, and multi-point connection.',
    price: 3999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
    rating: 4.3,
    ratingCount: 6780,
    brand: 'JBL',
    features: ['Active Noise Cancellation', '35 hours battery', 'JBL Pure Bass', 'Foldable design', 'Multi-point connection'],
  },
  {
    name: 'OnePlus Nord Buds 2 TWS Earbuds',
    description: 'True wireless earbuds with 12.4mm titanium drivers, active noise cancellation up to 25dB, and 36 hours total playback.',
    price: 2299,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&q=80',
    rating: 4.1,
    ratingCount: 9200,
    brand: 'OnePlus',
    features: ['Active Noise Cancellation', '36 hours battery', '12.4mm titanium drivers', 'IP55 water resistant', 'Fast charging'],
  },
  {
    name: 'Anker 20000mAh Power Bank',
    description: 'High-capacity 20000mAh portable charger with dual USB-A ports, USB-C input, and PowerIQ fast charging technology.',
    price: 1599,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
    rating: 4.4,
    ratingCount: 15600,
    brand: 'Anker',
    features: ['20000mAh capacity', 'Dual USB-A output', 'USB-C input', 'PowerIQ fast charging', 'LED indicator'],
  },

  // ===== ACCESSORIES =====
  {
    name: 'Wildcraft Laptop Backpack 35L',
    description: 'Durable 35L laptop backpack with dedicated 15.6" laptop compartment, rain cover, and ergonomic shoulder straps.',
    price: 1499,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    rating: 4.3,
    ratingCount: 7890,
    brand: 'Wildcraft',
    features: ['35L capacity', '15.6" laptop compartment', 'Rain cover included', 'Water resistant', 'Ergonomic straps'],
  },
  {
    name: 'Fastrack Analog Watch',
    description: 'Stylish analog wristwatch with quartz movement, stainless steel case, leather strap, and water resistance up to 30m.',
    price: 1795,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80',
    rating: 4.0,
    ratingCount: 5430,
    brand: 'Fastrack',
    features: ['Quartz movement', 'Stainless steel case', 'Genuine leather strap', '30m water resistance', '2 year warranty'],
  },
  {
    name: 'Ray-Ban Classic Aviator Sunglasses',
    description: 'Iconic aviator sunglasses with gold metal frame, polarized green lenses, and 100% UV protection.',
    price: 5990,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    rating: 4.7,
    ratingCount: 3200,
    brand: 'Ray-Ban',
    features: ['Polarized lenses', '100% UV protection', 'Gold metal frame', 'Classic aviator style', 'Comes with case'],
  },
  {
    name: 'Leather Bifold Wallet',
    description: 'Genuine leather bifold wallet with RFID blocking, 8 card slots, 2 currency compartments, and coin pocket.',
    price: 799,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
    rating: 4.1,
    ratingCount: 4560,
    brand: 'Urban Forest',
    features: ['Genuine leather', 'RFID blocking', '8 card slots', 'Coin pocket', 'Gift box packaging'],
  },

  // ===== GAMING =====
  {
    name: 'Cosmic Byte CB-GK-18 Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard with Outemu Blue switches, anti-ghosting, N-key rollover, and aluminium base.',
    price: 2499,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80',
    rating: 4.2,
    ratingCount: 6700,
    brand: 'Cosmic Byte',
    features: ['Outemu Blue switches', 'Per-key RGB lighting', 'Anti-ghosting', 'N-key rollover', 'Aluminium base'],
  },
  {
    name: 'Logitech G502 HERO Gaming Mouse',
    description: 'High-performance gaming mouse with HERO 25K sensor, 11 programmable buttons, adjustable weights, and RGB lighting.',
    price: 3495,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80',
    rating: 4.6,
    ratingCount: 11200,
    brand: 'Logitech',
    features: ['HERO 25K sensor', '11 programmable buttons', 'Adjustable weights', 'RGB LIGHTSYNC', 'On-board memory'],
  },
  {
    name: 'Redgear Pro Wireless Gamepad',
    description: 'Wireless gaming controller with 2.4GHz dongle, dual vibration motors, 10 hours battery, and plug-and-play support.',
    price: 1399,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&q=80',
    rating: 4.0,
    ratingCount: 18900,
    brand: 'Redgear',
    features: ['2.4GHz wireless', 'Dual vibration', '10 hours battery', 'Plug and play', 'Turbo button'],
  },
  {
    name: 'HyperX Cloud Stinger Gaming Headset',
    description: 'Lightweight gaming headset with 50mm drivers, swivel-to-mute noise-cancelling mic, and steel slider for durability.',
    price: 2690,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80',
    rating: 4.4,
    ratingCount: 8900,
    brand: 'HyperX',
    features: ['50mm directional drivers', 'Swivel-to-mute mic', 'Steel slider', 'Memory foam cushions', 'Multi-platform'],
  },

  // ===== HOME =====
  {
    name: 'Philips LED Desk Lamp',
    description: 'Modern LED desk lamp with 4 brightness levels, colour temperature control, foldable arm, and USB charging port.',
    price: 1899,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&q=80',
    rating: 4.3,
    ratingCount: 4300,
    brand: 'Philips',
    features: ['4 brightness levels', 'Colour temperature control', 'Foldable arm', 'USB charging port', 'Eye comfort'],
  },
  {
    name: 'Milton Thermosteel Flask 1L',
    description: '1-litre double-walled vacuum insulated flask that keeps beverages hot for 24 hours and cold for 24 hours.',
    price: 899,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    rating: 4.5,
    ratingCount: 22100,
    brand: 'Milton',
    features: ['1L capacity', 'Double-wall vacuum insulation', '24 hours hot/cold', 'Leak-proof', 'BPA free'],
  },
  {
    name: 'Amazon Echo Dot 5th Gen',
    description: 'Smart speaker with Alexa, improved audio quality, built-in temperature sensor, and smart home hub capability.',
    price: 4499,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&q=80',
    rating: 4.4,
    ratingCount: 35600,
    brand: 'Amazon',
    features: ['Alexa built-in', 'Improved audio', 'Temperature sensor', 'Smart home hub', 'Bluetooth and WiFi'],
  },
  {
    name: 'Aromatherapy Essential Oil Diffuser',
    description: 'Ultrasonic aroma diffuser with 300ml capacity, 7-colour LED lights, auto shut-off, and whisper-quiet operation.',
    price: 1199,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&q=80',
    rating: 4.1,
    ratingCount: 5600,
    brand: 'HealthSense',
    features: ['300ml capacity', '7-colour LED', 'Auto shut-off', 'Whisper quiet', 'Timer settings'],
  },

  // ===== FASHION =====
  {
    name: 'Nike Air Max 270 Sneakers',
    description: 'Iconic lifestyle sneakers with large Max Air unit, breathable mesh upper, foam midsole, and rubber outsole.',
    price: 8995,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    rating: 4.5,
    ratingCount: 7800,
    brand: 'Nike',
    features: ['Max Air unit', 'Breathable mesh upper', 'Foam midsole', 'Rubber outsole', 'Iconic design'],
  },
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    description: 'Classic slim fit jeans with stretch denim, comfortable rise, and tapered leg for a modern look.',
    price: 2499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
    rating: 4.3,
    ratingCount: 9400,
    brand: 'Levi\'s',
    features: ['Slim fit', 'Stretch denim', 'Comfortable rise', 'Tapered leg', '5-pocket styling'],
  },
  {
    name: 'Allen Solly Formal Shirt',
    description: 'Premium cotton regular fit formal shirt with spread collar, single cuff, and wrinkle-resistant fabric.',
    price: 1199,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80',
    rating: 4.2,
    ratingCount: 6200,
    brand: 'Allen Solly',
    features: ['100% cotton', 'Regular fit', 'Spread collar', 'Wrinkle resistant', 'Machine washable'],
  },
  {
    name: 'Puma Running Jacket',
    description: 'Lightweight windbreaker running jacket with DryCell moisture-wicking technology, reflective details, and zip pockets.',
    price: 2999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
    rating: 4.4,
    ratingCount: 3100,
    brand: 'Puma',
    features: ['DryCell technology', 'Lightweight', 'Reflective details', 'Zip pockets', 'Wind resistant'],
  },
  {
    name: 'Noise ColorFit Pro 4 Smartwatch',
    description: 'Feature-rich smartwatch with 1.72" AMOLED display, Bluetooth calling, SpO2, heart rate monitoring, and 7-day battery.',
    price: 3499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
    rating: 4.1,
    ratingCount: 14500,
    brand: 'Noise',
    features: ['1.72" AMOLED display', 'Bluetooth calling', 'SpO2 monitoring', 'Heart rate monitor', '7-day battery'],
  },
];

async function seedProducts() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/paypilot';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert seed data
    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products successfully`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedProducts();
