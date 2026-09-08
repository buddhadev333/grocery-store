import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileNav = () => {
  const location = useLocation();
  const { totalCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-2 px-3 shadow-lg flex items-center justify-around">
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
          isActive('/') ? 'text-emerald-700' : 'text-slate-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link 
        to="/catalog" 
        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
          isActive('/catalog') ? 'text-emerald-700' : 'text-slate-500'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span>Catalog</span>
      </Link>

      <Link 
        to="/wishlist" 
        className={`relative flex flex-col items-center gap-1 text-[10px] font-bold ${
          isActive('/wishlist') ? 'text-emerald-700' : 'text-slate-500'
        }`}
      >
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 right-2 bg-rose-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
        <span>Wishlist</span>
      </Link>

      <button 
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-1 text-[10px] font-bold text-slate-700"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-emerald-700" />
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
              {totalCount}
            </span>
          )}
        </div>
        <span>Basket</span>
      </button>
    </div>
  );
};

export default MobileNav;

