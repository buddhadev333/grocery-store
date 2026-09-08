import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, MapPin, Settings, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductContext';

export const Navbar = ({ onOpenCategories }) => {
  const navigate = useNavigate();
  const { totalCount, sellingSubtotal, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { products, categories } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick matches for dropdown
  const suggestions = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.searchKeywords && p.searchKeywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())))
      ).slice(0, 6)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded">
              FREE DELIVERY
            </span>
            <span>On orders above ₹499 • Honest neighborhood grocery prices</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/orders" className="hover:text-white transition-colors">
              📦 Track Orders
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1">
              <Settings className="w-3 h-3" />
              Store Owner Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform p-1.5">
              <img src="/logo.svg" alt="FRESH NEST Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-xl tracking-tight text-emerald-900 leading-none">
                  FRESH
                </span>
                <span className="font-black text-xl tracking-tight text-amber-500 leading-none">
                  NEST
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 tracking-tight mt-0.5">
                Everything You Need, Freshly Delivered.
              </p>
            </div>
          </Link>

          {/* Delivery Location Pill (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200 text-xs shrink-0">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 leading-none">Delivering to Home</div>
              <div className="text-[11px] text-slate-500 truncate max-w-[140px]">45-60 Mins Express</div>
            </div>
          </div>

          {/* Search Bar with Instant Dropdown */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder='Search "onion", "kurkure", "chocolate", "oil", "biscuit", "pen"...'
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Instant Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Matching Products
                </div>
                {suggestions.map(p => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <img 
                      src={p.imageUrl} 
                      alt={p.name} 
                      className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.sizeWeight} • {p.category}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-slate-900">₹{p.sellingPrice}</div>
                      {p.discount > 0 && (
                        <div className="text-[10px] font-bold text-emerald-600">{p.discount}% OFF</div>
                      )}
                    </div>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 text-center flex items-center justify-center gap-1"
                >
                  View all results for "{searchQuery}" <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors hidden sm:flex items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-800/15 transition-all active:scale-[0.98]"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[10px] text-emerald-200 leading-none">Basket</div>
                <div className="text-xs font-extrabold leading-none mt-0.5">
                  {totalCount === 0 ? '₹0' : `₹${sellingSubtotal}`}
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* Category Quick Links Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2.5 pb-1 text-xs font-semibold text-slate-700 no-scrollbar">
          <Link
            to="/catalog"
            className="shrink-0 px-3 py-1 rounded-lg bg-emerald-100/70 text-emerald-900 hover:bg-emerald-200 transition-colors font-bold flex items-center gap-1.5"
          >
            <Menu className="w-3.5 h-3.5" />
            All 26 Categories
          </Link>
          {categories.slice(0, 10).map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="shrink-0 px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-emerald-800 transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/catalog?filter=deals"
            className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors font-bold whitespace-nowrap flex items-center gap-1"
          >
            🔥 Today's Deals
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;

