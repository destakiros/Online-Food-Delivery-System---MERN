
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface Props {
  onNavigate: (page: any) => void;
  currentPage: string;
}

const Navbar: React.FC<Props> = ({ onNavigate, currentPage }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  
  const unreadCount = user?.notifications?.filter(n => !n.isRead).length || 0;

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'ph-house' },
    { id: 'menu', label: 'Menu', icon: 'ph-fork-knife' },
    { id: 'tracker', label: 'Orders', icon: 'ph-clock' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-ino-dark/95 backdrop-blur-md shadow-sm h-16' : 'bg-transparent h-20'}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-ino-red shadow-lg">
            <i className="ph-fill ph-moped text-white text-xl"></i>
          </div>
          <span className={`font-black text-xl tracking-tighter transition-colors ${!scrolled && currentPage === 'home' && !isDark ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            IN-N-OUT
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id)} 
              className={`text-sm font-bold uppercase tracking-widest transition-all ${
                currentPage === item.id 
                ? 'text-ino-red' 
                : (!scrolled && currentPage === 'home' && !isDark ? 'text-white/80 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white')
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAuthenticated && user?.isAdmin && (
            <button 
              onClick={() => onNavigate('admin')} 
              className={`text-sm font-black uppercase tracking-widest transition-all ${
                currentPage === 'admin' 
                ? 'text-ino-red' 
                : (!scrolled && currentPage === 'home' && !isDark ? 'text-white/80 hover:text-white' : 'text-ino-red hover:text-red-700')
              }`}
            >
              Admin
            </button>
          )}
          {isAuthenticated && (
            <button 
              onClick={() => onNavigate('profile')} 
              className={`text-sm font-bold uppercase tracking-widest transition-all ${
                currentPage === 'profile' 
                ? 'text-ino-red' 
                : (!scrolled && currentPage === 'home' && !isDark ? 'text-white/80 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white')
              }`}
            >
              Profile
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg transition-all border ${!scrolled && currentPage === 'home' && !isDark ? 'border-white/20 text-white bg-white/10' : 'border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <i className={`ph-bold ${isDark ? 'ph-sun' : 'ph-moon'} text-lg`}></i>
          </button>

          <button 
            onClick={() => onNavigate('notifications')} 
            className={`relative p-2.5 rounded-xl transition-all border ${!scrolled && currentPage === 'home' && !isDark ? 'border-white/20 text-white bg-white/10' : 'border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'}`}
          >
            <i className="ph-bold ph-bell text-xl"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-ino-yellow text-admas-blue text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => onNavigate('tray')} 
            className={`relative p-2.5 rounded-xl transition-all border ${!scrolled && currentPage === 'home' && !isDark ? 'border-white/20 text-white bg-white/10' : 'border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'}`}
          >
            <i className="ph-bold ph-handbag text-xl"></i>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-ino-red text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </button>
          
          {user ? (
            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-100 dark:border-gray-800">
               <span className={`hidden lg:inline text-xs font-bold uppercase tracking-widest ${!scrolled && currentPage === 'home' && !isDark ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {user.name.split(' ')[0]}
              </span>
              <button 
                onClick={logout} 
                className={`p-2.5 rounded-xl border ${!scrolled && currentPage === 'home' && !isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:text-ino-red'}`}
              >
                <i className="ph-bold ph-power text-xl"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('auth')} 
              className={`px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all ${!scrolled && currentPage === 'home' && !isDark ? 'bg-white text-gray-900' : 'bg-ino-red text-white'}`}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
