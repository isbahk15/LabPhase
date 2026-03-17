import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  
  // We use state to track these so the Navbar updates immediately on login/logout
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  // Update navbar state whenever the URL changes (helps after login redirect)
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUserRole(localStorage.getItem('role'));
  }, [location]);

  const handleLogout = () => {
    localStorage.clear(); // Clears token and role
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  const getStyle = (id) => ({
    ...linkStyle,
    color: hovered === id ? '#a7c957' : '#e9edc9',
    transform: hovered === id ? 'translateY(-2px)' : 'translateY(0)',
    transition: '0.3s ease'
  });

  return (
    <nav style={navStyle}>
      <div style={logoSection}>
        <Link to="/" style={logoText}>AgroLoop</Link>
      </div>
      
      <div style={navLinks}>
        {/* Anchor tags for smooth scrolling within the Landing page */}
        <a href="/#about-section" 
           style={getStyle('about')} 
           onMouseEnter={() => setHovered('about')} 
           onMouseLeave={() => setHovered(null)}>About</a>
        
        <a href="/#contact-us" 
           style={getStyle('contact')} 
           onMouseEnter={() => setHovered('contact')} 
           onMouseLeave={() => setHovered(null)}>Contact</a>

        {!isLoggedIn ? (
          <>
            <Link to="/login" style={getStyle('login')} onMouseEnter={() => setHovered('login')} onMouseLeave={() => setHovered(null)}>Login</Link>
            <Link to="/register" style={registerBtn}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/marketplace" style={getStyle('market')} onMouseEnter={() => setHovered('market')} onMouseLeave={() => setHovered(null)}>Marketplace</Link>
            
            {/* STRICT CHECK: Only show if role is NOT 'client' */}
            {/* This ensures only Merchants can access the Dashboard to manage listings */}
            {userRole !== 'client' && (
              <Link to="/dashboard" style={getStyle('dash')} onMouseEnter={() => setHovered('dash')} onMouseLeave={() => setHovered(null)}>Dashboard</Link>
            )}
            
            <button onClick={handleLogout} style={logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

// --- STYLES ---
//this is for the consistent color scheme theme to make everything look tied together
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: '#062c1d', borderBottom: '1px solid rgba(233, 237, 201, 0.1)', position: 'sticky', top: 0, zIndex: 1000 };
const logoSection = { display: 'flex', alignItems: 'center' };
const logoText = { color: '#e9edc9', textDecoration: 'none', fontSize: '1.5rem', fontFamily: 'serif', fontWeight: 'bold' };
const navLinks = { display: 'flex', gap: '20px', alignItems: 'center' };
const linkStyle = { textDecoration: 'none', fontSize: '0.9rem', whiteSpace: 'nowrap', display: 'inline-block' };
const registerBtn = { ...linkStyle, backgroundColor: '#e9edc9', color: '#062c1d', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold' };
const logoutBtn = { backgroundColor: 'transparent', border: '1px solid #bc4749', color: '#bc4749', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', transition: '0.2s' };

export default Navbar;