import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();
const ORDERS_STORAGE_KEY = 'fresh_nest_orders_v1';

export const ORDER_STAGES = [
  { id: 1, key: 'Payment Submitted', label: 'Payment Submitted', desc: '12-digit UTR reference recorded from customer' },
  { id: 2, key: 'Payment Verified', label: 'Payment Verified & Confirmed', desc: 'Verified in Punjab National Bank by Buddhadev Bera' },
  { id: 3, key: 'Packed', label: 'Packed & Ready', desc: 'Carefully packed fresh from the store' },
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

  const createOrder = ({ customer, items, subtotal, discount, deliveryFee, total, paymentMethod, upiRef }) => {
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
      paymentMethod: paymentMethod || 'Official Store UPI (6297622545@naviaxis)',
      upiRef: upiRef || '',
      paymentStatus: 'Pending Verification',
      paymentVerified: false,
      verifiedBy: null,
      verifiedAt: null,
      status: 'Payment Submitted',
      estimatedDelivery: 'Today in 45-60 mins (After owner verification)',
      timeline: [
        { 
          status: 'Payment Submitted', 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          completed: true,
          details: `12-digit UPI UTR #${upiRef} submitted for PNB A/C 9276`
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrder = (orderId) => {
    return orders.find(o => o.id === orderId);
  };

  const verifyOrderPayment = (orderId, verifiedBy = 'Buddhadev Bera (Owner)') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const existingTimeline = order.timeline || [];
        const hasVerified = existingTimeline.some(t => t.status === 'Payment Verified');
        const updatedTimeline = hasVerified
          ? existingTimeline
          : [...existingTimeline, {
              status: 'Payment Verified',
              timestamp: timeStr,
              completed: true,
              details: `Payment verified in Punjab National Bank by ${verifiedBy}`
            }];

        return {
          ...order,
          status: 'Payment Verified',
          paymentStatus: 'Verified & Confirmed',
          paymentVerified: true,
          verifiedBy,
          verifiedAt: new Date().toISOString(),
          timeline: updatedTimeline
        };
      }
      return order;
    }));
  };

  const rejectOrderPayment = (orderId, reason = 'Payment not found in bank statement') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Payment Rejected',
          paymentStatus: 'Rejected',
          paymentVerified: false,
          rejectionReason: reason
        };
      }
      return order;
    }));
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
      verifyOrderPayment,
      rejectOrderPayment,
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
