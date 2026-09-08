import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { ProductSection } from '../components/home/FeaturedRows';
import { ProductModal } from '../components/common/ProductModal';

export const HomePage = () => {
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Group items by requested sections
  const freshVeggies = products.filter(p => p.category === "Fresh Vegetables");
  const freshFruits = products.filter(p => p.category === "Fruits");
  const deals = products.filter(p => p.isDeal || p.discount >= 15);
  const bestSellers = products.filter(p => p.isBestseller);
  const chocolates = products.filter(p => p.category === "Chocolates & Candy");
  const biscuits = products.filter(p => p.category === "Biscuits");
  const snacks = products.filter(p => p.category === "Chips & Namkeen");
  const drinks = products.filter(p => p.category === "Soft Drinks & Beverages");
  const cookingEssentials = products.filter(p => 
    ["Rice & Grains", "Atta & Flour", "Dal & Pulses", "Cooking Oil & Ghee", "Spices & Masala"].includes(p.category)
  );
  const household = products.filter(p => 
    ["Cleaning & Household", "Personal Care"].includes(p.category)
  );
  const stationery = products.filter(p => p.category === "Stationery");
  const kitchen = products.filter(p => p.category === "Kitchen Items");
  const popular = products.filter(p => p.rating >= 4.8);
  const recommended = products.filter(p => p.isFeatured);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Shop by Category */}
      <CategoryGrid />

      {/* 3. Today's Deals */}
      <ProductSection
        title="Today's Special Deals"
        subtitle="Limited time discounts on top pantry essentials and snacks"
        items={deals}
        viewAllLink="/catalog?filter=deals"
        badgeText="🔥 Limited Time"
        badgeColor="bg-rose-100 text-rose-800"
        onQuickView={setSelectedProduct}
      />

      {/* 4. Best Sellers */}
      <ProductSection
        title="Best Sellers"
        subtitle="Most ordered items by Indian families this week"
        items={bestSellers}
        viewAllLink="/catalog?filter=bestseller"
        badgeText="⭐ Highly Rated"
        badgeColor="bg-amber-100 text-amber-800"
        onQuickView={setSelectedProduct}
      />

      {/* 5. Fresh Vegetables */}
      <ProductSection
        title="Fresh Vegetables"
        subtitle="Farm-fresh daily onions, potatoes, tomatoes, greens, and gourds"
        items={freshVeggies}
        viewAllLink="/category/fresh-vegetables"
        badgeText="🌱 Mandi Fresh"
        badgeColor="bg-emerald-100 text-emerald-800"
        onQuickView={setSelectedProduct}
      />

      {/* 6. Fresh Fruits */}
      <ProductSection
        title="Fresh Fruits"
        subtitle="Naturally ripened sweet Kashmiri apples, bananas, mangoes, and berries"
        items={freshFruits}
        viewAllLink="/category/fruits"
        badgeText="🍎 100% Ripe"
        badgeColor="bg-orange-100 text-orange-800"
        onQuickView={setSelectedProduct}
      />

      {/* 7. Chocolates & Candies */}
      <ProductSection
        title="Chocolates & Kids' Treats"
        subtitle="Cadbury Dairy Milk, KitKat, Dark Chocolate, Eclairs, and Toffees"
        items={chocolates}
        viewAllLink="/category/chocolates-candy"
        badgeText="🍫 Sweet Treats"
        badgeColor="bg-purple-100 text-purple-800"
        onQuickView={setSelectedProduct}
      />

      {/* 8. Biscuits & Cookies */}
      <ProductSection
        title="Biscuits & Chai Companions"
        subtitle="Parle-G, Good Day, Marie Gold, Bourbon, Monaco, and Hide & Seek"
        items={biscuits}
        viewAllLink="/category/biscuits"
        badgeText="🍪 Tea Time"
        badgeColor="bg-amber-100 text-amber-800"
        onQuickView={setSelectedProduct}
      />

      {/* 9. Kurkure & Snacks */}
      <ProductSection
        title="Kurkure, Chips & Namkeen"
        subtitle="Kurkure Masala Munch, Lay's, Haldiram's Aloo Bhujia, and Sev"
        items={snacks}
        viewAllLink="/category/chips-namkeen"
        badgeText="🌶️ Crispy & Spiced"
        badgeColor="bg-red-100 text-red-800"
        onQuickView={setSelectedProduct}
      />

      {/* 10. Soft Drinks & Beverages */}
      <ProductSection
        title="Cold Drinks & Refreshments"
        subtitle="Coca-Cola, Sprite, Thums Up, Maaza fruit drinks, and juices"
        items={drinks}
        viewAllLink="/category/soft-drinks-beverages"
        badgeText="🥤 Chilled Refreshment"
        badgeColor="bg-blue-100 text-blue-800"
        onQuickView={setSelectedProduct}
      />

      {/* 11. Cooking Essentials */}
      <ProductSection
        title="Cooking Essentials"
        subtitle="Pure Chakki Atta, Basmati Rice, Toor Dal, Mustard Oil, and Spices"
        items={cookingEssentials}
        viewAllLink="/catalog?filter=cooking"
        badgeText="🌾 Daily Staples"
        badgeColor="bg-yellow-100 text-yellow-800"
        onQuickView={setSelectedProduct}
      />

      {/* 12. Household & Cleaning Essentials */}
      <ProductSection
        title="Household & Cleaning Essentials"
        subtitle="Surf Excel, Vim gel, Lizol floor cleaners, and hygiene essentials"
        items={household}
        viewAllLink="/category/cleaning-household"
        badgeText="✨ Clean Home"
        badgeColor="bg-cyan-100 text-cyan-800"
        onQuickView={setSelectedProduct}
      />

      {/* 13. School & Office Stationery */}
      <ProductSection
        title="Stationery & Study Essentials"
        subtitle="Reynolds pens, Classmate notebooks, pencils, markers, and glues"
        items={stationery}
        viewAllLink="/category/stationery"
        badgeText="📚 Study & Office"
        badgeColor="bg-indigo-100 text-indigo-800"
        onQuickView={setSelectedProduct}
      />

      {/* 14. Kitchen Essentials */}
      <ProductSection
        title="Everyday Kitchen Items"
        subtitle="Milton bottles, tiffins, storage containers, stainless dinnerware, and foil"
        items={kitchen}
        viewAllLink="/category/kitchen-items"
        badgeText="🍳 Kitchen & Dining"
        badgeColor="bg-slate-200 text-slate-800"
        onQuickView={setSelectedProduct}
      />

      {/* 15. Popular Products */}
      <ProductSection
        title="Popular Products"
        subtitle="Customer favorites backed by top ratings and repeat orders"
        items={popular}
        viewAllLink="/catalog?sort=popular"
        badgeText="👍 Most Popular"
        badgeColor="bg-emerald-100 text-emerald-800"
        onQuickView={setSelectedProduct}
      />

      {/* 16. Recommended Products */}
      <ProductSection
        title="Recommended For Your Kitchen"
        subtitle="Handpicked trusted grocery staples for every Indian household"
        items={recommended}
        viewAllLink="/catalog?sort=recommended"
        badgeText="🌱 Handpicked"
        badgeColor="bg-brand-100 text-brand-900"
        onQuickView={setSelectedProduct}
      />

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default HomePage;

