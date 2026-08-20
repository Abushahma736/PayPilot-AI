import { useState } from 'react';
import { Star, Plus, Check, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = async () => {
    try {
      setIsAdding(true);
      await addToCart(product._id, 1);
      setIsAdded(true);
      toast.success(`Added ${product.name} to cart!`);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="glass-card flex flex-col justify-between overflow-hidden group hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300">
      <div>
        <div className="relative aspect-[4/3] bg-surface-900 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 badge-primary text-xs backdrop-blur-md">
            {product.category}
          </div>
          <div className="absolute top-2 right-2 bg-surface-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-mono text-surface-300">
            {product.brand}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white text-base line-clamp-1 group-hover:text-primary-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-surface-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center text-amber-400 text-xs font-semibold">
              <Star size={14} className="fill-amber-400 mr-1" />
              {product.rating}
            </div>
            <span className="text-xs text-surface-500">
              ({product.ratingCount?.toLocaleString('en-IN') || 0})
            </span>
          </div>

          {/* Key Features Pill */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.features.slice(0, 2).map((f, i) => (
                <span key={i} className="text-[10px] bg-surface-800/80 text-surface-300 px-2 py-0.5 rounded-md border border-surface-700/50">
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-surface-800/80">
          <div>
            <span className="text-[10px] uppercase font-semibold text-surface-500 block">Price</span>
            <span className="text-lg font-bold text-white font-mono">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isAdding || isAdded}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              isAdded
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 active:scale-95'
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
    </div>
  );
}
