
import React from 'react';

interface Props {
  onNavigate: (page: any) => void;
}

const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-ino-dark text-gray-400 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-ino-red p-1.5 rounded-lg">
              <i className="ph-fill ph-moped text-white text-xl"></i>
            </div>
            <span className="font-black text-xl tracking-tight text-white uppercase">
              In-N-Out <span className="text-ino-red">Delivery</span>
            </span>
          </div>
          
          <div className="flex gap-8 text-sm">
            <button onClick={() => onNavigate('home')} className="hover:text-ino-yellow transition">Home</button>
            <button onClick={() => onNavigate('menu')} className="hover:text-ino-yellow transition">Menu</button>
            <button onClick={() => onNavigate('tracker')} className="hover:text-ino-yellow transition">Track Order</button>
          </div>

          <div className="flex gap-4">
            <i className="ph ph-facebook-logo text-2xl hover:text-white transition cursor-pointer"></i>
            <i className="ph ph-instagram-logo text-2xl hover:text-white transition cursor-pointer"></i>
            <i className="ph ph-twitter-logo text-2xl hover:text-white transition cursor-pointer"></i>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-800 text-[10px] text-center uppercase tracking-widest text-gray-600">
          &copy; 2025 In-N-Out Food Delivery. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
