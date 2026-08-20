// Check if Razorpay is available
let Razorpay = null;
let razorpayInstance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized with live credentials');
  } else {
    console.log('Razorpay credentials not set - using demo payment mode');
  }
} catch (e) {
  console.log('Razorpay module error - using demo payment mode');
}

const crypto = require('crypto');

async function createOrder(amount, currency = 'INR', receipt = null) {
  const receiptId = receipt || `receipt_${Date.now()}`;

  if (razorpayInstance) {
    // Live Razorpay
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receiptId,
    };
    const order = await razorpayInstance.orders.create(options);
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      isDemo: false,
    };
  }

  // Demo/Mock mode
  return {
    id: `demo_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount * 100,
    currency,
    receipt: receiptId,
    isDemo: true,
  };
}

function verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  if (!razorpayInstance) {
    // Demo mode - always verify successfully if payment ID starts with 'demo_'
    return razorpayPaymentId.startsWith('demo_');
  }

  // Live Razorpay signature verification
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpaySignature;
}

function getRazorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID || 'demo_key';
}

function isDemo() {
  return !razorpayInstance;
}

module.exports = { createOrder, verifyPayment, getRazorpayKeyId, isDemo };
