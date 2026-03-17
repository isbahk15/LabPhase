import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import AddListing from './pages/AddListing'; // 1. IMPORT YOUR NEW FILE

const ProtectedRoute = ({ children, allowClient = true }) => {
  const isAuthenticated = localStorage.getItem('token'); 
  const userRole = localStorage.getItem('role'); 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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

        {/* Marketplace & Details */}
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

        {/* 2. ADD THIS ROUTE: Only Merchants can add listings */}
        <Route 
          path="/add-listing" 
          element={
            <ProtectedRoute allowClient={false}>
              <AddListing />
            </ProtectedRoute>
          } 
        />

        {/* Dashboard: Merchant only */}
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