import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import {
  Sparkles,
  TrendingDown,
  ShoppingBag,
  CreditCard,
  Target,
  ArrowRight,
  Bot,
  Package,
  Layers,
  History,
  Zap
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [insightsRes, ordersRes] = await Promise.all([
          api.get('/ai/insights'),
          api.get('/orders'),
        ]);

        setInsights(insightsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-primary text-xs flex items-center gap-1">
                <Zap size={12} /> PayPilot AI Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Welcome, <span className="gradient-text">{user?.name || 'Shopper'}</span>!
            </h1>
            <p className="text-sm text-surface-400 mt-1 max-w-xl">
              Your autonomous shopping copilot is ready. Ask for any product or budget envelope.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/chat" className="btn-primary text-xs flex items-center gap-2">
              <Bot size={16} /> Open AI Assistant
            </Link>
            <Link to="/products" className="btn-secondary text-xs flex items-center gap-2">
              <ShoppingBag size={16} /> Browse Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* AI Insights & Metrics Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-primary-400" />
            AI Shopping Insights
          </h2>
          <span className="text-xs text-surface-500 font-mono">Live Analytics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Money Saved */}
          <div className="glass-card p-5 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-surface-400 font-semibold uppercase tracking-wider">
                Money Saved
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingDown size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {formatCurrency(insights?.moneySaved || 0)}
            </div>
            <p className="text-[11px] text-surface-500 mt-1">
              Through AI budget & alternative matching
            </p>
          </div>

          {/* Total Purchases */}
          <div className="glass-card p-5 group hover:border-primary-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-surface-400 font-semibold uppercase tracking-wider">
                Orders Completed
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center">
                <Package size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {insights?.totalPurchases || 0}
            </div>
            <p className="text-[11px] text-surface-500 mt-1">
              Processed via Razorpay gateway
            </p>
          </div>

          {/* Average Order Value */}
          <div className="glass-card p-5 group hover:border-accent-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-surface-400 font-semibold uppercase tracking-wider">
                Avg Order Value
              </span>
              <div className="w-8 h-8 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center">
                <CreditCard size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {formatCurrency(insights?.avgOrderValue || 0)}
            </div>
            <p className="text-[11px] text-surface-500 mt-1">
              Across your transactions
            </p>
          </div>

          {/* Most Searched Category */}
          <div className="glass-card p-5 group hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-surface-400 font-semibold uppercase tracking-wider">
                Top Category
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Target size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold font-display text-white truncate">
              {insights?.mostSearchedCategory || 'Electronics'}
            </div>
            <p className="text-[11px] text-surface-500 mt-1">
              Based on your AI queries
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Try AI Shopping Assistant Card */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bot size={20} className="text-primary-400" />
              <h3 className="font-display font-bold text-white text-base">
                Try AI Shopping Queries
              </h3>
            </div>
            <p className="text-xs text-surface-400 mb-4 leading-relaxed">
              Test out natural language queries to see PayPilot AI in action:
            </p>

            <div className="space-y-2">
              {[
                { q: "I need wireless headphones under ₹3000 with good battery life", cat: "Electronics" },
                { q: "Best gaming mouse with RGB under ₹3500", cat: "Gaming" },
                { q: "Looking for a water bottle or flask for home under ₹1000", cat: "Home" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  to="/chat"
                  className="p-3 rounded-xl bg-surface-900/60 hover:bg-surface-800 border border-surface-800/80 flex items-center justify-between text-xs transition-colors group"
                >
                  <span className="text-surface-200 group-hover:text-primary-300 transition-colors">
                    "{item.q}"
                  </span>
                  <span className="badge-primary text-[10px] shrink-0 ml-2">
                    {item.cat}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-surface-800 flex justify-end">
            <Link to="/chat" className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1">
              Go to Assistant <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Orders Preview */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <History size={18} className="text-primary-400" />
                Recent Orders
              </h3>
              <Link to="/orders" className="text-xs text-primary-400 hover:text-primary-300 font-medium">
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-surface-500">
                No orders yet. Start your first purchase via AI!
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((ord) => (
                  <div key={ord._id} className="p-3 rounded-xl bg-surface-900/60 border border-surface-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-surface-300">
                        #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                      </span>
                      <span className="font-mono font-bold text-white">
                        {formatCurrency(ord.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-surface-500">
                      <span>{formatDate(ord.createdAt)}</span>
                      <span className="text-emerald-400 capitalize">{ord.paymentStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/orders"
            className="btn-secondary w-full text-xs text-center justify-center flex items-center gap-2 mt-4"
          >
            Order Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
