import React, { createContext, useContext, useState, useEffect } from 'react';
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
    const storedUser = localStorage.getItem('vortex_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      const normalizedUser = {
        ...data.user,
        role: data.user?.role?.toLowerCase?.() || data.user?.role,
      };
      setUser(normalizedUser);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('vortex_current_user', JSON.stringify(normalizedUser));
      return { success: true, user: normalizedUser };
    } catch (error) {
      // ==== MOCK DATA FALLBACK ====
      try {
        const mockUsers = JSON.parse(localStorage.getItem('vortex_users') || '[]');
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
          const normalizedUser = {
            ...user,
            role: user.role?.toLowerCase?.() || user.role,
          };
          setUser(normalizedUser);
          localStorage.setItem('auth_token', `mock-token-${user.id}`);
          localStorage.setItem('vortex_current_user', JSON.stringify(normalizedUser));
          return { success: true, user: normalizedUser };
        }
      } catch (e) {
        console.error('Mock login fallback error', e);
      }
      
      const message = error?.response?.data?.message || 'Invalid credentials';
      return { success: false, error: message };
    }
  };

  const register = async (email, password, name, role = 'voter', voterId, adminSecret) => {
    try {
      await authAPI.register({
        name,
        email,
        password,
        voterId,
        role: role?.toUpperCase?.() || role,
        adminSecret,
      });
      return await login(email, password);
    } catch (error) {
      // ==== MOCK DATA FALLBACK ====
      try {
        const mockUsers = JSON.parse(localStorage.getItem('vortex_users') || '[]');
        if (mockUsers.some(u => u.email === email)) {
          return { success: false, error: 'User already exists' };
        }
        
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          password,
          name,
          role: role.toLowerCase(),
          voterId
        };
        
        const updatedUsers = [...mockUsers, newUser];
        localStorage.setItem('vortex_users', JSON.stringify(updatedUsers));
        
        // Use the fallback logic directly since authAPI will still fail
        return await login(email, password);
      } catch (e) {
         console.error('Mock register fallback error', e);
      }

      const message = error?.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vortex_current_user');
    localStorage.removeItem('auth_token');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: String(user?.role || '').toLowerCase() === 'admin' || String(user?.role || '').toUpperCase() === 'ADMIN',
    isVoter: String(user?.role || '').toLowerCase() === 'voter' || String(user?.role || '').toUpperCase() === 'VOTER',
    isAuditor: String(user?.role || '').toLowerCase() === 'auditor' || String(user?.role || '').toUpperCase() === 'AUDITOR'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
