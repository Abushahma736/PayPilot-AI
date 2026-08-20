import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import { ShoppingCart, Trash2, Plus, Minus, AlertTriangle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function Cart() {
  const {
    cart,
    loading,
    cartTotal,
    cartCount,
    isOverBudget,
    remainingBudget,
    updateQuantity,
    removeFromCart,
    clearCart,
    setBudget,
  } = useCart();

  const [customBudget, setCustomBudget] = useState(cart.budget || '');
  const [budgetLoading, setBudgetLoading] = useState(false);
  const navigate = useNavigate();

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      setBudgetLoading(true);
      const val = customBudget ? Number(customBudget) : null;
      await setBudget(val);
      toast.success(val ? `Budget set to ${formatCurrency(val)}` : 'Budget limit removed');
    } catch (err) {
      toast.error('Failed to update budget');
    } finally {
      setBudgetLoading(false);
    }
  };

  if (!loading && cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Ask PayPilot AI to recommend items within your budget or explore the catalog."
          action={
            <div className="flex items-center gap-3">
              <Link to="/chat" className="btn-primary text-xs flex items-center gap-1.5">
                <Sparkles size={14} /> Ask AI Assistant
              </Link>
              <Link to="/products" className="btn-secondary text-xs">
                Browse Products
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-2.5">
            Smart Shopping Cart
          </h1>
          <p className="text-sm text-surface-400 mt-1">
            Review your items and monitor budget limits in real time
          </p>
        </div>

        {cart.items.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all items from your cart?')) clearCart();
            }}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <Trash2 size={14} /> Clear Cart
          </button>
        )}
      </div>

      {/* Budget Warning Banner if Exceeded */}
      {isOverBudget && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 animate-slide-down">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-300">
              Budget Exceeded by {formatCurrency(Math.abs(remainingBudget))}!
            </h4>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Your cart total ({formatCurrency(cartTotal)}) is higher than your set limit of {formatCurrency(cart.budget)}.
              Consider adjusting item quantities or asking the AI Assistant for budget-friendly alternatives.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <Link to="/chat" className="text-xs text-amber-300 font-semibold underline flex items-center gap-1">
                <Sparkles size={12} /> Ask AI for cheaper options
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={item._id || product._id}
                className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-surface-900 shrink-0 border border-surface-800"
                  />
                  <div className="min-w-0">
                    <span className="badge-primary text-[10px] mb-1">{product.category}</span>
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {product.name}
                    </h3>
                    <span className="text-xs text-surface-400 block font-mono mt-0.5">
                      {formatCurrency(product.price)} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-surface-800">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-surface-800/80 p-1 rounded-xl border border-surface-700">
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-xs text-surface-500 block">Total</span>
                    <span className="text-sm sm:text-base font-bold text-white font-mono">
                      {formatCurrency(product.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-surface-500 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Budget Control */}
        <div className="lg:col-span-4 space-y-6">
          {/* Smart Budget Controller */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary-400" />
              Budget Watcher
            </h3>

            <form onSubmit={handleSaveBudget} className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-surface-500">₹</span>
                <input
                  type="number"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="Set target budget"
                  className="input-field pl-7 !py-2 text-xs font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={budgetLoading}
                className="btn-secondary !px-3 !py-2 text-xs shrink-0"
              >
                {budgetLoading ? 'Saving...' : 'Set Limit'}
              </button>
            </form>

            {cart.budget && (
              <div className="space-y-2 pt-2 border-t border-surface-800">
                <div className="flex justify-between text-xs">
                  <span className="text-surface-400">Target Budget:</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(cart.budget)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-surface-400">Cart Total:</span>
                  <span className={`font-mono font-bold ${isOverBudget ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {formatCurrency(cartTotal)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverBudget ? 'bg-amber-500' : 'bg-gradient-to-r from-primary-500 to-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, (cartTotal / cart.budget) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-surface-500 pt-1">
                  <span>{((cartTotal / cart.budget) * 100).toFixed(0)}% utilized</span>
                  <span>
                    {remainingBudget >= 0
                      ? `${formatCurrency(remainingBudget)} remaining`
                      : `${formatCurrency(Math.abs(remainingBudget))} over`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-bold text-white text-base">Order Summary</h3>

            <div className="space-y-2 text-xs text-surface-300">
              <div className="flex justify-between">
                <span>Items ({cartCount}):</span>
                <span className="font-mono">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Shipping:</span>
                <span>FREE (PayPilot Promo)</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>AI Optimization Savings:</span>
                <span>- ₹0</span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-800 flex justify-between items-center">
              <span className="font-semibold text-white text-sm">Total Payable:</span>
              <span className="font-mono font-extrabold text-xl text-white">
                {formatCurrency(cartTotal)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4 shadow-xl shadow-primary-500/20"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
