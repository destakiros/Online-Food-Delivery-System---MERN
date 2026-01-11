
import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import { Food, ConfiguredItem } from '../types';
import Modal from '../components/common/Modal';
import BackButton from '../components/common/BackButton';

interface Props {
  onBack: () => void;
  onNavigate?: (page: any) => void;
}

const MenuPage: React.FC<Props> = ({ onBack, onNavigate }) => {
  const { menuItems, categories } = useMenu();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [size, setSize] = useState('');
  const [modifiers, setModifiers] = useState<{ [key: string]: any }>({});
  const [notes, setNotes] = useState('');

  const categoryIcons: {[key: string]: string} = {
    'All': 'ph-squares-four',
    'Burger': 'ph-hamburger',
    'Pizza': 'ph-pizza',
    'Fried Food': 'ph-cooking-pot',
    'Chicken': 'ph-bird',
    'Drinks': 'ph-beer-bottle',
    'Dessert': 'ph-cake'
  };

  const openConfig = (food: Food) => {
    if (!isAuthenticated) {
      showToast("Access Denied: Please login to start ordering.", "error");
      return;
    }

    setSelectedFood(food);
    setSize(food.sizeOptions[0]?.name || 'Regular');
    setNotes('');
    
    // Initialize modifiers only for non-drinks
    const initialMods: any = {};
    if (food.category !== 'Drinks') {
      food.ingredients.forEach(ing => initialMods[ing] = 'Normal');
      // Add Salt and Spice by default if they are common modifiers, 
      // or rely purely on admin-defined ingredients.
      if (!initialMods['Salt']) initialMods['Salt'] = 'Normal';
      if (!initialMods['Spice']) initialMods['Spice'] = 'Normal';
    }
    setModifiers(initialMods);
  };

  const calculateCurrentPrice = () => {
    if (!selectedFood) return 0;
    let total = selectedFood.price;
    const sizeOpt = selectedFood.sizeOptions.find(s => s.name === size);
    if (sizeOpt) total += sizeOpt.priceOffset;
    
    // Only calculate modifier costs for non-drinks
    if (selectedFood.category !== 'Drinks') {
      Object.keys(modifiers).forEach(ing => {
        if (modifiers[ing] === 'Extra') total += 25;
      });
    }
    return total;
  };

  const handleConfirmAdd = () => {
    if (!selectedFood) return;
    
    if (user?.isAdmin) {
      showToast("Security Breach Avoided: Admin accounts cannot place orders.", "error");
      return;
    }

    const item: ConfiguredItem = {
      foodId: selectedFood._id,
      name: selectedFood.name,
      price: calculateCurrentPrice(),
      qty: 1,
      imageUrl: selectedFood.imageUrl,
      selectedSize: size,
      selectedSauce: '',
      selectedToppings: [],
      modifiers: selectedFood.category === 'Drinks' ? {} : modifiers,
      notes: notes
    };
    addToCart(item);
    showToast(`${selectedFood.name} staged to dispatch tray!`, 'success');
    setSelectedFood(null);
  };

  const isDrink = selectedFood?.category === 'Drinks';

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 relative page-transition bg-white dark:bg-ino-dark transition-colors duration-300">
      <BackButton onClick={onBack} />
      
      <div className="mb-16 border-b border-gray-100 dark:border-gray-800 pb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">Catalog</h1>
        </div>
        <div className="flex bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-x-auto max-w-full custom-scroll">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all flex-shrink-0 ${
                activeCategory === cat 
                ? 'bg-white dark:bg-gray-700 text-ino-red shadow-sm border border-gray-100 dark:border-gray-600' 
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <i className={`ph-bold ${categoryIcons[cat] || 'ph-squares-four'} text-lg`}></i>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {menuItems
          .filter(f => activeCategory === 'All' || f.category === activeCategory)
          .map((food) => (
          <div key={food._id} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={food.imageUrl} 
                alt={food.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-6 right-6 bg-white/95 dark:bg-gray-900/95 px-4 py-2 rounded-xl text-xs font-black shadow-lg dark:text-white border border-gray-100 dark:border-gray-700">
                {formatPrice(food.price)}
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] uppercase tracking-widest font-black text-ino-red">{food.category}</span>
                <span className="text-[8px] font-black uppercase text-gray-400">Spice: {food.spicyLevel}</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase leading-none">{food.name}</h3>
              <p className="text-xs text-gray-500 mb-8 line-clamp-2 leading-relaxed font-bold uppercase tracking-tight">{food.description}</p>
              
              <div className="mt-auto">
                <button 
                  onClick={() => openConfig(food)}
                  className="w-full bg-ino-red text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-md active:scale-95"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={!!selectedFood} 
        onClose={() => setSelectedFood(null)} 
        title={`Customizing: ${selectedFood?.name}`}
      >
        <div className="max-h-[65vh] overflow-y-auto pr-4 custom-scroll dark:text-white overscroll-contain">
          <div className="mb-10">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-6">Select Size Module</label>
            <div className="grid grid-cols-2 gap-4">
              {selectedFood?.sizeOptions.map(opt => (
                <button
                  key={opt.name}
                  onClick={() => setSize(opt.name)}
                  className={`p-5 rounded-2xl border-2 font-black text-[10px] uppercase transition-all flex justify-between items-center ${
                    size === opt.name 
                    ? 'border-ino-red bg-red-50 dark:bg-red-900/20 text-ino-red' 
                    : 'border-gray-50 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <span>{opt.name}</span>
                  {opt.priceOffset > 0 && <span className="opacity-70 text-[9px]">+{formatPrice(opt.priceOffset)}</span>}
                </button>
              ))}
            </div>
          </div>

          {!isDrink && Object.keys(modifiers).length > 0 && (
            <div className="mb-10">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-6">Modify Components</label>
              <div className="space-y-3">
                {Object.keys(modifiers).map(ing => (
                  <div key={ing} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span className="text-[10px] font-black uppercase text-gray-700 dark:text-gray-200">{ing}</span>
                    <div className="flex bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 p-0.5 shadow-sm">
                      {['Remove', 'Normal', 'Extra'].map(type => (
                        <button
                          key={type}
                          onClick={() => setModifiers(prev => ({ ...prev, [ing]: type }))}
                          className={`px-4 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${
                            modifiers[ing] === type 
                            ? 'bg-ino-red text-white shadow-md' 
                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
                          }`}
                        >
                          {type === 'Remove' && (ing === 'Salt' || ing === 'Spice') ? 'RemoveNo' : type}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-4">Transmission Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, specific cooking notes, or custom requests..."
              className="w-full p-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-[11px] font-bold h-24 resize-none outline-none focus:border-ino-red transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="pt-8 border-t dark:border-gray-700 mt-6 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Liability Value</span>
            <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{formatPrice(calculateCurrentPrice())}</p>
          </div>
          <button 
            onClick={handleConfirmAdd} 
            className="bg-ino-red text-white px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all active:scale-95"
          >
            Add to Tray
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MenuPage;
