import { Filter, RotateCcw } from 'lucide-react';

const categories = ['All', 'Electronics', 'Accessories', 'Gaming', 'Home', 'Fashion'];
const ratings = [
  { label: 'All Ratings', value: 0 },
  { label: '4.5 & above', value: 4.5 },
  { label: '4.0 & above', value: 4.0 },
  { label: '3.5 & above', value: 3.5 },
];

export default function ProductFilters({
  selectedCategory,
  onSelectCategory,
  selectedRating,
  onSelectRating,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortChange,
  onReset,
}) {
  return (
    <div className="glass-card p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-surface-800">
        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
          <Filter size={16} className="text-primary-400" />
          Filter Products
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-surface-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="text-xs font-semibold uppercase text-surface-400 block mb-2 tracking-wider">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-field !py-2 text-xs"
        >
          <option value="featured">Featured / Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-semibold uppercase text-surface-400 block mb-2 tracking-wider">
          Category
        </label>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat === 'All' ? '' : cat)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                (cat === 'All' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
              }`}
            >
              <span>{cat}</span>
              {((cat === 'All' && !selectedCategory) || selectedCategory === cat) && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Max Budget / Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase text-surface-400 tracking-wider">
            Max Price
          </label>
          <span className="text-xs font-mono text-primary-300 font-bold">
            ₹{Number(maxPrice).toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="10000"
          step="500"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-[10px] text-surface-500 mt-1 font-mono">
          <span>₹500</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-xs font-semibold uppercase text-surface-400 block mb-2 tracking-wider">
          Minimum Rating
        </label>
        <div className="space-y-1">
          {ratings.map((r) => (
            <button
              key={r.value}
              onClick={() => onSelectRating(r.value)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedRating === r.value
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
