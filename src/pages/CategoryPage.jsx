import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/categories';
import ProductCard from '../components/common/ProductCard';
import ProductModal from '../components/common/ProductModal';
import { ChevronRight, ArrowLeft, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const { products } = useProducts();
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const category = useMemo(() => {
    return CATEGORIES.find(c => c.slug === categorySlug) || {
      id: categorySlug,
      name: categorySlug ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Category',
      icon: '🛍️',
      subcategories: []
    };
  }, [categorySlug]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = p.categorySlug === categorySlug || p.category.toLowerCase() === category.name.toLowerCase();
      if (!matchCat) return false;
      if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'price-high') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'discount') return b.discount - a.discount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'savings') return (b.mrp - b.sellingPrice) - (a.mrp - a.sellingPrice);
      return b.reviewsCount - a.reviewsCount;
    });
  }, [products, categorySlug, category.name, selectedSubcategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-emerald-700 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link to="/products" className="hover:text-emerald-700 transition">All Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-medium truncate">{category.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl sm:text-4xl">{category.icon || '🛍️'}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{category.name}</h1>
          </div>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
            Explore authentic fresh groceries, daily essentials, and affordable family packs directly from verified brands.
          </p>
        </div>
        <div className="text-xs sm:text-sm text-emerald-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl self-start sm:self-auto">
          Showing <span className="text-white font-bold">{filteredProducts.length}</span> Products
        </div>
      </div>

      {/* Subcategories Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        {/* Subcategory Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedSubcategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              selectedSubcategory === 'All'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({products.filter(p => p.categorySlug === categorySlug || p.category.toLowerCase() === category.name.toLowerCase()).length})
          </button>
          {category.subcategories?.map(sub => {
            const count = products.filter(p => (p.categorySlug === categorySlug || p.category.toLowerCase() === category.name.toLowerCase()) && p.subcategory === sub).length;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  selectedSubcategory === sub
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sub} {count > 0 && <span className="opacity-70 text-xs">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Biggest Discount (%)</option>
            <option value="savings">Maximum Savings (₹)</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
          <p className="text-sm text-slate-500 mb-4">No items matched the selected subcategory.</p>
          <button
            onClick={() => setSelectedSubcategory('All')}
            className="text-xs sm:text-sm bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-800 transition"
          >
            Show All {category.name}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
