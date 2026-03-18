import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Correct path to the new folder// Marketplace page: Fetches and displays all available listings.
const Marketplace = () => {
  const [items, setItems] = useState([]);// Master list of items from DB
  const [loading, setLoading] = useState(true);// Loading state for UI feedback
  const [searchTerm, setSearchTerm] = useState("");// User input for filtering

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        /** * Updated to production URL with /api/listings path.
         * This matches your backend structure for fetching items.
         **/
        const res = await axios.get('https://labphase-3.onrender.com/api/listings', {
          headers: { Authorization: `Bearer ${token}` } // Protected route requires JWT
        });
        // Validation: Ensure the response is an array before setting state
        setItems(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching marketplace data", err);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Helper: Returns a specific emoji based on the item category string.
  const getCategoryIcon = (cat) => {
    const category = String(cat || "").toLowerCase(); 
    if (category.includes('seed')) return '🌾';
    if (category.includes('tool')) return '🚜';
    if (category.includes('waste') || category.includes('organic')) return '🍃';
    if (category.includes('plastic')) return '♻️';
    return '📦'; // General package icon fallback
  };

  const handleContact = (item) => {
    // Directs user to WhatsApp with a pre-filled message
    const phoneNumber = "254733955610"; 
    const message = `Hello! I saw your listing for "${item.name}" on AgroLoop. Is it still available?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // --- THE SAFETY FILTER (Crucial for preventing crashes) ---
  // Filtering Logic: Creates a new array of items that match the search term.
  const filteredItems = items.filter(item => {
    const name = (item.name || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return name.includes(search) || category.includes(search);
  });
// Show loading message while fetching data
  if (loading) return <div style={msgStyle}>Loading Marketplace...</div>;

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={container}>
        {/* Header Section: Title and Search Input */}
        <div style={headerRow}>
          <div>
            <h1 style={title}>Agricultural Marketplace</h1>
            <p style={subtitle}>{filteredItems.length} items available for trade</p>
          </div>
          {/* Clear Button: Only visible if there is text in the search bar */}
          <div style={searchContainer}>
            <input 
              type="text" 
              placeholder="Search waste, seeds, or tools..." 
              style={searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={clearBtn}>✕</button>
            )}
          </div>
        </div>
        {/* Grid Layout for Item Cards */}
        <div style={grid}>
          {filteredItems.map(item => (
            <div key={item._id} style={card}>
              <div style={iconHeader}>
                <span style={bigIcon}>{getCategoryIcon(item.category)}</span>
              </div>
              
              <div style={cardBody}>
                <span style={badge}>{item.category || "General"}</span>
                <h3 style={itemTitle}>{item.name || "Unnamed Item"}</h3>
                <p style={priceText}>
                  {item.price ? `${item.price} GHS` : "Contact for Price"}
                </p>
                {/* Navigation and Action Buttons */}
                <div style={actionRow}>
                  <Link to={`/product/${item._id}`} style={detailsLink}>View Info</Link>
                  <button onClick={() => handleContact(item)} style={contactBtn}>
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State  Visible only when search yields no results */}
        {filteredItems.length === 0 && (
          <div style={emptyState}>
            <div style={{fontSize: '4rem', marginBottom: '10px'}}>🔎</div>
            <p style={{opacity: 0.7, fontSize: '1.1rem'}}>No items match your search for "{searchTerm}"</p>
            <button onClick={() => setSearchTerm("")} style={resetBtn}>Show all listings</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ----- CSS-in-JS STYLES (Modular & Scoped) ------
const pageStyle = { backgroundColor: '#062c1d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' };
const container = { padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' };
const headerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '40px', gap: '20px' };

const searchContainer = { position: 'relative', width: '100%', maxWidth: '350px' };
const searchBar = { width: '100%', padding: '14px 45px 14px 20px', borderRadius: '30px', border: '1px solid rgba(167, 201, 87, 0.3)', background: 'rgba(255, 255, 255, 0.07)', color: 'white', outline: 'none', fontSize: '0.95rem' };
const clearBtn = { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a7c957', cursor: 'pointer', fontSize: '1.1rem' };

const msgStyle = { color: 'white', textAlign: 'center', marginTop: '100px', fontSize: '1.2rem' };
const title = { fontFamily: 'serif', margin: 0, color: '#e9edc9', fontSize: '2.2rem' };
const subtitle = { color: '#a7c957', margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.8 };

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' };
const card = { background: '#052317', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(233,237,201,0.1)', transition: 'transform 0.2s' };
const iconHeader = { height: '140px', background: 'linear-gradient(135deg, rgba(167, 201, 87, 0.1) 0%, rgba(5, 35, 23, 1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const bigIcon = { fontSize: '4rem' };

const cardBody = { padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' };
const badge = { background: 'rgba(167, 201, 87, 0.2)', color: '#a7c957', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', width: 'fit-content', border: '1px solid rgba(167, 201, 87, 0.3)' };
const itemTitle = { margin: '5px 0', color: '#fefae0', fontSize: '1.3rem', letterSpacing: '0.5px' };
const priceText = { fontSize: '1.5rem', fontWeight: 'bold', color: '#a7c957', margin: '0 0 10px 0' };

const actionRow = { display: 'flex', gap: '12px', marginTop: '10px' };
const detailsLink = { flex: 1, textAlign: 'center', textDecoration: 'none', color: '#e9edc9', border: '1px solid rgba(233,237,201,0.2)', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', transition: 'all 0.2s' };
const contactBtn = { flex: 1, background: '#a7c957', color: '#062c1d', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' };

const emptyState = { textAlign: 'center', marginTop: '80px', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' };
const resetBtn = { background: '#e9edc9', border: 'none', color: '#062c1d', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' };

export default Marketplace;