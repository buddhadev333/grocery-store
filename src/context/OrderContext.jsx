import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();
const ORDERS_STORAGE_KEY = 'fresh_nest_orders_v1';

export const ORDER_STAGES = [
  { id: 1, key: 'Order Placed', label: 'Order Placed', desc: 'We have received your order' },
  { id: 2, key: 'Confirmed', label: 'Confirmed', desc: 'Store has verified item availability' },
  { id: 3, key: 'Packed', label: 'Packed & Dispatched', desc: 'Carefully packed fresh from the nest' },
  { id: 4, key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Delivery partner is on the way to your doorstep' },
  { id: 5, key: 'Delivered', label: 'Delivered', desc: 'Package handed over successfully' }
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const createOrder = ({ customer, items, subtotal, discount, deliveryFee, total, paymentMethod }) => {
    const orderId = `FN${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      paymentMethod,
      status: 'Order Placed',
      estimatedDelivery: 'Today in 45-60 mins',
      timeline: [
        { status: 'Order Placed', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrder = (orderId) => {
    return orders.find(o => o.id === orderId);
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const existingTimeline = order.timeline || [];
        const alreadyHasStage = existingTimeline.some(t => t.status === nextStatus);
        
        const newTimeline = alreadyHasStage 
          ? existingTimeline 
          : [...existingTimeline, { status: nextStatus, timestamp: timeStr, completed: true }];

        return {
          ...order,
          status: nextStatus,
          timeline: newTimeline
        };
      }
      return order;
    }));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      getOrder,
      updateOrderStatus,
      stages: ORDER_STAGES
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
