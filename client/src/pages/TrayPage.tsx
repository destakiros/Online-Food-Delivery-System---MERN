
import React from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

interface Props {
  onNavigate: (page: any) => void;
  onBack: () => void;
}

const TrayPage: React.FC<Props> = ({ onNavigate, onBack }) => {
  const { cart, removeFromCart, updateQty } = useCart();
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleGoToPayment = () => {
    if (cart.length > 0) {
      onNavigate('payment');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 relative min-h-screen">
      <BackButton onClick={onBack} />
      
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-admas-blue dark:text-white tracking-tight uppercase">Your Selection Tray</h1>
        <div className="h-1 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white dark:bg-gray-800/50 p-20 rounded-3xl text-center border-2 border-dashed border-gray-100 dark:border-gray-700">
              <i className="ph ph-tray text-7xl text-gray-200 dark:text-gray-700 mb-6"></i>
              <p className="text-gray-400 font-bold mb-8 uppercase tracking-widest">Tray Empty</p>
              <Button variant="outline" onClick={() => onNavigate('menu')}>View Full Menu</Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={(item as any)._hash} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between hover:shadow-xl transition-all">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-inner">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-admas-blue dark:text-white text-lg">{item.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                       <span className="text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">{item.selectedSize}</span>
                       <span className="text-[9px] bg-red-50 dark:bg-red-900/30 text-ino-red px-2 py-0.5 rounded-full font-bold">Sauce: {item.selectedSauce}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 dark:border-gray-700 pt-4 md:pt-0">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={() => updateQty((item as any)._hash, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 text-ino-red shadow-sm hover:bg-ino-red hover:text-white transition-all"
                    >
                      <i className="ph ph-minus font-bold"></i>
                    </button>
                    <span className="font-black text-sm w-6 text-center">{item.qty}</span>
                    <button 
                      onClick={() => updateQty((item as any)._hash, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 text-ino-red shadow-sm hover:bg-ino-red hover:text-white transition-all"
                    >
                      <i className="ph ph-plus font-bold"></i>
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Item Total</p>
                    <span className="font-black text-xl text-admas-blue dark:text-white">{formatPrice(item.price * item.qty)}</span>
                  </div>
                  
                  <button onClick={() => removeFromCart((item as any)._hash)} className="p-3 bg-red-50 dark:bg-red-900/20 text-ino-red hover:bg-ino-red hover:text-white rounded-2xl transition-all shadow-sm">
                    <i className="ph ph-trash text-xl"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-ino-dark text-white p-8 rounded-[40px] shadow-2xl sticky top-24 border border-white/5">
            <h2 className="text-xl font-black mb-8 flex items-center gap-2">
              <i className="ph-fill ph-receipt text-ino-yellow"></i> Order Summary
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400 font-bold text-sm">
                <span>Tray Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="pt-8 border-t border-white/10 flex justify-between font-black text-3xl">
                <span>Total</span>
                <span className="text-ino-yellow">{formatPrice(total)}</span>
              </div>
            </div>

            <Button 
              onClick={handleGoToPayment} 
              disabled={cart.length === 0} 
              className="w-full py-5 text-xl bg-ino-yellow text-admas-blue hover:bg-yellow-400 border-none rounded-[25px]"
            >
              Confirm Selection
            </Button>
            <p className="mt-8 text-[9px] text-gray-500 text-center leading-relaxed font-bold uppercase tracking-tighter">
              Next step: Secure Payment & Receipt Upload
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrayPage;
