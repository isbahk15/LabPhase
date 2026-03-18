import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedInStatus = !!token;
    
    // Only update if the status has actually changed
    if (isLoggedIn !== loggedInStatus) {
      setIsLoggedIn(loggedInStatus);
    }
  }, [isLoggedIn]); // Dependency array prevents infinite loops

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>AgroLoop</Link>
      <div>
        <Link to="/marketplace" style={linkStyle}>Marketplace</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <button onClick={handleLogout} style={logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={registerBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Simple inline styles to keep it clean
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px 40px', backgroundColor: '#062c1d' };
const logoStyle = { color: '#e9edc9', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' };
const linkStyle = { color: 'white', margin: '0 15px', textDecoration: 'none' };
const logoutBtn = { background: 'none', border: '1px solid white', color: 'white', cursor: 'pointer', padding: '5px 10px' };
const registerBtn = { backgroundColor: '#e9edc9', color: '#062c1d', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none' };

export default Navbar;