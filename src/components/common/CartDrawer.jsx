import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    totalCount, 
    mrpSubtotal, 
    sellingSubtotal, 
    totalSavings, 
    deliveryFee, 
    finalTotal,
    freeDeliveryRemaining,
    freeDeliveryThreshold,
    isCartOpen, 
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const progressPercent = Math.min(100, Math.round((sellingSubtotal / freeDeliveryThreshold) * 100));

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h3 className="font-black text-slate-900 text-base">Your Grocery Basket</h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {totalCount} {totalCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Threshold Meter */}
        <div className="bg-emerald-50/70 p-3 border-b border-emerald-100 text-xs">
          {freeDeliveryRemaining > 0 ? (
            <div>
              <div className="flex justify-between font-bold text-emerald-950 mb-1">
                <span>Add ₹{freeDeliveryRemaining.toFixed(0)} more for FREE Delivery!</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Congratulations! You have unlocked FREE Delivery!</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-700 text-base">Your basket is empty</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Explore our groceries, pantry staples, and snacks to start saving!
              </p>
              <Link 
                to="/catalog" 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80";
                  }}
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{product.name}</h4>
                  <div className="text-[11px] text-slate-500">{product.sizeWeight}</div>
                  
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xs font-black text-slate-900">₹{product.sellingPrice}</span>
                    {product.mrp > product.sellingPrice && (
                      <span className="text-[11px] text-slate-400 line-through">₹{product.mrp}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold transition-colors shadow-sm"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-black text-xs text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold transition-colors shadow-sm"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right shrink-0 min-w-[50px]">
                  <div className="font-black text-xs text-slate-900">
                    ₹{(product.sellingPrice * quantity).toFixed(0)}
                  </div>
                  <button 
                    onClick={() => removeFromCart(product.id)}
                    className="text-slate-300 hover:text-rose-500 mt-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5 ml-auto" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            {/* Savings banner */}
            {totalSavings > 0 && (
              <div className="mb-3 bg-emerald-100/70 border border-emerald-200 rounded-xl p-2.5 text-center text-xs font-bold text-emerald-900">
                🎉 Total You Save at FRESH NEST: <span className="font-black text-emerald-700">₹{totalSavings.toFixed(0)}</span>
              </div>
            )}

            {/* Bill summary */}
            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex justify-between">
                <span>MRP Subtotal:</span>
                <span className="line-through text-slate-400">₹{mrpSubtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-800">
                <span>FRESH NEST Price:</span>
                <span>₹{sellingSubtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                <span>To Pay:</span>
                <span className="text-emerald-800">₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
                title="Clear entire basket"
              >
                Clear
              </button>
              <button
                onClick={handleCheckoutClick}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/20 active:scale-[0.98] transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;

