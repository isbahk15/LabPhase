import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Track screen width
  const navigate = useNavigate();

  useEffect(() => {
    // Listener to update responsiveness on window resize
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const token = localStorage.getItem('token');
    const loggedInStatus = !!token;
    
    // Only update if the status has actually changed
    if (isLoggedIn !== loggedInStatus) {
      setIsLoggedIn(loggedInStatus);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isLoggedIn]); // Dependency array prevents infinite loops

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/');
  };

  // Styles designed to keep everything on one line
  const dynamicNavStyle = {
    ...navStyle,
    flexDirection: 'row', // Force horizontal line
    alignItems: 'center',
    padding: isMobile ? '10px 10px' : '20px 40px', // Tighten padding on mobile
    justifyContent: 'space-between'
  };

  const dynamicLinkStyle = {
    ...linkStyle,
    margin: isMobile ? '0 5px' : '0 15px', // Reduce margins on mobile
    fontSize: isMobile ? '0.85rem' : '1rem' // Shrink text size to fit
  };

  const dynamicLogoStyle = {
    ...logoStyle,
    fontSize: isMobile ? '1.1rem' : '1.5rem' // Scale logo down
  };

  return (
    <nav style={dynamicNavStyle}>
      <Link to="/" style={dynamicLogoStyle}>AgroLoop</Link>
      <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
        <Link to="/marketplace" style={dynamicLinkStyle}>Market</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={dynamicLinkStyle}>Dash</Link>
            <button onClick={handleLogout} style={{...logoutBtn, fontSize: isMobile ? '0.7rem' : '1rem', padding: isMobile ? '3px 6px' : '5px 10px'}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={dynamicLinkStyle}>Login</Link>
            <Link to="/register" style={{...registerBtn, fontSize: isMobile ? '0.8rem' : '1rem', padding: isMobile ? '5px 10px' : '8px 15px'}}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Simple inline styles to keep it clean
const navStyle = { display: 'flex', backgroundColor: '#062c1d' };
const logoStyle = { color: '#e9edc9', fontWeight: 'bold', textDecoration: 'none' };
const linkStyle = { color: 'white', textDecoration: 'none' };
const logoutBtn = { background: 'none', border: '1px solid white', color: 'white', cursor: 'pointer' };
const registerBtn = { backgroundColor: '#e9edc9', color: '#062c1d', borderRadius: '5px', textDecoration: 'none' };

export default Navbar;