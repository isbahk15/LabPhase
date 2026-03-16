import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Added for the form submission
import toast, { Toaster } from 'react-hot-toast'; // Added for feedback
import Navbar from './Navbar';
import aboutImg from '../assets/about.jpg';
import farmerImg from '../assets/farmer.jpg';

const Landing = () => {
  const navigate = useNavigate();
//this is for good UI
// the shopbtn allows the user to see the "back to the top" arrow

  const [showTopBtn, setShowTopBtn] = useState(false);
  
  // Form State for Email Inquiry
  //we use a single state call instead og 4 different ones
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  //this inactivates the submoit button to prevent multiple clicks
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    //this is to make the back to the top button disappear when a user reaches the top of the page

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  //this allows smooth flow of transitioning

  // Logic to handle the Email Form Submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    //this prevents a screen refresh
    setLoading(true); //this shows a notification based on success or failure

    try {
      // Hits your backend route directly from the home page
      await axios.post("http://localhost:5000/api/contacts", formData);
      toast.success("Message sent! We'll get back to you via email.");
      //this notfifies a user their request was a success
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to send. Please check your connection.");
    } finally {
      setLoading(false); //makes the submit button available again
    }
  };

  return (
    <div style={pageStyle}>
      <Toaster position="top-center" />
      <Navbar />

      {/* --- HERO SECTION --- */}
      {/* uses a background image of a farmer that fades into the background to enable the text to still be shown while the image is displayed */}
      <header style={heroContainer}>
        <div style={heroContent}>
          <h1 style={heroTitle}>
            The Future of <span style={highlight}>Sustainable</span> Agriculture
          </h1>
          <p style={heroSub}>
            Closing the loop between surplus materials and the farmers who need them most.
          </p>
          <div style={btnGroup}>
            <button style={unifiedBtnStyle} onClick={() => navigate('/register')}>Start Selling</button>
            <button style={unifiedBtnStyle} onClick={() => navigate('/marketplace')}>Browse Materials</button>
          </div>
        </div>
      </header>

      {/* --- STATS SECTION --- */}
      {/* this is to show agroloops success as a  business making change */}
      <section style={statsSection}>
        <div style={statCard}><h3 style={statNum}>100%</h3><p style={statLabel}>Sustainable Focused</p></div>
        <div style={statCard}><h3 style={statNum}>Verified</h3><p style={statLabel}>Merchant Network</p></div>
        <div style={statCard}><h3 style={statNum}>Live</h3><p style={statLabel}>Marketplace Listings</p></div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about-section" style={aboutSectionStyle}>
        <div style={glassOverlay}>
          <h2 style={aboutTitle}>About Us</h2>
          <p style={aboutText}>
            AgroLoop is dedicated to closing the loop between surplus agricultural materials and the farmers who need them most.
          </p>
        </div>
      </section>

      {/* --- this is the contact section to enable communication --- */}
      <section id="contact-us" style={contactSection}>
        <div style={contactContainer}>
          <h2 style={aboutTitle}>Get In Touch</h2>
          <p style={contactSub}>Fill out the form below and our team will reach out to you via email.</p>
          
          <div style={formWrapper}>
            <form style={formStyle} onSubmit={handleEmailSubmit}>
              <div style={inputRow}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  style={inputStyle}
                  value={formData.name}
                  required
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  style={inputStyle}
                  value={formData.email}
                  required
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <textarea 
                placeholder="How can we help you?" 
                style={{...inputStyle, minHeight: '150px', resize: 'none'}}
                value={formData.message}
                required
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
              <button 
                type="submit" 
                style={{...mainContactBtn, opacity: loading ? 0.7 : 1}}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
{/* this is the smooth back to the top button */}
      {showTopBtn && (
        <button onClick={scrollToTop} style={backToTopStyle}>↑</button>
      )}

      <footer style={footerStyle}>
        <p>© 2026 AgroLoop. Empowering Sustainable Farming.</p>
      </footer>
    </div>
  );
};

// --- STYLES  ---
//this is styling to provide consistency
const pageStyle = { backgroundColor: '#062c1d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', overflowX: 'hidden', scrollBehavior: 'smooth' };
const heroContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', textAlign: 'center', padding: '60px 20px', backgroundImage: `linear-gradient(rgba(6, 44, 29, 0.8), rgba(6, 44, 29, 0.95)), url(${farmerImg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
const heroContent = { maxWidth: '900px', width: '100%' };
const heroTitle = { fontFamily: 'serif', fontSize: 'clamp(1.8rem, 8vw, 4.5rem)', color: '#e9edc9', lineHeight: '1.2', marginBottom: '20px' };
const highlight = { color: '#a7c957', fontStyle: 'italic' };
const heroSub = { fontSize: 'clamp(1rem, 3vw, 1.2rem)', opacity: 0.8, maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' };
const btnGroup = { display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' };
const unifiedBtnStyle = { backgroundColor: '#e9edc9', color: '#062c1d', padding: '16px 30px', fontSize: '0.95rem', fontWeight: '700', border: 'none', borderRadius: '30px', cursor: 'pointer', transition: '0.3s ease', minWidth: '260px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const statsSection = { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', padding: '60px 20px', backgroundColor: '#052317' };
const statCard = { textAlign: 'center', padding: '25px', width: 'clamp(260px, 80%, 300px)', backgroundColor: 'rgba(233, 237, 201, 0.03)', borderRadius: '20px', border: '1px solid rgba(233, 237, 201, 0.1)' };
const statNum = { fontSize: '2.5rem', color: '#a7c957', margin: '0', fontFamily: 'serif' };
const statLabel = { opacity: 0.7, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' };
const aboutSectionStyle = { minHeight: '70vh', backgroundImage: `url(${aboutImg})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' };
const glassOverlay = { backgroundColor: 'rgba(6, 44, 29, 0.85)', backdropFilter: 'blur(8px)', padding: 'clamp(30px, 5vw, 60px) clamp(20px, 5vw, 40px)', borderRadius: '30px', maxWidth: '850px', textAlign: 'center', margin: '0 15px', border: '1px solid rgba(233, 237, 201, 0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' };
const aboutTitle = { color: '#e9edc9', fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '20px', fontFamily: 'serif' };
const aboutText = { color: '#e9edc9', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', lineHeight: '1.6', opacity: 0.95 };

// --- Contact Form Specific Styles ---
const contactSection = { padding: '80px 20px', backgroundColor: '#062c1d', textAlign: 'center' };
const contactContainer = { maxWidth: '800px', margin: '0 auto' };
const contactSub = { color: '#e9edc9', opacity: 0.7, marginBottom: '40px' };
const formWrapper = { background: 'rgba(255, 255, 255, 0.03)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(233, 237, 201, 0.1)' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputRow = { display: 'flex', gap: '20px', flexWrap: 'wrap' };
const inputStyle = { flex: '1', minWidth: '250px', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' };
const mainContactBtn = { backgroundColor: '#a7c957', color: '#062c1d', padding: '18px 40px', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', fontSize: '1rem' };
const footerStyle = { padding: '40px 20px', textAlign: 'center', borderTop: '1px solid rgba(233, 237, 201, 0.05)', opacity: 0.5, fontSize: '0.8rem' };

const backToTopStyle = { position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#a7c957', color: '#062c1d', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 1001 };

export default Landing;