import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { 
  Carrot, Apple, Flame, Wheat, Layers, CircleDot, Droplet, 
  Wine, Cookie, Sparkles, Gift, Coffee, CupSoda, HeartPulse, 
  Cake, Utensils, Milk, Croissant, Smile, Sparkle, Package, 
  PenTool, Baby, Bone, Sun, Compass, ArrowRight 
} from 'lucide-react';

const iconMap = {
  Carrot, Apple, Flame, Wheat, Layers, CircleDot, Droplet, 
  Wine, Cookie, Sparkles, Gift, Coffee, CupSoda, HeartPulse, 
  Cake, Utensils, Milk, Croissant, Smile, Sparkle, Package, 
  PenTool, Baby, Bone, Sun, Compass
};

export const CategoryGrid = () => {
  const { categories, products } = useProducts();

  return (
    <section className="mb-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2 inline-block">
            Aisle Explorer
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Carefully curated daily essentials, staples, and fresh produce for your kitchen
          </p>
        </div>
        <Link 
          to="/catalog" 
          className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
        >
          <span>View All 26 Departments</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Package;
          const count = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase() || p.categorySlug === cat.id).length;

          return (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center shadow-sm"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color || 'from-emerald-600 to-teal-700'} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 leading-snug line-clamp-2">
                {cat.name}
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1">
                {count > 0 ? `${count} items` : 'Explore'}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
