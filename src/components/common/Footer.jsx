import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, HeartHandshake, Settings, Phone, Mail, MapPin } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-14 pb-20 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Value Pillars Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Delivery</h4>
              <p className="text-xs text-slate-400">Fresh to your doorstep in 45-60 mins</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Honest Prices</h4>
              <p className="text-xs text-slate-400">Affordable everyday Indian market rates</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Sourcing</h4>
              <p className="text-xs text-slate-400">Daily mandi fresh fruits & vegetables</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</h4>
              <p className="text-xs text-slate-400">Hassle-free instant refund & returns</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12 border-b border-slate-800 text-xs">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center p-1">
                <img src="/logo.svg" alt="FRESH NEST Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-lg tracking-tight text-white">
                FRESH <span className="text-amber-400">NEST</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              "Everything You Need, Freshly Delivered."<br/>
              FRESH NEST is your trusted neighborhood grocery and daily-needs store offering fair, realistic prices comparable to offline supermarkets and local mandis.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <div>📍 Support Center: Delhi NCR & Regional Hubs, India</div>
              <div>✉️ support@freshnestgrocery.in • 📞 1800-FRESH-NEST</div>
            </div>
          </div>

          {/* Popular Departments */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Popular Departments
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/category/fresh-vegetables" className="hover:text-emerald-400 transition-colors">Fresh Vegetables</Link></li>
              <li><Link to="/category/fruits" className="hover:text-emerald-400 transition-colors">Fresh Fruits</Link></li>
              <li><Link to="/category/rice-grains" className="hover:text-emerald-400 transition-colors">Rice & Grains</Link></li>
              <li><Link to="/category/atta-flour" className="hover:text-emerald-400 transition-colors">Atta & Flours</Link></li>
              <li><Link to="/category/cooking-oil-ghee" className="hover:text-emerald-400 transition-colors">Cooking Oil & Ghee</Link></li>
              <li><Link to="/category/dairy" className="hover:text-emerald-400 transition-colors">Dairy & Paneer</Link></li>
              <li><Link to="/category/chocolates-candy" className="hover:text-emerald-400 transition-colors">Chocolates & Candy</Link></li>
            </ul>
          </div>

          {/* More Departments */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Daily Essentials
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/category/chips-namkeen" className="hover:text-emerald-400 transition-colors">Kurkure & Snacks</Link></li>
              <li><Link to="/category/biscuits" className="hover:text-emerald-400 transition-colors">Biscuits & Cookies</Link></li>
              <li><Link to="/category/soft-drinks-beverages" className="hover:text-emerald-400 transition-colors">Soft Drinks & Juices</Link></li>
              <li><Link to="/category/cleaning-household" className="hover:text-emerald-400 transition-colors">Cleaning & Detergents</Link></li>
              <li><Link to="/category/kitchen-items" className="hover:text-emerald-400 transition-colors">Kitchen & Tableware</Link></li>
              <li><Link to="/category/stationery" className="hover:text-emerald-400 transition-colors">School & Office Stationery</Link></li>
              <li><Link to="/category/puja-essentials" className="hover:text-emerald-400 transition-colors">Puja Essentials</Link></li>
            </ul>
          </div>

          {/* Store Owner Admin */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Store Control
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Manage product prices, stock, category discounts, and scheduled sales without code rebuilds.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Store Owner Dashboard
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>&copy; 2026 FRESH NEST Grocery Store. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/catalog" className="hover:text-slate-300">Catalog</Link>
            <Link to="/orders" className="hover:text-slate-300">Track Order</Link>
            <Link to="/wishlist" className="hover:text-slate-300">Wishlist</Link>
            <Link to="/admin" className="hover:text-amber-400">Admin</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

