import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const Register = () => {
  // Added 'role' to state to capture user type
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "client" // Default value
  });
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Save the chosen role so the UI knows what to show
        localStorage.setItem("role", formData.role);
        
        alert("Account created successfully!");
        navigate("/marketplace");
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.msg || "Registration failed.");
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={container}>
        <div style={registerBox}>
          <h2 style={title}>Create Account</h2>
          <p style={subtitle}>Join the AgroLoop community.</p>

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

            {/* --- NEW ROLE SELECTION --- */}
            <div style={inputGroup}>
              <label style={labelStyle}>I want to...</label>
              <select 
                style={inputStyle}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="client" style={{color: 'black'}}>Buy Materials (Client)</option>
                <option value="merchant" style={{color: 'black'}}>Sell Materials (Merchant)</option>
              </select>
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

            <button type="submit" style={buttonStyle}>
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

// Styles kept consistent with your signature design
const pageStyle = { backgroundColor: '#062c1d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' };
const container = { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '80px', paddingBottom: '40px' };
const registerBox = { background: 'rgba(255, 255, 255, 0.03)', padding: '40px 50px', borderRadius: '24px 4px', border: '1px solid rgba(233, 237, 201, 0.1)', width: '100%', maxWidth: '450px', textAlign: 'center' };
const title = { fontFamily: 'serif', fontSize: '2.5rem', color: '#e9edc9', marginBottom: '8px' };
const subtitle = { fontSize: '0.85rem', opacity: 0.7, marginBottom: '25px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputGroup = { textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '0.8rem', color: '#a7c957', marginBottom: '5px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', boxSizing: 'border-box', outline: 'none' };
const buttonStyle = { width: '100%', padding: '15px', marginTop: '10px', backgroundColor: '#e9edc9', color: '#062c1d', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' };
const footerText = { marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 };
const linkStyle = { color: '#e9edc9', textDecoration: 'none', fontWeight: 'bold' };

export default Register;