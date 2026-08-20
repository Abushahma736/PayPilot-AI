import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, cartTotal, fetchCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '9876543210',
    address: '123 Tech Hub, Residency Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/products');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const { data } = await api.post('/payments/create-order', {
        amount: cartTotal,
        shippingAddress: formData,
      });

      const { order, keyId } = data;

      // 2. If it's Demo mode (no live Razorpay keys configured)
      if (order.isDemo || keyId === 'demo_key') {
        toast('Processing in Safe Demo Payment Mode...', { icon: '💳' });

        // Simulate short gateway processing delay
        setTimeout(async () => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpayOrderId: order.razorpayOrderId,
              razorpayPaymentId: `demo_pay_${Date.now()}`,
              razorpaySignature: 'demo_sig',
              orderId: order.id,
            });

            await fetchCart();
            setSuccessOrder(verifyRes.data.order);
            toast.success('Payment completed successfully!');
          } catch (err) {
            toast.error('Payment verification failed');
          } finally {
            setLoading(false);
          }
        }, 1500);

        return;
      }

      // 3. Live Razorpay mode
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load. Falling back to Demo mode.');
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'PayPilot AI',
        description: 'Order Checkout Payment',
        order_id: order.razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#6366f1',
        },
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order.id,
            });

            await fetchCart();
            setSuccessOrder(verifyRes.data.order);
            toast.success('Payment verified successfully!');
          } catch (err) {
            toast.error('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast('Payment cancelled', { icon: '⚠️' });
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  // Success Confirmation Screen
  if (successOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <CheckCircle2 size={32} />
          </div>

          <h2 className="text-2xl font-bold font-display text-white mb-1">
            Order Confirmed!
          </h2>
          <p className="text-sm text-surface-400 mb-6">
            Thank you for shopping with PayPilot AI. Your order is being processed.
          </p>

          <div className="p-4 rounded-xl bg-surface-900/80 border border-surface-800 text-left space-y-2 mb-6 text-xs">
            <div className="flex justify-between">
              <span className="text-surface-400">Order ID:</span>
              <span className="font-mono text-white">{successOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Payment Status:</span>
              <span className="badge-success uppercase">{successOrder.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Delivery To:</span>
              <span className="text-surface-200">{formData.city}, {formData.state}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="btn-primary flex-1 text-xs"
            >
              View Order History
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="btn-secondary flex-1 text-xs"
            >
              Back to AI Assistant
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/cart')}
        className="text-xs text-surface-400 hover:text-white flex items-center gap-1.5 mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Shipping Form */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-xl font-bold font-display text-white mb-1 flex items-center gap-2">
              <Lock size={18} className="text-primary-400" />
              Shipping & Customer Details
            </h2>
            <p className="text-xs text-surface-400 mb-6">
              Enter your destination details for order fulfillment
            </p>

            <form onSubmit={handlePayment} id="checkout-form" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-surface-300 uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-surface-300 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-surface-300 uppercase tracking-wider block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-surface-300 uppercase tracking-wider block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-surface-300 uppercase tracking-wider block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-surface-300 uppercase tracking-wider block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-surface-300 uppercase tracking-wider block mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary & Pay Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-bold text-white text-base">Order Review</h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.items.map((item) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div key={item._id || product._id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-surface-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-medium text-white truncate block">{product.name}</span>
                        <span className="text-surface-500">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white shrink-0">
                      {formatCurrency(product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-surface-800 space-y-2 text-xs text-surface-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-surface-200">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Delivery</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-surface-800 text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span className="font-mono text-primary-300 text-base">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="pt-2">
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 shadow-xl shadow-primary-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} /> Pay {formatCurrency(cartTotal)} via Razorpay
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-surface-500 mt-3">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>256-bit Encrypted Checkout • Demo Mode Supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
