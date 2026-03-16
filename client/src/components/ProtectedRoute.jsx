import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // This checks if a "token" exists in the browser's storage
  const isAuthenticated = localStorage.getItem('token'); 

  if (!isAuthenticated) {
    // If not logged in, send them back to the login page so that they enter username and password to access their accounts
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;