import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAuthGuard = (adminOnly: boolean = false) => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("Unauthorized access attempt. Redirecting to home.");
    }
    if (adminOnly && user && !user.isAdmin) {
      console.warn("Insufficient permissions for Admin route.");
    }
  }, [user, isAuthenticated, adminOnly]);

  return { isAuthorized: isAuthenticated && (!adminOnly || (user && user.isAdmin)) };
};