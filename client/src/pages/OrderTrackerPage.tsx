
import React, { useEffect, useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../utils/formatPrice';
import api from '../services/api';
import BackButton from '../components/common/BackButton';

interface Props {
  onBack: () => void;
}

const OrderTrackerPage: React.FC<Props> = ({ onBack }) => {
  const { currentOrder } = useOrders();
  const [loading, setLoading] = useState(false);

  if (!currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in relative bg-white dark:bg-ino-dark transition-colors duration-300">
        <BackButton onClick={onBack} />
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <i className="ph ph-moped text-5xl text-gray-300 dark:text-gray-600"></i>
        </div>
        <h2 className="text-2xl font-black text-admas-blue dark:text-ino-yellow uppercase tracking-tight">No Active Orders</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs font-medium">You do not have any orders currently being processed by our delivery network.</p>
      </div>
    );
  }

  const steps = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentIndex = steps.indexOf(currentOrder.status);

  return (
    <div className="max-w-5xl mx-auto px-4 py-24 relative bg-white dark:bg-ino-dark transition-colors duration-300 min-h-screen">
      <BackButton onClick={onBack} />
      
      <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 mb-10 pl-14 md:pl-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black text-ino-red uppercase tracking-[0.3em] mb-2 block">Live Order Status</span>
            <h1 className="text-3xl md:text-4xl font-black text-admas-blue dark:text-white tracking-tight">ID: <span className="font-mono text-gray-400">#{currentOrder._id.slice(-6).toUpperCase()}</span></h1>
          </div>
          <div className="bg-ino-yellow/10 text-admas-blue dark:text-ino-yellow px-6 py-2 rounded-2xl border border-ino-yellow/30 font-black uppercase text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-ino-yellow rounded-full animate-pulse"></span>
            Status: {currentOrder.status}
          </div>
        </div>

        <div className="relative mb-20 px-4">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 dark:bg-gray-700 -translate-y-1/2 rounded-full overflow-hidden">
             <div 
                className="h-full bg-ino-red transition-all duration-1000 shadow-[0_0_10px_rgba(214,40,40,0.4)]"
                style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
             ></div>
          </div>
          
          <div className="relative flex justify-between">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg transition-all transform ${i <= currentIndex ? 'bg-ino-red text-white scale-110' : 'bg-white dark:bg-gray-700 text-gray-300 dark:text-gray-500'}`}>
                  {i < currentIndex ? <i className="ph-bold ph-check"></i> : (
                    i === 3 ? <i className="ph-fill ph-flag-pennant"></i> : 
                    i === 2 ? <i className="ph-fill ph-moped"></i> : 
                    i === 1 ? <i className="ph-fill ph-cooking-pot"></i> : <i className="ph-fill ph-clock"></i>
                  )}
                </div>
                <span className={`mt-4 text-[10px] font-black uppercase tracking-widest ${i <= currentIndex ? 'text-admas-blue dark:text-ino-yellow' : 'text-gray-300 dark:text-gray-600'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-gray-50 dark:border-gray-700">
          <div className="space-y-8">
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2 text-admas-blue dark:text-ino-yellow">
                <i className="ph-fill ph-article text-ino-red text-lg"></i> Payload Manifest
              </h3>
              <div className="space-y-4 bg-gray-50/50 dark:bg-gray-900/30 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
                {currentOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{item.qty}x {item.name}</span>
                    <span className="font-black text-admas-blue dark:text-white">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 font-black flex justify-between text-lg text-admas-blue dark:text-white">
                  <span>Gross Value</span>
                  <span className="text-ino-red">{formatPrice(currentOrder.totalPrice)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 text-admas-blue dark:text-ino-yellow">
                <i className="ph-fill ph-map-pin text-ino-red text-lg"></i> Delivery Location
              </h3>
              <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  {/* Fix: changed deliveryLocation to destination to match the Order interface */}
                  {currentOrder.destination || 'Sector Assigned Hub'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-full bg-gray-100 dark:bg-gray-900 rounded-[32px] overflow-hidden relative shadow-inner border border-gray-200 dark:border-gray-700 min-h-[300px]">
               <div className="absolute inset-0 opacity-20 dark:opacity-40 grayscale" style={{ backgroundImage: 'url(https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i19747!3i12480!2m3!1e0!2sm!3i665181755!3m8!2sen!3set!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425)' }}></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-12 h-12 bg-ino-red rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce border-4 border-white dark:border-gray-800">
                    <i className="ph-fill ph-moped"></i>
                  </div>
                  <div className="mt-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-[9px] font-black text-admas-blue dark:text-ino-yellow shadow-lg border border-gray-100 dark:border-gray-700 uppercase tracking-widest">
                    Live Tracking
                  </div>
                  <p className="mt-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-white/80 dark:bg-gray-800/80 px-4 py-1 rounded-full">Node: INO-01</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackerPage;
