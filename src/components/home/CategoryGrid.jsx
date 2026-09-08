import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { 
  Carrot, Apple, Flame, Wheat, Layers, CircleDot, Droplet, 
  Wine, Cookie, Sparkles, Gift, Coffee, CupSoda, HeartPulse, 
  Cake, Utensils, Milk, Croissant, Smile, Sparkle, Package, 
  PenTool, Baby, Bone, Sun, Compass 
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
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore our complete 26 Indian grocery & daily-need departments
          </p>
        </div>
        <Link 
          to="/catalog" 
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          View All &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Package;
          const count = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;

          return (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group bg-white rounded-xl p-3 border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 leading-tight line-clamp-2">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                {count} items
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
