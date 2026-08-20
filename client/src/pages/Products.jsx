import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      if (minRating > 0) params.minRating = minRating;
      if (maxPrice < 10000) params.maxPrice = maxPrice;
      if (sortBy !== 'featured') params.sort = sortBy;

      const { data } = await api.get('/products', { params });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, minRating, maxPrice, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleReset = () => {
    setCategory('');
    setSearch('');
    setMinRating(0);
    setMaxPrice(10000);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Product Catalog
          </h1>
          <p className="text-sm text-surface-400 mt-1">
            Explore verified high-quality items with instant AI recommendation integration
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands, specs..."
              className="input-field pl-10 !py-2.5 text-sm"
            />
          </form>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden btn-secondary !p-2.5"
            title="Toggle Filters"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-24">
          <ProductFilters
            selectedCategory={category}
            onSelectCategory={setCategory}
            selectedRating={minRating}
            onSelectRating={setMinRating}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleReset}
          />
        </div>

        {/* Mobile filter popup */}
        {mobileFilterOpen && (
          <div className="md:hidden col-span-12 mb-4">
            <ProductFilters
              selectedCategory={category}
              onSelectCategory={(c) => { setCategory(c); setMobileFilterOpen(false); }}
              selectedRating={minRating}
              onSelectRating={(r) => { setMinRating(r); setMobileFilterOpen(false); }}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No products found"
              message="Try adjusting your search criteria, price range, or category filters."
              action={
                <button onClick={handleReset} className="btn-secondary text-xs">
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-surface-400">
                  Showing <strong>{products.length}</strong> items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
