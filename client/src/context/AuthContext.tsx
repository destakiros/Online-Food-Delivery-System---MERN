
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, SystemMessage } from '../types';

interface LoginResponse {
  success: boolean;
  message?: string;
  role?: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  login: (email: string, pass: string) => Promise<LoginResponse>;
  signup: (userData: Omit<User, 'id' | 'isAdmin' | 'status' | 'notifications'>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  addNotification: (userId: string, message: string) => void;
  markAsRead: (messageId: string) => void;
  clearNotifications: () => void;
  toggleUserStatus: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updatePassword: (userId: string, newPass: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ino-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>([
    { id: 'admin-1', name: 'Logistics Admin', email: 'admin@gmail.com', password: 'admin@123', isAdmin: true, status: 'Active', notifications: [] },
    { id: 'cust-1', name: 'Desta', email: 'desta@gmail.com', password: 'password123', isAdmin: false, phone: '0987654321', status: 'Active', notifications: [] }
  ]);

  const saveToStorage = (userData: User | null) => {
    if (userData) {
      localStorage.setItem('ino-user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('ino-user');
    }
  };

  const login = async (email: string, pass: string): Promise<LoginResponse> => {
    const emailLower = email.toLowerCase();
    const existing = allUsers.find(u => u.email.toLowerCase() === emailLower);
    
    if (!existing) return { success: false, message: "Profile not found." };
    if (existing.password !== pass) return { success: false, message: "Incorrect password." };
    if (existing.status === 'Suspended') return { success: false, message: "Account suspended." };

    setUser(existing);
    saveToStorage(existing);
    return { success: true, role: existing.isAdmin ? 'admin' : 'customer' };
  };

  const signup = async (userData: Omit<User, 'id' | 'isAdmin' | 'status' | 'notifications'>) => {
    const exists = allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) return false;

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      isAdmin: false,
      status: 'Active',
      notifications: [{
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        text: 'Welcome! Profile verified.',
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'general'
      }]
    };

    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    saveToStorage(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    saveToStorage(null);
  };

  const addNotification = (userId: string, message: string) => {
    const newMessage: SystemMessage = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      text: message,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'status'
    };

    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, notifications: [newMessage, ...u.notifications] } : u));
    if (user && user.id === userId) {
      const updated = { ...user, notifications: [newMessage, ...user.notifications] };
      setUser(updated);
      saveToStorage(updated);
    }
  };

  const markAsRead = (messageId: string) => {
    if (!user) return;
    const updatedNotifs = user.notifications.map(n => n.id === messageId ? { ...n, isRead: true } : n);
    const updatedUser = { ...user, notifications: updatedNotifs };
    setUser(updatedUser);
    saveToStorage(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, notifications: updatedNotifs } : u));
  };

  const clearNotifications = () => {
    if (!user) return;
    const updatedUser = { ...user, notifications: [] };
    setUser(updatedUser);
    saveToStorage(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, notifications: [] } : u));
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
    ));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (user && user.id === userId) {
      const updated = { ...user, ...updates };
      setUser(updated);
      saveToStorage(updated);
    }
  };

  const updatePassword = (userId: string, newPass: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u));
    if (user && user.id === userId) {
      const updated = { ...user, password: newPass };
      setUser(updated);
      saveToStorage(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, allUsers, login, signup, logout, isAuthenticated: !!user, 
      addNotification, markAsRead, clearNotifications, toggleUserStatus, 
      updateUser, updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
