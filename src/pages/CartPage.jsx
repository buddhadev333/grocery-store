import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, mrpTotal, totalSavings, deliveryFee, finalTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'FRESH50' || couponCode.trim().toUpperCase() === 'WELCOME') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "FRESH50" or "WELCOME"');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-6 max-w-sm mx-auto">Looks like you haven't added any fresh groceries to your cart yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-800 transition shadow-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const freeDeliveryThreshold = 499;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">Shopping Cart ({cartItems.length} items)</h1>

      {/* Free Delivery Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 mb-8 shadow-sm">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            {remainingForFree === 0 ? (
              <span className="text-emerald-700 font-bold">🎉 Congratulations! You have qualified for FREE Delivery!</span>
            ) : (
              <span>Add <strong className="text-emerald-700">₹{remainingForFree}</strong> more to unlock <strong className="text-slate-800">FREE Delivery</strong></span>
            )}
          </span>
          <span className="text-xs font-bold text-slate-500">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Items in your cart</span>
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {cartItems.map(item => (
                <div key={item.id} className="p-4 sm:p-5 flex items-center gap-4 hover:bg-slate-50/60 transition">
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider block">{item.brand}</span>
                    <Link to={`/product/${item.id}`} className="font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-700 truncate block">
                      {item.name}
                    </Link>
                    <span className="text-xs text-slate-500 block mb-2">{item.sizeWeight}</span>

                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-slate-900">₹{item.sellingPrice * item.quantity}</span>
                      <span className="text-xs text-slate-400 line-through">₹{item.mrp * item.quantity}</span>
                      {item.mrp > item.sellingPrice && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Save ₹{(item.mrp - item.sellingPrice) * item.quantity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 py-1 text-xs sm:text-sm font-bold text-slate-900 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-2">
            <Link to="/products" className="text-emerald-700 font-bold hover:underline">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Bill Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 pb-4 mb-4 border-b border-slate-100">
              Bill Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items MRP Total</span>
                <span className="line-through">₹{mrpTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>FRESH NEST Price</span>
                <span className="font-semibold text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-lg">
                <span>Total Store Savings</span>
                <span>- ₹{totalSavings}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-lg">
                  <span>Special Promo (FRESH50)</span>
                  <span>- ₹50</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  <span>₹{deliveryFee}</span>
                )}
              </div>

              <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-extrabold text-slate-900 block">Total Amount</span>
                  <span className="text-[11px] text-slate-400">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-black text-slate-900">
                  ₹{Math.max(0, finalTotal - (couponApplied ? 50 : 0))}
                </span>
              </div>
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="mt-6 pt-5 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-600" /> Apply Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FRESH50"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-rose-600 text-xs mt-1.5">{couponError}</p>}
              {couponApplied && <p className="text-emerald-700 text-xs mt-1.5 font-bold">✓ Coupon Applied! ₹50 extra off.</p>}
            </form>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 mb-0.5">Safe & Contactless Delivery</p>
              <p>All grocery products are sealed and handled with highest food safety protocols.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
