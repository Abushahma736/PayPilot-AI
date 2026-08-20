import { useState } from 'react';
import { Bot, User, Star, Plus, Check, Info, ShoppingBag, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import AIDecision from './AIDecision';
import toast from 'react-hot-toast';

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());
  const [showMatrix, setShowMatrix] = useState(true);

  const handleAddToCart = async (product) => {
    try {
      setAddingId(product._id);
      await addToCart(product._id, 1);
      setAddedIds(prev => new Set(prev).add(product._id));
      toast.success(`Added ${product.name} to cart!`);
    } catch (err) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingId(null);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 mb-5">
        <div className="max-w-xl">
          <div className="chat-bubble-user text-sm font-medium shadow-md shadow-primary-950/30">
            {message.text}
          </div>
          <span className="text-[10px] text-surface-500 block text-right mt-1 font-mono">
            {message.timestamp || 'Just now'}
          </span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-surface-700 flex items-center justify-center shrink-0 border border-surface-600">
          <User size={16} className="text-surface-200" />
        </div>
      </div>
    );
  }

  // AI Message
  const data = message.data || {};
  const recommendations = data.recommendations || [];
  const alternatives = data.alternatives || [];

  return (
    <div className="flex items-start gap-3.5 mb-8">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
        <Bot size={18} className="text-white" />
      </div>

      <div className="flex-1 max-w-3xl space-y-4">
        {/* Main AI Summary / Text */}
        <div className="chat-bubble-ai text-sm shadow-md">
          <p className="leading-relaxed text-surface-200">
            {message.text || data.summary || "Here are my tailored recommendations based on your request:"}
          </p>
        </div>

        {/* AI Decision Showcase (Collapsible) */}
        {data.reasoning && (
          <div>
            <button
              onClick={() => setShowMatrix(!showMatrix)}
              className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-medium mb-1 transition-colors"
            >
              <Sparkles size={14} />
              {showMatrix ? 'Hide AI Decision Matrix' : 'Show AI Decision Matrix & Logic'}
              {showMatrix ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showMatrix && (
              <AIDecision
                budget={data.budget}
                detectedCategory={data.category}
                preferences={data.preferences}
                decisionFactors={recommendations[0]?.decisionFactors || ['Best match', 'High customer rating', 'Budget compliant']}
                reasoning={data.reasoning}
                savings={
                  data.budget && recommendations[0]?.product?.price
                    ? Math.max(0, data.budget - recommendations[0].product.price)
                    : null
                }
              />
            )}
          </div>
        )}

        {/* Recommended Products Grid */}
        {recommendations.length > 0 && (
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-400 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-primary-400" />
              Recommended Products ({recommendations.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {recommendations.map((rec, idx) => {
                const product = rec.product;
                if (!product) return null;
                const isAdded = addedIds.has(product._id);
                const isAdding = addingId === product._id;

                return (
                  <div
                    key={product._id || idx}
                    className="glass-card p-4 flex flex-col justify-between hover:border-primary-500/40 transition-all duration-300 group"
                  >
                    <div>
                      <div className="relative rounded-xl overflow-hidden mb-3 aspect-[4/3] bg-surface-900">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {rec.matchScore && (
                          <div className="absolute top-2 right-2 bg-surface-950/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                            {rec.matchScore}% Match
                          </div>
                        )}
                        <div className="absolute top-2 left-2 badge-primary text-[10px]">
                          {product.category}
                        </div>
                      </div>

                      <h5 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-primary-300 transition-colors">
                        {product.name}
                      </h5>

                      <div className="flex items-center gap-2 mt-1.5 mb-2">
                        <div className="flex items-center text-amber-400 text-xs">
                          <Star size={13} className="fill-amber-400" />
                          <span className="ml-1 font-medium">{product.rating}</span>
                        </div>
                        <span className="text-[11px] text-surface-500">
                          ({product.ratingCount?.toLocaleString('en-IN') || 0} reviews)
                        </span>
                        <span className="text-xs text-surface-400 ml-auto font-mono">
                          {product.brand}
                        </span>
                      </div>

                      {/* Why this product explanation */}
                      {rec.reason && (
                        <div className="text-[11px] text-surface-300 bg-surface-900/90 p-2 rounded-lg border border-surface-800 my-2.5 leading-snug">
                          <span className="text-primary-400 font-semibold block mb-0.5 flex items-center gap-1">
                            <Info size={11} /> Why this fits:
                          </span>
                          <span className="text-surface-400 whitespace-pre-line">{rec.reason}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-surface-800/80 mt-2">
                      <div>
                        <span className="text-xs text-surface-500 block">Price</span>
                        <span className="text-base font-bold text-white font-mono">
                          {formatCurrency(product.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isAdding || isAdded}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                          isAdded
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-600/20 active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={14} /> Added
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Alternative Suggestions */}
        {alternatives.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
              <span>⚡</span> Alternative Options (Slightly Above / Alternate Spec)
            </h4>
            <div className="space-y-2">
              {alternatives.map((alt, idx) => {
                const product = alt.product;
                if (!product) return null;
                const isAdded = addedIds.has(product._id);

                return (
                  <div
                    key={product._id || idx}
                    className="p-3 rounded-xl bg-surface-900/60 border border-surface-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-surface-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-medium text-white truncate block">{product.name}</span>
                        <span className="text-surface-400 font-mono">{formatCurrency(product.price)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAdded}
                      className="btn-secondary !px-2.5 !py-1 text-xs shrink-0"
                    >
                      {isAdded ? 'Added' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
