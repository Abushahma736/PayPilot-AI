import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, ChevronDown, ChevronUp, ShoppingBag, Sparkles } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={Package}
          title="No orders yet"
          message="You haven't placed any orders yet. Try asking the AI Assistant for recommendations!"
          action={
            <Link to="/chat" className="btn-primary text-xs flex items-center gap-1.5">
              <Sparkles size={14} /> Start Shopping with AI
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-2.5">
          Order History
        </h1>
        <p className="text-sm text-surface-400 mt-1">
          Review all your fulfilled purchases and transactions
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;

          return (
            <div
              key={order._id}
              className="glass-card overflow-hidden transition-all duration-200 border-surface-800"
            >
              <div
                onClick={() => toggleExpand(order._id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-900/40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 shrink-0">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-sm sm:text-base">
                        Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </h3>
                      <span className={getStatusColor(order.status)}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-surface-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(order.createdAt)}
                      </span>
                      <span>•</span>
                      <span>{order.items?.length || 0} items</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-surface-800">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-surface-500 block">Total Amount</span>
                    <span className="text-base font-bold text-white font-mono">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <button className="text-surface-400 hover:text-white p-1 rounded-lg">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Collapsible Order Items and Shipping breakdown */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-surface-800/80 bg-surface-950/40 space-y-4 animate-fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-surface-400">
                    Purchased Items
                  </h4>

                  <div className="space-y-2.5">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-surface-900/60 border border-surface-800 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-surface-800"
                          />
                          <div>
                            <span className="font-semibold text-white block">{item.name}</span>
                            <span className="text-surface-400">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Payment Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-surface-900/50 border border-surface-800/80">
                      <span className="text-surface-500 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                        Shipping Destination
                      </span>
                      <p className="text-surface-300">
                        {order.shippingAddress?.name}<br />
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-900/50 border border-surface-800/80">
                      <span className="text-surface-500 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                        Payment Details
                      </span>
                      <p className="text-surface-300">
                        Method: <span className="text-white font-medium">Razorpay Gateway</span><br />
                        Transaction ID: <span className="font-mono text-primary-300">{order.paymentId || 'N/A'}</span><br />
                        Status: <span className="badge-success ml-1">{order.paymentStatus}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
