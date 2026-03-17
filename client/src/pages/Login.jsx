import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext"; // Import your context
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useContext(AuthContext); // Use context to manage state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Swapped localhost for your live Render backend
      const response = await axios.post("https://labphase-3.onrender.com/api/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        // 1. Update Global State (this automatically updates localStorage via your AuthContext)
        setToken(response.data.token);
        
        // 2. Save Role for UI logic
        const role = response.data.role || "Customer"; 
        localStorage.setItem("role", role);
        
        toast.success("Welcome back!");

        // 3. Smart Navigation: Merchants go to Dashboard, Customers to Marketplace
        if (role === "Merchant") {
          navigate("/dashboard");
        } else {
          navigate("/marketplace");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err.response?.data?.msg || "Invalid email or password.");
    }
  };

  return (
    <div style={pageStyle}>
      <Toaster position="top-center" />
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
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div style={inputGroup}>
              <label style={labelStyle}>Password</label>
              <input 
                type="password" 
                style={inputStyle} 
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" style={buttonStyle}>SIGN IN</button>
          </form>

          <p style={footerText}>
            Don't have an account? <Link to="/register" style={linkStyle}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Styling (Kept your consistent AgroLoop theme)
const pageStyle = { backgroundColor: '#062c1d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' };
const container = { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '100px', paddingBottom: '50px' };
const loginBox = { background: 'rgba(255, 255, 255, 0.03)', padding: '50px', borderRadius: '24px 4px', border: '1px solid rgba(233, 237, 201, 0.1)', width: '90%', maxWidth: '450px', textAlign: 'center' };
const title = { fontFamily: 'serif', fontSize: '2.5rem', color: '#e9edc9', marginBottom: '10px' };
const subtitle = { fontSize: '0.9rem', opacity: 0.7, marginBottom: '30px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#a7c957', marginBottom: '8px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', marginTop: '10px', padding: '15px', backgroundColor: '#e9edc9', color: '#062c1d', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' };
const footerText = { marginTop: '25px', fontSize: '0.9rem', opacity: 0.8 };
const linkStyle = { color: '#e9edc9', textDecoration: 'none', fontWeight: 'bold' };

export default Login;