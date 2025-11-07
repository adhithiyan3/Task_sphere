import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner here if you want
    return null;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;