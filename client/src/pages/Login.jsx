import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import Navbar from '../components/Navbar'; // Correct path to the new folder
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://labphase-3.onrender.com", {
        email,
        password,
      });

      if (response.data.token) {
      // to check if the server returns  a valid JWT Authentication
        localStorage.setItem("token", response.data.token);
        
       /** * 2. Save Role

         checks whether a user is a merchant or a client

         **/
        // If the backend doesn't send a role yet, it defaults to client
        const role = response.data.role || "client"; 
        localStorage.setItem("role", role);
        
        // 3. Navigation & Refresh
        navigate("/marketplace");
           // the navbar refreshes to show that logout button as the user is now logged in
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid email or password.");
       //this is what shows up if the details dont match the backend of authorsied users
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
               {/* this is to enter the email */}
              <input 
                type="email" 
                style={inputStyle} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* to enter the password */}
            <div style={inputGroup}>
              <label style={labelStyle}>Password</label>
              <input 
                type="password" 
                style={inputStyle} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
{/* to sign in */}
            <button type="submit" style={buttonStyle}>SIGN IN</button>
          </form>
{/* a registration button to create a new account */}
          <p style={footerText}>
            Don't have an account? <Link to="/register" style={linkStyle}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

//styling with the consistent color scheme and visuals
const pageStyle = { backgroundColor: '#062c1d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' };
const container = { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '100px', paddingBottom: '50px' };
const loginBox = { background: 'rgba(255, 255, 255, 0.03)', padding: '50px', borderRadius: '24px 4px', border: '1px solid rgba(233, 237, 201, 0.1)', width: '90%', maxWidth: '450px', textAlign: 'center' };
const title = { fontFamily: 'serif', fontSize: '2.5rem', color: '#e9edc9', marginBottom: '10px' };
const subtitle = { fontSize: '0.9rem', opacity: 0.7, marginBottom: '30px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#a7c957', marginBottom: '8px', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', marginTop: '10px', padding: '15px', backgroundColor: '#e9edc9', color: '#062c1d', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' };
const footerText = { marginTop: '25px', fontSize: '0.9rem', opacity: 0.8 };
const linkStyle = { color: '#e9edc9', textDecoration: 'none', fontWeight: 'bold' };
// testing

export default Login;