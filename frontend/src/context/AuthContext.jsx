import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const loadUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Attempt to hit the backend /auth/me route to get fresh user data
      const response = await authService.getCurrentUser();
      
      // Check response structure based on typical backend formats
      const userData = response.user || response.data || response;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error loading user session:', error);
      // If we fail to fetch user (e.g., token expired or 401), we should log out
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Handle unauthorized events emitted by axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  const login = useCallback(async (email, password) => {
    try {
      const data = await authService.login(email, password);
      
      const { token, user } = data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      
      const { token, user } = data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    loadUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
