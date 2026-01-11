
import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import { OrderProvider } from './context/OrderContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import TrayPage from './pages/TrayPage';
import PaymentPage from './pages/PaymentPage';
import OrderHistory from './components/OrderHistory';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/admin/AdminDashboard';

const AppContent = () => {
  const [page, setPage] = useState('home');

  return (
    <div className="min-h-screen bg-white dark:bg-ino-dark transition-colors duration-300">
      <Navbar onNavigate={setPage} currentPage={page} />
      
      <main className="min-h-screen">
        {page === 'home' && <HomePage onNavigate={setPage} />}
        {page === 'menu' && <MenuPage onBack={() => setPage('home')} />}
        {page === 'tray' && <TrayPage onNavigate={setPage} onBack={() => setPage('menu')} />}
        {page === 'payment' && <PaymentPage onNavigate={setPage} onBack={() => setPage('tray')} />}
        {page === 'tracker' && <OrderHistory />}
        {page === 'auth' && <AuthPage onBack={() => setPage('home')} />}
        {page === 'profile' && <ProfilePage onBack={() => setPage('home')} onNavigate={setPage} />}
        {page === 'notifications' && <NotificationsPage onBack={() => setPage('home')} />}
        {page === 'admin' && <AdminDashboard onBack={() => setPage('home')} onNavigate={setPage} />}
      </main>
      
      <Footer onNavigate={setPage} />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <CartProvider>
        <MenuProvider>
          <OrderProvider>
            <AppContent />
          </OrderProvider>
        </MenuProvider>
      </CartProvider>
    </ToastProvider>
  </AuthProvider>
);

export default App;
