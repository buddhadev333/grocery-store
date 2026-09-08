import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { ProductSection } from '../components/home/FeaturedRows';
import { TrustSection } from '../components/home/TrustSection';
import { ProductModal } from '../components/common/ProductModal';

export const HomePage = () => {
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Group items by specific sections
  const popularProducts = useMemo(() => {
    return products
      .filter(p => p.rating >= 4.7 || p.isBestseller)
      .slice(0, 12);
  }, [products]);

  const bestDeals = useMemo(() => {
    return products
      .filter(p => p.isDeal || p.discount >= 15)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 12);
  }, [products]);

  const newArrivals = useMemo(() => {
    return products
      .filter(p => p.isFeatured || p.stock > 40)
      .slice(10, 22);
  }, [products]);

  const freshProduce = useMemo(() => {
    return products.filter(p => ["Fresh Vegetables", "Fruits"].includes(p.category));
  }, [products]);

  const pantryStaples = useMemo(() => {
    return products.filter(p => 
      ["Atta & Flour", "Rice & Grains", "Dal & Pulses", "Cooking Oil & Ghee", "Spices & Masala"].includes(p.category)
    );
  }, [products]);

  const snacksAndTreats = useMemo(() => {
    return products.filter(p => 
      ["Biscuits", "Chips & Namkeen", "Chocolates & Candy"].includes(p.category)
    );
  }, [products]);

  const drinksAndBeverages = useMemo(() => {
    return products.filter(p => 
      ["Soft Drinks & Beverages", "Tea & Coffee"].includes(p.category)
    );
  }, [products]);

  const householdAndCare = useMemo(() => {
    return products.filter(p => 
      ["Cleaning & Household", "Personal Care", "Stationery"].includes(p.category)
    );
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Trust & Store Information (Buddhadev Bera — Owner) */}
      <TrustSection />

      {/* 3. Shop by Category */}
      <CategoryGrid />

      {/* 4. Popular Products */}
      <ProductSection
        title="Popular Products"
        subtitle="Frequently purchased favorites loved by our neighborhood customers"
        items={popularProducts}
        viewAllLink="/catalog?sort=popular"
        badgeText="⭐ Highly Rated"
        badgeColor="bg-amber-100 text-amber-800"
        onQuickView={setSelectedProduct}
      />

      {/* 5. Best Deals */}
      <ProductSection
        title="Today's Best Deals"
        subtitle="Biggest everyday savings on pantry essentials, fresh produce, and treats"
        items={bestDeals}
        viewAllLink="/catalog?filter=deals"
        badgeText="🔥 Maximum Savings"
        badgeColor="bg-rose-100 text-rose-800"
        onQuickView={setSelectedProduct}
      />

      {/* 6. New Arrivals */}
      <ProductSection
        title="New Arrivals & Seasonal Picks"
        subtitle="Recently stocked family packs, organic specialties, and fresh inventory"
        items={newArrivals}
        viewAllLink="/catalog"
        badgeText="✨ Fresh Stock"
        badgeColor="bg-emerald-100 text-emerald-800"
        onQuickView={setSelectedProduct}
      />

      {/* 7. Fresh Vegetables & Fruits Spotlight */}
      <ProductSection
        title="Mandi Fresh Vegetables & Fruits"
        subtitle="Handpicked daily onions, potatoes, tomatoes, greens, apples, and bananas"
        items={freshProduce}
        viewAllLink="/category/fresh-vegetables"
        badgeText="🌱 Farm Direct"
        badgeColor="bg-green-100 text-green-800"
        onQuickView={setSelectedProduct}
      />

      {/* 8. Pantry Staples (Atta, Rice, Dal, Oil, Spices) */}
      <ProductSection
        title="Cooking Essentials & Grains"
        subtitle="Pure Chakki Atta, aged Basmati, unpolished Dals, Mustard Oil, and pure spices"
        items={pantryStaples}
        viewAllLink="/category/atta-flour"
        badgeText="🌾 Pure & Healthy"
        badgeColor="bg-yellow-100 text-yellow-800"
        onQuickView={setSelectedProduct}
      />

      {/* 9. Snacks, Biscuits & Chocolates */}
      <ProductSection
        title="Chai-Time Snacks & Chocolates"
        subtitle="Parle-G, Good Day, Kurkure, Cadbury Dairy Milk, KitKat, and sweets"
        items={snacksAndTreats}
        viewAllLink="/category/chips-namkeen"
        badgeText="🍪 Delicious"
        badgeColor="bg-purple-100 text-purple-800"
        onQuickView={setSelectedProduct}
      />

      {/* 10. Household, Cleaning & Personal Care */}
      <ProductSection
        title="Household Essentials & Care"
        subtitle="Detergents, dishwash, oral care, soaps, shampoos, and stationery supplies"
        items={householdAndCare}
        viewAllLink="/category/cleaning-household"
        badgeText="🧼 Daily Care"
        badgeColor="bg-teal-100 text-teal-800"
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
