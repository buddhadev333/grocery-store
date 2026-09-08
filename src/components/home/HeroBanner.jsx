import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';

export const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl md:rounded-3xl p-6 md:p-12 mb-10 shadow-xl">
      {/* Subtle decorative background circles */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-amber-500/15 blur-2xl pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl">
        {/* Quality Guarantee Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Fair Neighborhood Grocery Prices • No Hidden Markups</span>
        </div>

        {/* Main Headline & Tagline */}
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-3">
          Everything You Need,<br/>
          <span className="text-amber-400">Freshly Delivered.</span>
        </h1>

        <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed mb-6 max-w-xl">
          Buy fresh vegetables, fruits, daily dairy, staples, favorite snacks, chocolates, and household essentials at affordable, realistic Indian market prices.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link
            to="/catalog"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
          >
            <span>Explore All 26 Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/catalog?filter=deals"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all"
          >
            🔥 View Today's Deals
          </Link>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-[11px] md:text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>45-60 Mins Express</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>100% Genuine Brands</span>
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
