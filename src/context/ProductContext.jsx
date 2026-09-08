import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProducts from '../data/products.json';
import { CATEGORIES } from '../data/categories';

const ProductContext = createContext();

const STORAGE_KEY = 'fresh_nest_catalog_v1';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading products from localStorage:", e);
    }
    return initialProducts;
  });

  // Save to localStorage whenever products change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Error saving products to localStorage:", e);
    }
  }, [products]);

  // Update a single product's price and auto-calculate discount & savings
  const updateProductPrice = (productId, mrp, sellingPrice) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const numMrp = parseFloat(mrp);
        const numPrice = parseFloat(sellingPrice);
        const discount = numMrp > numPrice ? Math.round(((numMrp - numPrice) / numMrp) * 100) : 0;
        const savings = Math.max(0, parseFloat((numMrp - numPrice).toFixed(2)));
        return {
          ...p,
          mrp: numMrp,
          sellingPrice: numPrice,
          discount,
          savingsAmount: savings
        };
      }
      return p;
    }));
  };

  // Update any product attributes
  const updateProduct = (productId, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updated = { ...p, ...updatedFields };
        if (updatedFields.mrp !== undefined || updatedFields.sellingPrice !== undefined) {
          const numMrp = parseFloat(updated.mrp);
          const numPrice = parseFloat(updated.sellingPrice);
          updated.discount = numMrp > numPrice ? Math.round(((numMrp - numPrice) / numMrp) * 100) : 0;
          updated.savingsAmount = Math.max(0, parseFloat((numMrp - numPrice).toFixed(2)));
        }
        return updated;
      }
      return p;
    }));
  };

  // Add a new product
  const addProduct = (newProduct) => {
    const numMrp = parseFloat(newProduct.mrp);
    const numPrice = parseFloat(newProduct.sellingPrice);
    const discount = numMrp > numPrice ? Math.round(((numMrp - numPrice) / numMrp) * 100) : 0;
    const savings = Math.max(0, parseFloat((numMrp - numPrice).toFixed(2)));
    
    const formatted = {
      ...newProduct,
      id: `fn_${Date.now()}`,
      mrp: numMrp,
      sellingPrice: numPrice,
      discount,
      savingsAmount: savings,
      stock: parseInt(newProduct.stock) || 50,
      rating: parseFloat(newProduct.rating) || 4.5,
      reviewsCount: parseInt(newProduct.reviewsCount) || 10,
      searchKeywords: (newProduct.searchKeywords || []).concat([
        newProduct.name.toLowerCase(),
        newProduct.brand.toLowerCase(),
        newProduct.category.toLowerCase()
      ])
    };
    setProducts(prev => [formatted, ...prev]);
    return formatted;
  };

  // Delete product
  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Bulk Price Update Tool
  const bulkUpdatePrices = ({ category, action, value }) => {
    const numVal = parseFloat(value);
    if (isNaN(numVal)) return 0;

    let count = 0;
    setProducts(prev => prev.map(p => {
      if (category === 'all' || p.category.toLowerCase() === category.toLowerCase()) {
        count++;
        let newPrice = p.sellingPrice;
        if (action === 'percent_off_mrp') {
          newPrice = Math.max(1, Math.round(p.mrp * (1 - (numVal / 100))));
        } else if (action === 'percent_change_selling') {
          newPrice = Math.max(1, Math.round(p.sellingPrice * (1 + (numVal / 100))));
        } else if (action === 'flat_discount_off_mrp') {
          newPrice = Math.max(1, Math.round(p.mrp - numVal));
        }
        if (newPrice > p.mrp) newPrice = p.mrp;

        const discount = p.mrp > newPrice ? Math.round(((p.mrp - newPrice) / p.mrp) * 100) : 0;
        const savings = Math.max(0, parseFloat((p.mrp - newPrice).toFixed(2)));

        return {
          ...p,
          sellingPrice: newPrice,
          discount,
          savingsAmount: savings
        };
      }
      return p;
    }));
    return count;
  };

  // Reset to original 378 product demo catalog
  const resetToDemo = () => {
    setProducts(initialProducts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories: CATEGORIES,
      updateProductPrice,
      updateProduct,
      addProduct,
      deleteProduct,
      bulkUpdatePrices,
      resetToDemo
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
};
