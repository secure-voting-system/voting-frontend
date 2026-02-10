import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-layout">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length) {
    const allowed = roles.map((role) => role.toUpperCase());
    if (!allowed.includes(user.role?.toUpperCase())) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
