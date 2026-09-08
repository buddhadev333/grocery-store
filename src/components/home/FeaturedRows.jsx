import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../common/ProductCard';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

export const ProductSection = ({ title, subtitle, items, viewAllLink, onQuickView, badgeText, badgeColor = "bg-emerald-100 text-emerald-800" }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {badgeText && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeColor}`}>
                {badgeText}
              </span>
            )}
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline shrink-0"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
        {items.slice(0, 12).map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
};
