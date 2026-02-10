import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('current_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Invalid credentials' };
    }
  };

  const register = async ({ name, email, password, voterId, role, adminSecret }) => {
    try {
      await authAPI.register({ name, email, password, voterId, role, adminSecret });
      return await login(email, password);
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role?.toUpperCase() === 'ADMIN',
    isAuthority: user?.role?.toUpperCase() === 'AUTHORITY',
    isAuditor: user?.role?.toUpperCase() === 'AUDITOR',
    isVoter: user?.role?.toUpperCase() === 'VOTER',
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
