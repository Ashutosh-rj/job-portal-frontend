// src/context/AuthContext.js
// =============================================
// AUTH CONTEXT - Global authentication state
// =============================================
// React Context lets us share state across all components
// without "prop drilling" (passing props through many layers)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// 1. Create the context (like a global store)
const AuthContext = createContext(null);

/**
 * AUTH PROVIDER - Wraps your whole app and provides auth state.
 * Any component inside this can use useAuth() to access:
 * - user: current user data
 * - login(): login function
 * - logout(): logout function
 * - isAuthenticated: true/false
 * - isAdmin: true/false
 */
export const AuthProvider = ({ children }) => {
  // State: null if not logged in, user object if logged in
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start: check if user was previously logged in
  // (by checking localStorage for saved token/user)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * LOGIN - Send credentials to backend, save token
   */
  const login = async (username, password) => {
    const response = await authAPI.login({ username, password });
    const userData = response.data;

    // Save to localStorage so user stays logged in after page refresh
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));

    // Update state (triggers re-render of all components using useAuth())
    setUser(userData);
    return userData;
  };

  /**
   * REGISTER - Create account and auto-login
   */
  const register = async (formData) => {
    const response = await authAPI.register(formData);
    const userData = response.data;

    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  /**
   * LOGOUT - Clear all user data
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Computed values
  const isAuthenticated = !!user; // true if user is not null
  const isAdmin = user?.role === 'ROLE_ADMIN';

  // The value available to all child components
  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * CUSTOM HOOK - Easy way to use auth context in any component.
 * Usage: const { user, login, logout, isAdmin } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
