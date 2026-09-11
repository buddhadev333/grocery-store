import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProducts from '../data/products.json';
import { CATEGORIES } from '../data/categories';
import { useAuth } from './AuthContext';

const ProductContext = createContext();
const STORAGE_KEY = 'fresh_nest_catalog_v2';

export const ProductProvider = ({ children }) => {
  const { authFetch, isOwner, user } = useAuth();

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(p => p.category !== 'Fresh Vegetables' && p.category !== 'Fruits');
        }
      }
    } catch (e) {
      console.error("Error reading products from localStorage:", e);
    }
    return initialProducts.filter(p => p.category !== 'Fresh Vegetables' && p.category !== 'Fruits');
  });

  // Save to localStorage whenever products change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Error saving products to localStorage:", e);
    }
  }, [products]);

  // SECURE: Update a single product's price through backend verification
  const updateProductPrice = async (productId, mrp, sellingPrice, badge) => {
    try {
      const res = await authFetch('/api/products/update-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, mrp, sellingPrice, badge })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Server rejected price modification.'
        };
      }

      // Backend authorized price change: update client state
      const { pricing } = data;
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            mrp: pricing.mrp,
            sellingPrice: pricing.sellingPrice,
            discount: pricing.discount,
            savingsAmount: pricing.savingsAmount,
            badge: pricing.badge || p.badge
          };
        }
        return p;
      }));

      return {
        success: true,
        message: data.message || `Price updated successfully by ${data.auditReceipt?.authorizedBy || 'Owner'}.`,
        auditReceipt: data.auditReceipt
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Network error communicating with price security API.'
      };
    }
  };

  // SECURE: Update product attributes through backend verification
  const updateProduct = async (productId, updatedFields) => {
    try {
      const res = await authFetch('/api/products/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_product',
          payload: { productId, updatedFields }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Product update failed authorization.'
        };
      }

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

      return { success: true, message: 'Product updated successfully.' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // SECURE: Update stock count (authorized for owner and staff)
  const updateStock = async (productId, newStock) => {
    try {
      const res = await authFetch('/api/products/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_stock',
          payload: { productId, stock: newStock }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error };
      }

      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return { ...p, stock: parseInt(newStock) || 0 };
        }
        return p;
      }));

      return { success: true, message: 'Stock updated successfully.' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // SECURE: Add a new product through backend verification
  const addProduct = async (newProduct) => {
    try {
      const res = await authFetch('/api/products/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_product',
          payload: newProduct
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error };
      }

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
      return { success: true, product: formatted, message: 'Product added successfully.' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // SECURE: Delete product through backend verification
  const deleteProduct = async (productId) => {
    try {
      const res = await authFetch('/api/products/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_product',
          payload: { productId }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error };
      }

      setProducts(prev => prev.filter(p => p.id !== productId));
      return { success: true, message: 'Product deleted successfully.' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // SECURE: Bulk Price Update Tool (Owner Only)
  const bulkUpdatePrices = async ({ category, action, value }) => {
    if (!isOwner) {
      return {
        success: false,
        error: 'Permission Denied: Only store owners (Buddhadev Bera & Lakshmi Kanta Bera) can run bulk price updates.'
      };
    }

    const numVal = parseFloat(value);
    if (isNaN(numVal)) {
      return { success: false, error: 'Invalid percentage or value provided.' };
    }

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

    return { success: true, count, message: `Updated pricing for ${count} product(s).` };
  };

  // Reset to original grocery catalog
  const resetToDemo = () => {
    const cleanList = initialProducts.filter(p => p.category !== 'Fresh Vegetables' && p.category !== 'Fruits');
    setProducts(cleanList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanList));
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
      updateStock,
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

export default ProductContext;
