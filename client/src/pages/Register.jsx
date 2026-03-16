import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Send registration data to your Express backend
      // Note: Using port 5000 as seen in your previous server setups
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);

      // 2. If successful, save the token and move to the Marketplace
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        // Use a small alert or toast to confirm success
        alert("Account created successfully!");
        
        navigate("/marketplace");
        window.location.reload(); // Refresh to update the Navbar visibility
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.msg || "Registration failed. Is the server running?");
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <div style={container}>
        <div style={registerBox}>
          <h2 style={title}>Create Account</h2>
          <p style={subtitle}>Join the AgroLoop community of merchants and buyers.</p>

          <form onSubmit={handleRegister} style={formStyle}>
            <div style={inputGroup}>
              <label style={labelStyle}>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                style={inputStyle} 
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Email Address</label>
              <input 
                type="email" 
                placeholder="agro@loop.com" 
                style={inputStyle} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={inputStyle} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="aesthetic-btn" style={buttonOverride}>
              JOIN NOW
            </button>
          </form>

          <p style={footerText}>
            Already a member? <Link to="/login" style={linkStyle}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- STYLES (Matching your Contacts and Login aesthetics) ---
const pageStyle = {
  backgroundColor: '#062c1d', // Forest Green
  minHeight: '100vh',
  color: 'white',
  fontFamily: 'sans-serif'
};

const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '80px',
  paddingBottom: '40px'
};

const registerBox = {
  background: 'rgba(255, 255, 255, 0.03)',
  padding: '40px 50px',
  borderRadius: '24px 4px', // Your signature curve
  border: '1px solid rgba(233, 237, 201, 0.1)',
  width: '100%',
  maxWidth: '450px',
  textAlign: 'center'
};

const title = {
  fontFamily: 'serif',
  fontSize: '2.5rem',
  color: '#e9edc9', // Ivory
  marginBottom: '8px'
};

const subtitle = {
  fontSize: '0.85rem',
  opacity: 0.7,
  marginBottom: '25px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const inputGroup = {
  textAlign: 'left'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  color: '#a7c957', // Light Green
  marginBottom: '5px',
  fontWeight: '600'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  color: 'white',
  boxSizing: 'border-box',
  outline: 'none'
};

const buttonOverride = {
  width: '100%',
  padding: '15px',
  marginTop: '10px'
};

const footerText = {
  marginTop: '20px',
  fontSize: '0.9rem',
  opacity: 0.8
};

const linkStyle = {
  color: '#e9edc9',
  textDecoration: 'none',
  fontWeight: 'bold'
};

export default Register;