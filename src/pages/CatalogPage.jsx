import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductModal } from '../components/common/ProductModal';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Star, Check } from 'lucide-react';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // URL query params
  const initialQuery = searchParams.get('q') || '';
  const initialFilter = searchParams.get('filter') || '';
  const initialSort = searchParams.get('sort') || 'recommended';

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);

  // Sync with URL query when it changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);
    
    const filter = searchParams.get('filter');
    if (filter === 'deals') {
      setMinDiscount(10);
    } else if (filter === 'bestseller') {
      // Handled in filter logic
    }
  }, [searchParams]);

  // Unique brands across current products
  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort();
  }, [products]);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const isDealsOnly = searchParams.get('filter') === 'deals';
    const isBestsellerOnly = searchParams.get('filter') === 'bestseller';

    return products.filter(p => {
      // 1. Text Search across name, brand, category, subcategory, keywords
      if (query) {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesSubcat = p.subcategory && p.subcategory.toLowerCase().includes(query);
        const matchesKeywords = p.searchKeywords && p.searchKeywords.some(k => k.toLowerCase().includes(query));

        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSubcat && !matchesKeywords) {
          return false;
        }
      }

      // 2. Special URL filters
      if (isDealsOnly && !p.isDeal && p.discount < 10) return false;
      if (isBestsellerOnly && !p.isBestseller) return false;

      // 3. Category Filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
        return false;
      }

      // 4. Brand Filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // 5. Price Filter
      if (p.sellingPrice > maxPrice) {
        return false;
      }

      // 6. Rating Filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // 7. Discount Filter
      if (minDiscount > 0 && p.discount < minDiscount) {
        return false;
      }

      // 8. Stock Filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategories, selectedBrands, maxPrice, minRating, minDiscount, inStockOnly, searchParams]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.sellingPrice - b.sellingPrice);
      case 'price-high':
        return list.sort((a, b) => b.sellingPrice - a.sellingPrice);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => b.discount - a.discount);
      case 'popular':
        return list.sort((a, b) => b.reviewsCount - a.reviewsCount);
      case 'newest':
        return list.sort((a, b) => b.id.localeCompare(a.id));
      case 'recommended':
      default:
        return list.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [filteredProducts, sortBy]);

  const handleCategoryToggle = (catName) => {
    setSelectedCategories(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const handleBrandToggle = (brandName) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(1000);
    setMinRating(0);
    setMinDiscount(0);
    setInStockOnly(false);
    setSortBy('recommended');
    setSearchParams({});
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + (minRating > 0 ? 1 : 0) + (minDiscount > 0 ? 1 : 0) + (inStockOnly ? 1 : 0) + (maxPrice < 1000 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Complete Grocery Catalog'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-800">{sortedProducts.length}</span> products with verified fair pricing
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="recommended">Recommended</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6 items-start">
        
        {/* DESKTOP FILTERS SIDEBAR */}
        <aside className="hidden md:block col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>Filter Catalog</span>
            </div>
            {activeFiltersCount > 0 && (
              <button 
                onClick={resetAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* In Stock Only Switch */}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
              <span>Max Price</span>
              <span className="text-emerald-700 font-black">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹20</span>
              <span>₹1000+</span>
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
              Categories
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryToggle(cat.name)}
                    className="w-3.5 h-3.5 rounded text-emerald-700 border-slate-300 focus:ring-emerald-600"
                  />
                  <span className="truncate">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          <div>
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
              Top Brands
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {allBrands.slice(0, 20).map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-3.5 h-3.5 rounded text-emerald-700 border-slate-300 focus:ring-emerald-600"
                  />
                  <span className="truncate">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount Filter */}
          <div>
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
              Discount
            </h4>
            <div className="space-y-1.5 text-xs">
              {[10, 15, 20, 25].map(disc => (
                <label key={disc} className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                  <input
                    type="radio"
                    name="discountFilter"
                    checked={minDiscount === disc}
                    onChange={() => setMinDiscount(disc === minDiscount ? 0 : disc)}
                    className="text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>{disc}% or more</span>
                </label>
              ))}
              {minDiscount > 0 && (
                <button 
                  onClick={() => setMinDiscount(0)} 
                  className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold mt-1"
                >
                  Clear discount filter
                </button>
              )}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2.5">
              Customer Rating
            </h4>
            <div className="space-y-1.5 text-xs">
              {[4.8, 4.5, 4.0].map(rating => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                  <input
                    type="radio"
                    name="ratingFilter"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating === minRating ? 0 : rating)}
                    className="text-emerald-700 focus:ring-emerald-600"
                  />
                  <span className="flex items-center gap-1 font-semibold">
                    {rating}★ and above
                  </span>
                </label>
              ))}
              {minRating > 0 && (
                <button 
                  onClick={() => setMinRating(0)} 
                  className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold mt-1"
                >
                  Clear rating filter
                </button>
              )}
            </div>
          </div>

        </aside>

        {/* PRODUCTS GRID */}
        <main className="col-span-1 md:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-800 text-lg">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                We couldn't find any products matching your active filters or search terms. Try loosening your criteria.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-xs h-full p-5 overflow-y-auto shadow-2xl flex flex-col space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-slate-900 text-base">Filter Products</h3>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">Categories</h4>
              <div className="max-h-48 overflow-y-auto space-y-1.5 text-xs">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryToggle(cat.name)}
                      className="w-3.5 h-3.5 rounded text-emerald-700 border-slate-300"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Max Price</span>
                <span className="text-emerald-700">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={resetAllFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 flex-1"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 font-bold text-xs text-white flex-1"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
};

export default CatalogPage;

