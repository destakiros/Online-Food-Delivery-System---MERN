
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-ino-red rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Connecting to Logistics Network...</p>
    </div>
  );
};

export default Loader;
