
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfiguredItem } from '../types';

interface CartContextType {
  cart: ConfiguredItem[];
  addToCart: (item: ConfiguredItem) => void;
  removeFromCart: (configHash: string) => void;
  updateQty: (hash: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ConfiguredItem[]>([]);

  const getHash = (item: ConfiguredItem) => {
    return `${item.foodId}-${item.selectedSize}-${item.selectedSauce}-${item.selectedToppings.sort().join(',')}-${JSON.stringify(item.modifiers)}-${item.cookingPreference}`;
  };

  const addToCart = (item: ConfiguredItem) => {
    setCart(prev => {
      const hash = getHash(item);
      const existing = prev.find(i => (i as any)._hash === hash);
      if (existing) {
        return prev.map(i => (i as any)._hash === hash ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, _hash: hash } as any];
    });
  };

  const updateQty = (hash: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if ((item as any)._hash === hash) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (hash: string) => {
    setCart(prev => prev.filter(i => (i as any)._hash !== hash));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
