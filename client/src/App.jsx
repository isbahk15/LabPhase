import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
// this checks for user authentication before it allows access to a certain page which is the dashboard
const ProtectedRoute = ({ children, allowClient = true }) => {
  const isAuthenticated = localStorage.getItem('token'); 
  const userRole = localStorage.getItem('role'); // Roles: 'merchant' or 'client'
// is the user is not authenticated, they are redirected to the log in page
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
        {/* these are for the paths accessible to anyone regardless of your role */}
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

        {/* Dashboard: Restricted - clients are not allowed access */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowClient={false}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
{/* any URLS that are unknown will lead back to the main page to avoid an error showing up */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;