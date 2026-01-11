
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-4 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto min-w-[320px] px-8 py-5 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] text-white font-bold flex items-center justify-between gap-4 animate-scale-in border border-white/10 backdrop-blur-xl ${
            t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-ino-red' : 'bg-admas-blue'
          }`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className={`ph-fill text-xl ${t.type === 'success' ? 'ph-check-circle' : t.type === 'error' ? 'ph-warning-circle' : 'ph-info'}`}></i>
              </div>
              <span className="text-sm tracking-tight uppercase tracking-widest font-black">{t.message}</span>
            </div>
            <div className="h-1 bg-white/30 absolute bottom-0 left-0 w-full rounded-full animate-[shrink_4s_linear_forwards]"></div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
