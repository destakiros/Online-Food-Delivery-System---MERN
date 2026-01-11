
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  fetchOrders: () => Promise<void>;
  placeOrder: (orderData: any) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  updateReviewFeedback: (id: string, feedback: 'Helpful' | 'Not Helpful') => Promise<void>;
  setCurrentOrder: (order: Order | null) => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { user, addNotification } = useAuth();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.warn('Backend link idle.');
    }
  };

  const placeOrder = async (orderData: any) => {
    const userId = user?.id || 'guest-' + Math.random().toString(36).substr(2, 5);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Mock processing for simulation
    const mockOrder: Order = {
      _id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      user: userId,
      orderItems: orderData.orderItems,
      totalPrice: orderData.totalPrice,
      destination: orderData.destination,
      deliveryFee: orderData.deliveryFee,
      status: 'Pending',
      paymentMethod: orderData.paymentMethod,
      bankName: orderData.bankName,
      accountNumber: orderData.accountNumber,
      paymentReceipt: orderData.paymentReceipt,
      extraMessage: orderData.extraMessage,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      createdAt: new Date().toISOString(),
      history: [{ status: 'Pending', time: timeStr }]
    };

    setOrders(prev => [mockOrder, ...prev]);
    setCurrentOrder(mockOrder);
    
    // In real app we would send to API here
    // await api.post('/orders', mockOrder);
  };

  const updateStatus = async (id: string, status: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(o => {
      if (o._id === id) {
        addNotification(typeof o.user === 'string' ? o.user : (o.user as any).id, `Order updated to: ${status}`);
        return { ...o, status: status as any, history: [...(o.history || []), { status, time: timeStr }] };
      }
      return o;
    }));
  };

  const updateReviewFeedback = async (id: string, feedback: 'Helpful' | 'Not Helpful') => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, adminFeedback: feedback } : o));
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      currentOrder, 
      fetchOrders, 
      placeOrder, 
      updateStatus,
      updateReviewFeedback,
      setCurrentOrder,
      setOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
