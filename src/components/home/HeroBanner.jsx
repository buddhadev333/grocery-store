import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, ShieldCheck, Truck, Clock, 
  Search, CheckCircle2, ShoppingCart, UserCheck, Flame 
} from 'lucide-react';

export const HeroBanner = () => {
  const [quickSearch, setQuickSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 md:p-14 mb-12 shadow-2xl">
      {/* Decorative ambient background glows */}
      <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-24 w-80 h-80 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Owner & Official Store Verification Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Store • <strong className="text-white font-bold">Buddhadev Bera (Owner) &amp; Lakshmi Kanta Bera (Co-Owner)</strong></span>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <span>Owner Managed</span>
          </div>
        </div>

        {/* Requested Strong Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-4 text-white">
          Fresh Essentials,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-300">
            Everyday Convenience.
          </span>
        </h1>

        {/* Requested Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed mb-8 max-w-2xl font-normal">
          Easily find your daily grocery needs from farm-fresh vegetables and fruits to staple grains, cooking oils, chai-time snacks, chocolates, and household essentials at affordable, honest market prices.
        </p>

        {/* Integrated Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-8 max-w-xl">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-1.5 border border-white/40 focus-within:ring-4 focus-within:ring-emerald-400/50 transition">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              placeholder="Search 378+ groceries (e.g. Atta, Basmati Rice, Onion, Kurkure, Dairy Milk)..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-xl transition shrink-0 shadow-sm flex items-center gap-1.5"
            >
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Prominent Shop Now CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 mb-10">
          <Link
            to="/catalog"
            className="px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all duration-200"
          >
            <ShoppingCart className="w-5 h-5 text-slate-950" />
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/catalog?filter=deals"
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Today's Best Deals</span>
          </Link>
        </div>

        {/* Value Trust Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/15 text-[11px] sm:text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Fast Express Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>100% Genuine Items</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Mandi Fresh Daily</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
