import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import AddListing from './pages/AddListing'; 

// It evaluates auth status and role permissions before allowing navigation.
const ProtectedRoute = ({ children, allowClient = true }) => {
  const isAuthenticated = localStorage.getItem('token'); 
  const userRole = localStorage.getItem('role'); 

  // Security Check 1: Redirect to Login if no token exists
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a route is merchant-only (allowClient=false) but the user is a client, redirect them.
  // This prevents buyers from accessing the listing forms or merchant dashboard.
  if (userRole === 'client' && !allowClient) {
    return <Navigate to="/marketplace" replace />;
  }

  // All checks passed; render the component
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
        {/* --- GENERAL PROTECTED ROUTES --- 
            Accessible by both Merchants and Clients (allowClient={true})
        */}
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

        {/* Only Merchants can add listings */}
        {/* --- MERCHANT-ONLY PROTECTED ROUTES --- 
            Restricted via allowClient={false} 
        */}
        
        {/* Route for the "Post Item" form */}
        <Route 
          path="/add-listing" 
          element={
            <ProtectedRoute allowClient={false}>
              <AddListing />
            </ProtectedRoute>
          } 
        />

        {/* Dashboard: Merchant only */}
        {/* Main Merchant analytics/management dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowClient={false}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback: If route doesn't exist, go home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;