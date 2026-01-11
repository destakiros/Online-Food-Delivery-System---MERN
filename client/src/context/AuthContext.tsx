
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
  addAdmin: (name: string, email: string, pass: string) => void;
  deleteUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updatePassword: (userId: string, newPass: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>([
    { id: 'admin-1', name: 'Logistics Admin', email: 'admin@gmail.com', password: 'admin@123', isAdmin: true, status: 'Active', notifications: [] },
    { id: 'cust-1', name: 'desta', email: 'desta@gmail.com', password: 'password123', isAdmin: false, phone: '0987654321', status: 'Active', notifications: [] }
  ]);

  const login = async (email: string, pass: string): Promise<LoginResponse> => {
    const emailLower = email.toLowerCase();
    const existing = allUsers.find(u => u.email.toLowerCase() === emailLower);
    
    if (!existing) return { success: false, message: "Registry Error: No profile found." };
    if (existing.password !== pass) return { success: false, message: "Security Violation: Incorrect password." };
    if (existing.status === 'Suspended') return { success: false, message: "Access Denied: Account suspended." };

    setUser(existing);
    localStorage.setItem('user_session', JSON.stringify(existing));
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
    localStorage.setItem('user_session', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
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
      const updatedUser = { ...user, notifications: [newMessage, ...user.notifications] };
      setUser(updatedUser);
      localStorage.setItem('user_session', JSON.stringify(updatedUser));
    }
  };

  const markAsRead = (messageId: string) => {
    if (!user) return;
    const updatedNotifs = user.notifications.map(n => n.id === messageId ? { ...n, isRead: true } : n);
    const updatedUser = { ...user, notifications: updatedNotifs };
    setUser(updatedUser);
    localStorage.setItem('user_session', JSON.stringify(updatedUser));
    setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, notifications: updatedNotifs } : u));
  };

  const clearNotifications = () => {
    if (!user) return;
    const updatedUser = { ...user, notifications: [] };
    setUser(updatedUser);
    localStorage.setItem('user_session', JSON.stringify(updatedUser));
    setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, notifications: [] } : u));
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
    ));
  };

  const addAdmin = (name: string, email: string, pass: string) => {
    const newAdmin: User = {
      id: Date.now().toString(),
      name, email, password: pass,
      isAdmin: true, status: 'Active', notifications: []
    };
    setAllUsers(prev => [...prev, newAdmin]);
  };

  const deleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user_session', JSON.stringify(updatedUser));
    }
  };

  const updatePassword = (userId: string, newPass: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u));
    if (user && user.id === userId) {
      const updatedUser = { ...user, password: newPass };
      setUser(updatedUser);
      localStorage.setItem('user_session', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, allUsers, login, signup, logout, isAuthenticated: !!user, 
      addNotification, markAsRead, clearNotifications, toggleUserStatus, 
      addAdmin, deleteUser, updateUser, updatePassword
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
