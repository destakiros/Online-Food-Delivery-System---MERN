
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Food } from '../types';

interface MenuContextType {
  menuItems: Food[];
  loading: boolean;
  categories: string[];
  addFood: (food: Omit<Food, '_id'>) => void;
  deleteFood: (id: string) => void;
  updateFood: (id: string, food: Partial<Food>) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const PIZZA_SIZES = [{ name: 'Medium', priceOffset: 0 }, { name: 'Large', priceOffset: 250 }];
const BURGER_SIZES = [{ name: 'Single', priceOffset: 0 }, { name: 'Double', priceOffset: 120 }];
const DRINK_SIZES = [
  { name: 'Small', priceOffset: 0 }, 
  { name: 'Medium', priceOffset: 15 }, 
  { name: 'Large', priceOffset: 30 }
];

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<Food[]>([
    { _id: 'b1', name: 'Signature Beef Stack', category: 'Burger', price: 320, description: 'Double beef stack with melted cheddar and fresh crisp vegetables.', ingredients: ['Beef', 'Cheddar', 'Onion', 'Lettuce', 'Tomato'], spicyLevel: 'None', sizeOptions: BURGER_SIZES, availableToppings: [], availableSauces: [], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'b2', name: 'Jalapeno Inferno', category: 'Burger', price: 340, description: 'Vivid spicy profile featuring fresh sliced jalapenos.', ingredients: ['Beef', 'Jalapenos', 'Pepper Jack', 'Onion'], spicyLevel: 'Hot', sizeOptions: BURGER_SIZES, availableToppings: [], availableSauces: [], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'p1', name: 'Classic Margherita', category: 'Pizza', price: 420, description: 'Vibrant fresh basil leaves over premium melted mozzarella.', ingredients: ['Basil', 'Mozzarella', 'Tomato Sauce'], spicyLevel: 'None', sizeOptions: PIZZA_SIZES, availableToppings: [], availableSauces: [], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'd1', name: 'Coca Cola', category: 'Drinks', price: 60, description: 'The original refreshing cola in a classic cold glass.', ingredients: ['Coke'], spicyLevel: 'None', sizeOptions: DRINK_SIZES, availableToppings: [], availableSauces: [], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=1000' }
  ]);

  const categories = ['All', 'Burger', 'Pizza', 'Drinks'];

  const addFood = (food: Omit<Food, '_id'>) => setMenuItems(prev => [...prev, { ...food, _id: Date.now().toString() } as Food]);
  const deleteFood = (id: string) => setMenuItems(prev => prev.filter(f => f._id !== id));
  const updateFood = (id: string, food: Partial<Food>) => setMenuItems(prev => prev.map(f => f._id === id ? { ...f, ...food } : f));

  return (
    <MenuContext.Provider value={{ menuItems, loading: false, categories, addFood, deleteFood, updateFood }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within MenuProvider');
  return context;
};
