import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';
import Badge from '../components/common/Badge';
import { 
  Star, Heart, ShoppingBag, Plus, Minus, Truck, ShieldCheck, 
  RotateCcw, Clock, ChevronRight, Share2, CheckCircle2 
} from 'lucide-react';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { cartItems, addToCart, updateQuantity, setIsOpen: openCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [copied, setCopied] = useState(false);

  const product = useMemo(() => {
    return products.find(p => p.id === productId);
  }, [products, productId]);

  const cartItem = cartItems.find(item => item.id === product?.id);
  const qty = cartItem ? cartItem.quantity : 0;
  const inWishlist = product ? isInWishlist(product.id) : false;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
      .slice(0, 5);
  }, [products, product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-6">The item you're looking for doesn't exist or has been removed from our catalog.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-800 transition shadow-sm">
          Browse All Products
        </Link>
      </div>
    );
  }

  const savings = Math.max(0, product.mrp - product.sellingPrice);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuyNow = () => {
    if (qty === 0) {
      addToCart(product, 1);
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-emerald-700 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link to="/products" className="hover:text-emerald-700 transition">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link to={`/category/${product.categorySlug}`} className="hover:text-emerald-700 transition">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 mb-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-md bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg shadow-sm">
                  {product.discount}% OFF
                </div>
              )}
              {product.badge && (
                <div className="absolute top-4 right-4">
                  <Badge text={product.badge} />
                </div>
              )}
            </div>

            {/* Quick trust metrics under image */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-md mt-6 pt-6 border-t border-slate-100 text-center">
              <div className="flex flex-col items-center text-slate-600">
                <Truck className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">Fresh Delivery</span>
                <span className="text-[10px] text-slate-500">Same or Next Day</span>
              </div>
              <div className="flex flex-col items-center text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">100% Genuine</span>
                <span className="text-[10px] text-slate-500">Verified Quality</span>
              </div>
              <div className="flex flex-col items-center text-slate-600">
                <RotateCcw className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">Easy Returns</span>
                <span className="text-[10px] text-slate-500">Hassle Free</span>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
                  title="Share product"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-full transition ${
                    inWishlist 
                      ? 'text-rose-600 bg-rose-50' 
                      : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                  }`}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-600' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {product.sizeWeight}
              </span>
              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md text-amber-700 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Strict Indian Grocery Pricing Block */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">FRESH NEST Price:</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900">₹{product.sellingPrice}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-500">
                  MRP: <span className="line-through font-medium">₹{product.mrp}</span>
                </span>
                {savings > 0 && (
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-xs sm:text-sm">
                    You Save: ₹{savings} ({product.discount}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Inclusive of all taxes. Free delivery on orders above ₹499.</p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Product Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description || `Fresh and high quality ${product.name} sourced directly for your daily household needs. Packaged under hygienic conditions to maintain purity, freshness, and authentic taste.`}
              </p>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
              <span className="text-xs font-semibold text-slate-700">
                {product.stock > 10 ? 'In Stock (Ready to dispatch)' : product.stock > 0 ? `Only ${product.stock} left in stock - order soon` : 'Temporarily Out of Stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-slate-100">
              {qty === 0 ? (
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3 px-6 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
              ) : (
                <div className="flex-1 flex items-center justify-between border-2 border-emerald-600 rounded-xl px-4 py-2 bg-emerald-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-800">In Cart:</span>
                    <button
                      onClick={() => updateQuantity(product.id, qty - 1)}
                      className="w-8 h-8 rounded-lg bg-white text-emerald-800 flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition shadow-sm border border-emerald-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-emerald-900 text-base min-w-[20px] text-center">{qty}</span>
                    <button
                      onClick={() => updateQuantity(product.id, qty + 1)}
                      disabled={qty >= product.stock}
                      className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 active:scale-95 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => openCartDrawer(true)}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    View Cart
                  </button>
                </div>
              )}

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-900 font-bold py-3 px-6 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-center"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Specifications & Details */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Product Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Brand</span>
              <span className="text-sm font-semibold text-slate-800">{product.brand}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Department</span>
              <span className="text-sm font-semibold text-slate-800">{product.category}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Subcategory</span>
              <span className="text-sm font-semibold text-slate-800">{product.subcategory}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Net Quantity / Size</span>
              <span className="text-sm font-semibold text-slate-800">{product.sizeWeight}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Product ID</span>
              <span className="text-sm font-semibold text-slate-800 font-mono">{product.id}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Country of Origin</span>
              <span className="text-sm font-semibold text-slate-800">India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Similar Products in {product.category}</h2>
              <p className="text-xs sm:text-sm text-slate-500">Frequently bought together with this item</p>
            </div>
            <Link
              to={`/category/${product.categorySlug}`}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
