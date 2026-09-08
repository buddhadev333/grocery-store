import React from 'react';
import { Heart, Plus, Minus, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Badge } from './Badge';

export const ProductCard = ({ product, onQuickView }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const cartItem = cart[product.id];
  const qty = cartItem ? cartItem.quantity : 0;
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col h-full">
      
      {/* Top Badges & Wishlist Button */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.badge && <Badge text={product.badge} />}
        {product.discount > 0 && (
          <span className="bg-emerald-700 text-white font-extrabold text-[11px] px-1.5 py-0.5 rounded shadow-sm">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
          isWishlisted
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white border border-slate-200'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
      </button>

      {/* Product Image */}
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        className="w-full h-44 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer relative"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80";
          }}
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-1 left-2 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-xs uppercase">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-slate-500 mb-1">
          <span className="truncate">{product.brand}</span>
          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold text-[10px] shrink-0">
            {product.sizeWeight}
          </span>
        </div>

        <h3 
          onClick={() => onQuickView && onQuickView(product)}
          className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 hover:text-emerald-700 cursor-pointer mb-2 min-h-[2.5rem]"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-2.5 text-xs">
          <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100 font-bold text-[11px]">
            <span>{product.rating}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
        </div>

        {/* Price Display Formatted Strictly According to Specification:
            ₹599
            ~~₹650~~
            8% OFF
        */}
        <div className="mt-auto pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900 tracking-tight">
              ₹{product.sellingPrice}
            </span>
            {product.mrp > product.sellingPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ₹{product.mrp}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-bold text-emerald-700">
                {product.discount}% OFF
              </span>
            )}
          </div>
          {product.savingsAmount > 0 && (
            <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              You Save: ₹{product.savingsAmount}
            </p>
          )}

          {/* Action Button */}
          <div className="mt-3">
            {qty === 0 ? (
              <button
                onClick={() => addToCart(product, 1)}
                disabled={product.stock === 0}
                className={`w-full py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  product.stock === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-600 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Basket
              </button>
            ) : (
              <div className="flex items-center justify-between bg-emerald-700 text-white rounded-lg p-1 text-xs font-bold shadow-sm">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="w-7 h-6 rounded bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-black">{qty}</span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="w-7 h-6 rounded bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;

