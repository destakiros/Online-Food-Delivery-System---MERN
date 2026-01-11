
import React from 'react';
import { formatPrice } from '../utils/formatPrice';
import { useAuth } from '../context/AuthContext';

interface Props {
  onNavigate: (page: any) => void;
}

const HomePage: React.FC<Props> = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuth();

  const handleMenuAccess = () => {
    if (isAuthenticated) {
      onNavigate('menu');
    } else {
      onNavigate('auth');
    }
  };

  const categories = [
    { name: 'Burger', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800' },
    { name: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
    { name: 'Chicken', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800' }
  ];

  const bestDishes = [
    { name: 'Double Burger', price: 280, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600' },
    { name: 'Margherita Pizza', price: 420, img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600' },
    { name: 'Spicy Wings', price: 410, img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600' }
  ];

  return (
    <div className="bg-white dark:bg-ino-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=90&w=2000" 
            className="w-full h-full object-cover" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-tight">
            Welcome to <br />
            <span className="text-ino-red">In-N-Out Food Delivery</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleMenuAccess}
              className="bg-ino-red text-white px-12 py-5 rounded-2xl font-black uppercase text-sm hover:scale-105 transition-all shadow-xl"
            >
              Order Now
            </button>
            {isAuthenticated && user?.isAdmin && (
              <button 
                onClick={() => onNavigate('admin')} 
                className="bg-white/20 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm hover:bg-white/30 transition-all backdrop-blur-md"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className="relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg group" 
            onClick={handleMenuAccess}
          >
            <img 
              src={cat.img} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt={cat.name} 
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white font-black text-2xl uppercase tracking-tighter">{cat.name}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Today's Best Dish Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Today's Best Dish</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {bestDishes.map((item, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2rem] flex flex-col group border border-transparent hover:border-ino-red/20 transition-all">
              <div className="overflow-hidden rounded-2xl mb-6">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-all duration-500" 
                />
              </div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl uppercase tracking-tighter text-gray-900 dark:text-white">{item.name}</h3>
                <span className="text-ino-red font-black text-lg">{formatPrice(item.price)}</span>
              </div>
              <button 
                onClick={handleMenuAccess} 
                className="w-full py-4 bg-ino-dark dark:bg-gray-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ino-red transition-all"
              >
                Select Item
              </button>
            </div>
          ))}
        </div>

        {/* Global Menu Link Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleMenuAccess}
            className="group flex items-center gap-4 bg-white dark:bg-gray-800 border-2 border-ino-red text-ino-red px-12 py-6 rounded-3xl font-black uppercase text-sm hover:bg-ino-red hover:text-white transition-all shadow-2xl"
          >
            Our All Food Menu
            <i className="ph-bold ph-arrow-right group-hover:translate-x-2 transition-transform"></i>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
