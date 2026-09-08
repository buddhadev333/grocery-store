import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const CART_STORAGE_KEY = 'fresh_nest_cart_v1';
const FREE_DELIVERY_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 30;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const current = prev[product.id];
      const newQty = current ? current.quantity + quantity : quantity;
      return {
        ...prev,
        [product.id]: {
          ...product,
          product,
          quantity: newQty
        }
      };
    });
  };

  const updateQuantity = (productId, deltaOrQty) => {
    setCart(prev => {
      const current = prev[productId];
      if (!current) return prev;
      
      let newQty;
      // If delta is -1 or 1, treat as relative delta
      if (deltaOrQty === -1 || deltaOrQty === 1) {
        newQty = current.quantity + deltaOrQty;
      } else {
        // Otherwise treat as absolute new target quantity
        newQty = deltaOrQty;
      }

      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }

      return {
        ...prev,
        [productId]: {
          ...current,
          quantity: newQty
        }
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  // Calculations
  const rawItems = Object.values(cart);
  const cartItems = rawItems.map(item => ({
    ...item.product,
    ...item,
    product: item.product || item
  }));

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const mrpSubtotal = cartItems.reduce((acc, item) => {
    const mrp = item.product?.mrp || item.mrp || 0;
    return acc + (mrp * item.quantity);
  }, 0);

  const sellingSubtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.sellingPrice || item.sellingPrice || 0;
    return acc + (price * item.quantity);
  }, 0);

  const totalSavings = Math.max(0, mrpSubtotal - sellingSubtotal);
  const deliveryFee = totalCount === 0 ? 0 : (sellingSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE);
  const finalTotal = sellingSubtotal + deliveryFee;
  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - sellingSubtotal);

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      totalCount,
      itemCount: totalCount,
      mrpSubtotal,
      mrpTotal: mrpSubtotal,
      sellingSubtotal,
      subtotal: sellingSubtotal,
      totalSavings,
      deliveryFee,
      finalTotal,
      freeDeliveryRemaining,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      isCartOpen,
      setIsCartOpen,
      setIsOpen: setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export default CartContext;
