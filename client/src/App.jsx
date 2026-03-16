import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';

// --- Security Guard with Role-Based Access ---
const ProtectedRoute = ({ children, allowClient = true }) => {
  const isAuthenticated = localStorage.getItem('token'); 
  const userRole = localStorage.getItem('role'); // Roles: 'merchant' or 'client'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Block Clients from accessing Merchant-only areas (Dashboard)
  if (userRole === 'client' && !allowClient) {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Marketplace: Accessible by everyone logged in */}
        <Route 
          path="/marketplace" 
          element={
            <ProtectedRoute allowClient={true}>
              <Marketplace />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/product/:id" 
          element={
            <ProtectedRoute allowClient={true}>
              <ProductDetail />
            </ProtectedRoute>
          } 
        />

        {/* Dashboard: Restricted - allowClient is FALSE */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowClient={false}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;