import React from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Badge } from './Badge';

export const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  const { cart, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const cartItem = cart[product.id];
  const qty = cartItem ? cartItem.quantity : 0;
  const isWishlisted = isInWishlist(product.id);

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Image & Badges */}
            <div className="relative bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center h-64 md:h-72">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.badge && <Badge text={product.badge} />}
                {product.discount > 0 && (
                  <span className="bg-emerald-700 text-white font-black text-xs px-2 py-0.5 rounded shadow">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Details & Pricing */}
            <div className="flex flex-col">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {product.brand} • {product.category}
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-2">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-bold text-xs">
                  <span>{product.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-xs text-slate-500">
                  {product.reviewsCount} customer reviews
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {product.sizeWeight}
                </span>
              </div>

              {/* Specification Required Price Box:
                  FRESH NEST Price: ₹599
                  MRP: ₹650
                  You Save: ₹51
              */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-bold text-emerald-900">FRESH NEST Price:</span>
                  <span className="text-2xl font-black text-slate-900">₹{product.sellingPrice}</span>
                </div>
                
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-medium text-slate-500">MRP:</span>
                  <span className="text-sm text-slate-400 line-through font-medium">₹{product.mrp}</span>
                </div>

                {product.savingsAmount > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-emerald-700">
                    <span className="text-xs font-bold">You Save:</span>
                    <span className="text-sm font-black">₹{product.savingsAmount} ({product.discount}% OFF)</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-auto">
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                      product.stock === 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-[0.98]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Basket
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-between bg-emerald-700 text-white rounded-xl p-1.5 font-bold shadow-sm">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-10 h-9 rounded-lg bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center transition-colors text-base"
                    >
                      -
                    </button>
                    <span className="px-4 font-black text-base">{qty} in basket</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-10 h-9 rounded-lg bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center transition-colors text-base"
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-colors ${
                    isWishlisted 
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Fair & Honest Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Fast Neighborhood Delivery</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

