require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const axios = require('axios');
const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting PayPilot AI Comprehensive Backend Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('--- 1. Health Check ---');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    assert(healthRes.status === 200 && healthRes.data.status === 'ok', 'Health endpoint returns 200 ok');

    // 2. Auth Tests
    console.log('\n--- 2. Auth Endpoints ---');
    const testEmail1 = `tester_${Date.now()}@paypilot.ai`;
    const testEmail2 = `tester2_${Date.now()}@paypilot.ai`;

    // 2a. Register User 1
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Tester One',
      email: testEmail1,
      password: 'password123',
    });
    assert(regRes.status === 201 && regRes.data.token && regRes.data.user.email === testEmail1, 'Register User 1 successful with token');
    const token1 = regRes.data.token;
    const user1Id = regRes.data.user.id;

    // 2b. Register User 2 (for multi-tenant isolation testing)
    const regRes2 = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Tester Two',
      email: testEmail2,
      password: 'password123',
    });
    const token2 = regRes2.data.token;

    // 2c. Register Duplicate Email validation
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Tester One Duplicate',
        email: testEmail1,
        password: 'password123',
      });
      assert(false, 'Duplicate email should fail with 400');
    } catch (e) {
      assert(e.response?.status === 400, 'Duplicate email rejected with 400');
    }

    // 2d. Register Short Password validation
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Short Pwd',
        email: `short_${Date.now()}@paypilot.ai`,
        password: '123',
      });
      assert(false, 'Short password should fail with 400');
    } catch (e) {
      assert(e.response?.status === 400, 'Short password rejected with 400');
    }

    // 2e. Login Success
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail1,
      password: 'password123',
    });
    assert(loginRes.status === 200 && loginRes.data.token, 'Login successful');

    // 2f. Login Wrong Password
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: testEmail1,
        password: 'wrongpassword',
      });
      assert(false, 'Wrong password should fail with 401');
    } catch (e) {
      assert(e.response?.status === 401, 'Wrong password rejected with 401');
    }

    // 2g. Auth /me with token
    const meRes = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(meRes.status === 200 && meRes.data.user.name === 'Tester One', 'Get /auth/me returns authenticated user');

    // 2h. Auth /me without token
    try {
      await axios.get(`${BASE_URL}/auth/me`);
      assert(false, 'Request without token should fail with 401');
    } catch (e) {
      assert(e.response?.status === 401, 'Unauthorized request rejected with 401');
    }

    // 3. Products Endpoints
    console.log('\n--- 3. Product Endpoints ---');
    const productsRes = await axios.get(`${BASE_URL}/products`);
    assert(productsRes.status === 200 && Array.isArray(productsRes.data) && productsRes.data.length >= 20, `List products returns ${productsRes.data.length} items`);

    const firstProduct = productsRes.data[0];

    // 3b. Categories list
    const categoriesRes = await axios.get(`${BASE_URL}/products/categories`);
    assert(categoriesRes.status === 200 && categoriesRes.data.includes('Electronics'), 'Categories list includes Electronics');

    // 3c. Filter by category
    const elecRes = await axios.get(`${BASE_URL}/products?category=Electronics`);
    assert(elecRes.data.every(p => p.category === 'Electronics'), 'Category filter returns only Electronics');

    // 3d. Filter by price
    const priceRes = await axios.get(`${BASE_URL}/products?maxPrice=3000`);
    assert(priceRes.data.every(p => p.price <= 3000), 'Price filter respects maxPrice 3000');

    // 3e. Search by keyword
    const searchRes = await axios.get(`${BASE_URL}/products?search=headphone`);
    assert(searchRes.data.length > 0 && searchRes.data.some(p => p.name.toLowerCase().includes('headphone') || p.description.toLowerCase().includes('headphone')), 'Search finds headphone products');

    // 3f. Product details by ID
    const singleProductRes = await axios.get(`${BASE_URL}/products/${firstProduct._id}`);
    assert(singleProductRes.status === 200 && singleProductRes.data.name === firstProduct.name, 'Get product details by ID works');

    // 4. Cart Endpoints
    console.log('\n--- 4. Cart Endpoints ---');
    // 4a. Initial cart is empty
    const initCartRes = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(initCartRes.status === 200 && Array.isArray(initCartRes.data.items), 'Get initial user cart returns items array');

    // 4b. Add to cart
    const addCartRes = await axios.post(`${BASE_URL}/cart/add`, {
      productId: firstProduct._id,
      quantity: 2,
    }, { headers: { Authorization: `Bearer ${token1}` } });
    assert(addCartRes.data.items.length === 1 && addCartRes.data.items[0].quantity === 2, 'Add product to cart with quantity 2');

    // 4c. Set Cart Budget
    const budgetRes = await axios.put(`${BASE_URL}/cart/budget`, {
      budget: 5000,
    }, { headers: { Authorization: `Bearer ${token1}` } });
    assert(budgetRes.data.budget === 5000, 'Set cart budget to ₹5000');

    // 4d. Update Quantity
    const updateCartRes = await axios.put(`${BASE_URL}/cart/update`, {
      productId: firstProduct._id,
      quantity: 3,
    }, { headers: { Authorization: `Bearer ${token1}` } });
    assert(updateCartRes.data.items[0].quantity === 3, 'Update item quantity to 3');

    // 5. AI Assistant Endpoints
    console.log('\n--- 5. AI Assistant Endpoints ---');
    // 5a. Shopping query 1: Wireless headphones under 3000
    const aiRes1 = await axios.post(`${BASE_URL}/ai/chat`, {
      query: 'I need wireless headphones under ₹3000 with good battery life',
    }, { headers: { Authorization: `Bearer ${token1}` } });
    assert(aiRes1.status === 200 && aiRes1.data.budget === 3000, 'AI correctly extracts budget ₹3000');
    assert(aiRes1.data.category === 'Electronics', 'AI correctly identifies Electronics category');
    assert(aiRes1.data.recommendations.length > 0, `AI returns ${aiRes1.data.recommendations.length} recommendations`);
    assert(aiRes1.data.recommendations.every(r => r.product.price <= 3000), 'All recommendations are within budget ₹3000');
    assert(aiRes1.data.reasoning && aiRes1.data.reasoning.length > 0, 'AI includes structured reasoning');

    // 5b. Shopping query 2: Gaming mouse under 1500
    const aiRes2 = await axios.post(`${BASE_URL}/ai/chat`, {
      query: 'Find a gaming mouse under ₹1500',
    }, { headers: { Authorization: `Bearer ${token1}` } });
    assert(aiRes2.data.budget === 1500, 'AI extracts budget ₹1500');
    assert(aiRes2.data.category === 'Gaming', 'AI identifies Gaming category');

    // 5c. AI History
    const historyRes = await axios.get(`${BASE_URL}/ai/history`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(historyRes.data.length >= 2, `AI interaction history recorded ${historyRes.data.length} queries`);

    // 5d. AI Insights
    const insightsRes = await axios.get(`${BASE_URL}/ai/insights`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(insightsRes.status === 200 && typeof insightsRes.data.moneySaved === 'number', 'AI insights endpoint computes savings');

    // 6. Payment & Order Endpoints
    console.log('\n--- 6. Payment & Checkout Endpoints ---');
    // 6a. Get Razorpay Public Key
    const keyRes = await axios.get(`${BASE_URL}/payments/key`);
    assert(keyRes.status === 200 && typeof keyRes.data.isDemo === 'boolean', 'Get payment public key info');

    // 6b. Create payment order
    const shippingAddress = {
      name: 'Tester One',
      email: testEmail1,
      phone: '9876543210',
      address: '123 Tech Lane',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    };
    const orderCreateRes = await axios.post(`${BASE_URL}/payments/create-order`, {
      amount: firstProduct.price * 3,
      shippingAddress,
    }, { headers: { Authorization: `Bearer ${token1}` } });
    assert(orderCreateRes.status === 200 && orderCreateRes.data.order.id, 'Create payment order successful');
    const createdOrderId = orderCreateRes.data.order.id;
    const razorpayOrderId = orderCreateRes.data.order.razorpayOrderId;

    // 6c. Verify Payment (Demo mode)
    const verifyRes = await axios.post(`${BASE_URL}/payments/verify`, {
      orderId: createdOrderId,
      razorpayOrderId,
      razorpayPaymentId: `demo_payment_${Date.now()}`,
      razorpaySignature: 'demo_sig',
    }, { headers: { Authorization: `Bearer ${token1}` } });
    assert(verifyRes.status === 200 && verifyRes.data.success === true, 'Verify payment succeeds and marks order completed');

    // 6d. Check that cart is cleared after payment
    const postPayCartRes = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(postPayCartRes.data.items.length === 0, 'Cart is automatically cleared after payment');

    // 6e. Order History
    const ordersRes = await axios.get(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(ordersRes.data.length >= 1 && ordersRes.data[0]._id === createdOrderId, 'Order history contains the newly placed order');

    // 6f. User Isolation / Security Check
    // User 2 should NOT be able to view User 1's order details!
    try {
      await axios.get(`${BASE_URL}/orders/${createdOrderId}`, {
        headers: { Authorization: `Bearer ${token2}` },
      });
      assert(false, 'User 2 should NOT be able to access User 1 order');
    } catch (e) {
      assert(e.response?.status === 404, 'User isolation verified: User 2 cannot access User 1 order (404)');
    }

    console.log(`\n========================================`);
    console.log(`🏁 Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal test error:', error.message, error.response?.data || '');
    process.exit(1);
  }
}

runTests();
