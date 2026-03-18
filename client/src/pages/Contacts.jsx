import React, { useState } from "react";
import axios from "axios";
import Navbar from '../components/Navbar'; // Correct path to the new folderimport toast, { Toaster } from 'react-hot-toast';

const Contacts = () => {
  // i used one state call to handle all 4 criterias instead of creating 4 separate ones
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // use to make the button disable to show sending therefore it avoids multiple clicks
  const [loading, setLoading] = useState(false);

  // Function to handle the form submission sending to the backend API
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stops the page from refreshing 
    setLoading(true);

    try {
      // Sending the data to Node.js backend 
      // Updated to use the live production URL to avoid ERR_CONNECTION_REFUSED
      await axios.post("https://labphase-3.onrender.com/api/contacts", formData);
      
      // singals a sucessful request submission
      toast.success("Inquiry sent! Our team will email you shortly.");
      
      // resets the form so that it can allow in more requests
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Submission error:", err);
      //to signal that an error occurred when try to retrieve that data
      toast.error("Could not send email. Is the server online?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <Toaster position="top-center" />
      <Navbar />

      <div style={container}>
        {/* Left Side: client details to allow the company to reach out to them */}
        <div style={infoSection}>
          <h1 style={title}>Contact Us</h1>
          <p style={subtitle}>
            Have a formal request? Fill out the form and our administrative team 
            will reach out to your provided email address within 24 hours.
          </p>
          
          <div style={contactDetails}>
            <div style={detailItem}>
              <strong style={label}>Official Email:</strong> 
              <span>support@agroloop.com</span>
            </div>
            <div style={detailItem}>
              <strong style={label}>Office:</strong> 
              <span>Accra, Ghana</span>
            </div>
          </div>
        </div>

        {/* Right Side: The Email Form for the space to fill in help requests or complains */}
        <div style={formSection}>
          <h2 style={formTitle}>Send an Inquiry</h2>
          <form style={formStyle} onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Full Name" 
              style={inputStyle}
              value={formData.name}
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" 
              placeholder="Your Email Address" 
              style={inputStyle}
              value={formData.email}
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Subject" 
              style={inputStyle}
              value={formData.subject}
              required
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
            <textarea 
              placeholder="Describe your request in detail..." 
              style={{...inputStyle, minHeight: '150px', resize: 'none'}}
              value={formData.message}
              required
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
            
            <button 
              type="submit" 
              style={{...submitBtn, opacity: loading ? 0.7 : 1}}
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit Email Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
// this allows for my contacts section to look organised and consistent with them theme of the website to keep it visually appealing and organised
const pageStyle = { backgroundColor: '#062c1d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' };
const container = { display: 'flex', flexWrap: 'wrap', gap: '50px', padding: '80px 8%', maxWidth: '1200px', margin: '0 auto' };
const infoSection = { flex: '1', minWidth: '300px' };
const formSection = { flex: '1.2', minWidth: '350px', background: 'rgba(255, 255, 255, 0.03)', padding: '40px', borderRadius: '24px 4px', border: '1px solid rgba(167, 201, 87, 0.2)' };
const title = { fontFamily: 'serif', fontSize: '3.5rem', color: '#e9edc9', marginBottom: '15px' };
const subtitle = { fontSize: '1.1rem', opacity: 0.8, marginBottom: '40px', lineHeight: '1.6' };
const formTitle = { color: '#e9edc9', fontFamily: 'serif', marginBottom: '20px' };

const inputStyle = { padding: '15px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const submitBtn = { padding: '15px', backgroundColor: '#e9edc9', color: '#062c1d', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };
const contactDetails = { display: 'flex', flexDirection: 'column', gap: '15px' };
const label = { color: '#a7c957', marginRight: '10px' };
const detailItem = { fontSize: '1rem' }; // Added missing style for consistency

export default Contacts;