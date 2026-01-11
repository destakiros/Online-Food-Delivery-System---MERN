
import React from 'react';

interface Props {
  onClick: () => void;
  className?: string;
}

const BackButton: React.FC<Props> = ({ onClick, className = '' }) => {
  return (
    <button 
      onClick={onClick}
      className={`absolute top-10 left-6 md:left-10 z-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl shadow-xl hover:bg-ino-red hover:text-white transition-all transform active:scale-95 group flex items-center justify-center gap-2 dark:text-white ${className}`}
      aria-label="Go Back"
    >
      <i className="ph-bold ph-arrow-left text-lg group-hover:-translate-x-1 transition-transform"></i>
      <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Back</span>
    </button>
  );
};

export default BackButton;
