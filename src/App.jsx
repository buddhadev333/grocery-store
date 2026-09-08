import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout & Common
import Navbar from './components/common/Navbar';
import CartDrawer from './components/common/CartDrawer';
import MobileNav from './components/common/MobileNav';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import WishlistPage from './pages/WishlistPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <ScrollToTop />
      
      {/* Top Main Navigation */}
      <Navbar />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Main Page Content */}
      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Catalog & Products */}
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          
          {/* Cart & Checkout Flow */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          
          {/* Order Tracking */}
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />
          <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
          
          {/* Wishlist */}
          <Route path="/wishlist" element={<WishlistPage />} />
          
          {/* Admin & Owner Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Bottom Footer */}
      <Footer />

      {/* Bottom Nav on Mobile Devices */}
      <MobileNav />
    </div>
  );
}
