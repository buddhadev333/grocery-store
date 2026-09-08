import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Truck, Clock, HeartHandshake, Settings, 
  Phone, Mail, MapPin, UserCheck, Sparkles, Lock, ArrowRight 
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-14 pb-20 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Pillars Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Delivery</h4>
              <p className="text-xs text-slate-400">Fresh to your doorstep in 45-60 mins</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Honest Prices</h4>
              <p className="text-xs text-slate-400">Affordable everyday Indian market rates</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Sourcing</h4>
              <p className="text-xs text-slate-400">Daily mandi fresh fruits & vegetables</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</h4>
              <p className="text-xs text-slate-400">Friendly local store service & support</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-slate-800 text-xs">
          
          {/* Column 1 & 2: Store Info & Owner Attribution */}
          <div className="sm:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center p-1.5 shadow-md">
                <img src="/logo.svg" alt="FRESH NEST Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                FRESH <span className="text-amber-400">NEST</span>
              </span>
            </Link>

            {/* Clear Owner Attribution Highlight Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-extrabold text-white text-xs">
                  Store Leadership & Ownership
                </span>
              </div>
              <div className="space-y-1 mb-2">
                <p className="font-bold text-emerald-400 text-sm">
                  Buddhadev Bera — <span className="text-white font-semibold text-xs">Owner</span>
                </p>
                <p className="font-bold text-amber-300 text-sm">
                  Lakshmi Kanta Bera — <span className="text-white font-semibold text-xs">Co-Owner</span>
                </p>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                "We are dedicated to making healthy, fresh groceries and everyday essentials affordable and easily accessible for every neighborhood family."
              </p>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              "Everything You Need, Freshly Delivered."<br/>
              FRESH NEST is your local neighborhood grocery store delivering quality pulses, spices, flour, fresh fruits, vegetables, drinks, chocolates, and household daily-needs.
            </p>

            {/* Contact Section with User Provided Details */}
            <div className="pt-2 text-[11px] text-slate-300 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Store Address:</span>
                  <span className="text-slate-300">West Bengal, Rankinipur, Borachira, Near Huli Mondir, India</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Phone: <a href="tel:6297622545" className="font-bold text-white hover:text-emerald-400 transition-colors">+91 6297622545</a>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Email: <a href="mailto:buddhadevbera615@gmail.com" className="font-bold text-white hover:text-emerald-400 transition-colors">buddhadevbera615@gmail.com</a>
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Grocery Categories */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
              <span>Grocery Categories</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/category/fresh-vegetables" className="hover:text-emerald-400 transition-colors">Vegetables</Link></li>
              <li><Link to="/category/fruits" className="hover:text-emerald-400 transition-colors">Fresh Fruits</Link></li>
              <li><Link to="/category/rice-grains" className="hover:text-emerald-400 transition-colors">Rice & Grains</Link></li>
              <li><Link to="/category/dal-pulses" className="hover:text-emerald-400 transition-colors">Pulses & Dal</Link></li>
              <li><Link to="/category/cooking-oil-ghee" className="hover:text-emerald-400 transition-colors">Cooking Oil & Ghee</Link></li>
              <li><Link to="/category/spices-masala" className="hover:text-emerald-400 transition-colors">Spices & Masala</Link></li>
              <li><Link to="/category/atta-flour" className="hover:text-emerald-400 transition-colors">Atta & Flours</Link></li>
              <li><Link to="/category/dairy" className="hover:text-emerald-400 transition-colors">Dairy, Bread & Eggs</Link></li>
            </ul>
          </div>

          {/* Column 4: Daily Needs & Snacks */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Daily Essentials
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/category/biscuits" className="hover:text-emerald-400 transition-colors">Biscuits & Cookies</Link></li>
              <li><Link to="/category/chocolates-candy" className="hover:text-emerald-400 transition-colors">Chocolates & Candy</Link></li>
              <li><Link to="/category/chips-namkeen" className="hover:text-emerald-400 transition-colors">Snacks & Namkeen</Link></li>
              <li><Link to="/category/sauces-vinegar" className="hover:text-emerald-400 transition-colors">Sauces & Vinegar</Link></li>
              <li><Link to="/category/soft-drinks-beverages" className="hover:text-emerald-400 transition-colors">Cold Drinks & Beverages</Link></li>
              <li><Link to="/category/stationery" className="hover:text-emerald-400 transition-colors">Stationery Essentials</Link></li>
              <li><Link to="/category/cleaning-household" className="hover:text-emerald-400 transition-colors">Household Essentials</Link></li>
              <li><Link to="/category/personal-care" className="hover:text-emerald-400 transition-colors">Personal Care</Link></li>
            </ul>
          </div>

          {/* Column 5: Owner & Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Owner & Store Access
            </h4>
            <ul className="space-y-2 text-slate-400 mb-5">
              <li><Link to="/catalog" className="hover:text-emerald-400 transition-colors">All 378 Products</Link></li>
              <li><Link to="/orders" className="hover:text-emerald-400 transition-colors">Track Live Orders</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-400 transition-colors">Shopping Basket</Link></li>
              <li><Link to="/wishlist" className="hover:text-emerald-400 transition-colors">Saved Wishlist</Link></li>
            </ul>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                Owner & Co-Owner Portal
              </span>
              <p className="text-[11px] text-slate-400 mb-2 leading-tight">
                Secure price & product management for Buddhadev Bera & Lakshmi Kanta Bera.
              </p>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Owner Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>&copy; 2026 All Rights Reserved.</span>
            <span>•</span>
            <span className="text-slate-400 font-medium">FRESH NEST Store</span>
            <span>•</span>
            <span className="text-slate-300 font-bold">Buddhadev Bera (Owner)</span>
            <span>&</span>
            <span className="text-slate-300 font-bold">Lakshmi Kanta Bera (Co-Owner)</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/catalog" className="hover:text-slate-300">Catalog</Link>
            <Link to="/orders" className="hover:text-slate-300">Track Order</Link>
            <Link to="/wishlist" className="hover:text-slate-300">Wishlist</Link>
            <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-semibold">Owner Admin</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
