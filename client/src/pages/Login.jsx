import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import Navbar from "./Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        // 1. Save Token
        localStorage.setItem("token", response.data.token);
        
        /** * 2. Save Role 
         * If your backend doesn't send a role yet, you can default it to 'client'
         * for testing: localStorage.setItem("role", "client");
         **/
        const role = response.data.role || "client"; 
        localStorage.setItem("role", role);
        
        // 3. Navigate
        navigate("/marketplace");
        
        // Use a small delay or location.reload to ensure Navbar updates
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={container}>
        <div style={loginBox}>
          <h2 style={title}>Welcome Back</h2>
          <p style={subtitle}>Sign in to manage your agricultural listings.</p>

          <form onSubmit={handleLogin} style={formStyle}>
            <div style={inputGroup}>
              <label style={labelStyle}>Email Address</label>
              <input 
                type="email" 
                style={inputStyle} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Password</label>
              <input 
                type="password" 
                style={inputStyle} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" style={buttonStyle}>
              SIGN IN
            </button>
          </form>

          <p style={footerText}>
            Don't have an account? <Link to="/register" style={linkStyle}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const pageStyle = { backgroundColor: '#062c1d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' };
const container = { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '100px', paddingBottom: '50px' };
const loginBox = { background: 'rgba(255, 255, 255, 0.03)', padding: '50px', borderRadius: '24px 4px', border: '1px solid rgba(233, 237, 201, 0.1)', width: '90%', maxWidth: '450px', textAlign: 'center' };
const title = { fontFamily: 'serif', fontSize: '2.5rem', color: '#e9edc9', marginBottom: '10px' };
const subtitle = { fontSize: '0.9rem', opacity: 0.7, marginBottom: '30px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#a7c957', marginBottom: '8px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' };

const buttonStyle = {
  width: '100%',
  marginTop: '10px',
  padding: '15px',
  backgroundColor: '#e9edc9',
  color: '#062c1d',
  border: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: '0.3s'
};

const footerText = { marginTop: '25px', fontSize: '0.9rem', opacity: 0.8 };
const linkStyle = { color: '#e9edc9', textDecoration: 'none', fontWeight: 'bold' };

export default Login;