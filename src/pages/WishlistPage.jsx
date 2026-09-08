import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import { Heart, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlist.forEach(item => {
      addToCart(item, 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-medium">My Wishlist</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-600 fill-rose-600" />
            My Saved Items ({wishlist.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Keep track of items you plan to purchase regularly</p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddAllToCart}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" /> Add All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs sm:text-sm font-semibold px-3 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 text-slate-400" /> Clear
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-500 mb-6">
            Tap the heart icon on any grocery product to bookmark it for later quick reorders.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm"
          >
            Explore Groceries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
