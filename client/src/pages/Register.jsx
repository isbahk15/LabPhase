import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import your context
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Merchant" });
    const { setToken } = useContext(AuthContext); // Use the setToken function from your context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Updated to your live Render URL
            const res = await axios.post("https://labphase-3.onrender.com/api/auth/register", formData);
            
            // Save the token to your context/localStorage
            setToken(res.data.token);
            
            toast.success("Account created successfully!");
            
            // Redirect based on role
            if (formData.role === "Merchant") {
                navigate("/dashboard");
            } else {
                navigate("/marketplace");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Registration failed. Check your connection.");
        }
    };

    return (
        <div style={pageStyle}>
            <Toaster position="top-center" />
            <div style={cardStyle}>
                <h2 style={titleStyle}>Create Account</h2>
                <p style={subTitleStyle}>Join the AgroLoop community.</p>
                
                <form onSubmit={handleSubmit} style={formStyle}>
                    <input 
                        type="text" placeholder="Full Name" required style={inputStyle}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    />
                    <input 
                        type="email" placeholder="Email Address" required style={inputStyle}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    />
                    <input 
                        type="password" placeholder="Password" required style={inputStyle}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    />
                    
                    <label style={labelStyle}>I want to...</label>
                    <select 
                        style={selectStyle}
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="Merchant">Sell Surplus Materials</option>
                        <option value="Customer">Buy Materials</option>
                    </select>

                    <button type="submit" style={btnStyle}>Sign Up</button>
                </form>
                
                <p style={footerText}>
                    Already have an account? <Link to="/login" style={linkStyle}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

// --- STYLES (Matching your AgroLoop aesthetic) ---
const pageStyle = { backgroundColor: '#062c1d', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' };
const cardStyle = { background: 'rgba(255, 255, 255, 0.03)', padding: '40px 50px', borderRadius: '24px', border: '1px solid rgba(233, 237, 201, 0.1)', width: '100%', maxWidth: '450px', textAlign: 'center' };
const titleStyle = { fontFamily: 'serif', fontSize: '2.5rem', color: '#e9edc9', marginBottom: '8px' };
const subTitleStyle = { fontSize: '0.85rem', opacity: 0.7, marginBottom: '25px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '15px', borderRadius: '12px', border: '1px solid rgba(233, 237, 201, 0.2)', background: '#052317', color: 'white', outline: 'none' };
const labelStyle = { textAlign: 'left', fontSize: '0.8rem', opacity: 0.6, marginBottom: '-10px', marginLeft: '5px' };
const selectStyle = { padding: '15px', borderRadius: '12px', border: '1px solid rgba(233, 237, 201, 0.2)', background: '#052317', color: 'white', cursor: 'pointer' };
const btnStyle = { padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#e9edc9', color: '#062c1d', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' };
const footerText = { marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 };
const linkStyle = { color: '#e9edc9', textDecoration: 'none', fontWeight: 'bold' };

export default Register;