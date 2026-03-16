import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Marketplace = () => {
  const [items, setItems] = useState([]);//an array to hold the fetched listings
  const [loading, setLoading] = useState(true);//to check if data is still being downloaded

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        //this allows only authorised t=user to access the marektplace
        const res = await axios.get('http://localhost:5000/api/listings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setItems(res.data);//updates the state with the back end data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching marketplace data", err);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);
//this is my UI to help match strings to emojis
  const getCategoryIcon = (cat) => {
    if (cat === 'Seed') return '🌾';
    if (cat === 'Tool') return '🚜';
    return '🌱'; 
  };

  // --- WhatsApp Contact Logic ---

  //this is my contact directly section for users to communicate with sellers
  const handleContact = (item) => {
    const phoneNumber = "233XXXXXXXXX"; // Replace with your actual merchant phone number
    const message = `Hello! I am interested in buying ${item.weight} tons of ${item.name} for ${item.price} GHS. Is it still available?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    //this opens whatsapp in a new tab on the browser
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return <div style={msgStyle}>Loading Marketplace...</div>;
//this signals that the data fetching is in the works
  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={container}>
        <h1 style={title}>Agricultural Marketplace</h1>
        {/* this is to ensure the app fits on a variety if different screen sizes */}
        <div style={grid}>
          {items.map(item => (
            <div key={item._id} style={card}>
              <div style={iconHeader}>
                <span style={bigIcon}>{getCategoryIcon(item.category)}</span>
              </div>
              
              <div style={cardBody}>
                <span style={badge}>{item.category}</span>
                <h3 style={itemTitle}>{item.name}</h3>
                <p style={priceText}>{item.price} GHS</p>
                {/* this are the action buttons to do a "task" */}
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
      </div>
    </div>
  );
};

// --- STYLES ---
//this continues to apply the agroloop theme 
const pageStyle = { backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' };
const container = { padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' };
const msgStyle = { color: 'white', textAlign: 'center', marginTop: '50px' };
const title = { fontFamily: 'serif', marginBottom: '30px', color: '#e9edc9' };
// this enusures the cards are perfectly sized
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const card = { background: '#052317', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(233,237,201,0.1)' };
const iconHeader = { height: '120px', background: 'rgba(233, 237, 201, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const bigIcon = { fontSize: '3.5rem' };
const cardBody = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' };
const badge = { background: '#a7c957', color: '#062c1d', padding: '3px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', width: 'fit-content' };
const itemTitle = { margin: '5px 0', color: '#e9edc9', fontSize: '1.2rem' };
const priceText = { fontSize: '1.4rem', fontWeight: 'bold', color: '#a7c957', marginBottom: '10px' };

const actionRow = { display: 'flex', gap: '10px', marginTop: '5px' };

const detailsLink = { 
  flex: 1, textAlign: 'center', textDecoration: 'none', color: '#e9edc9', 
  border: '1px solid rgba(233,237,201,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' 
};

const contactBtn = { 
  flex: 1, background: '#a7c957', color: '#062c1d', border: 'none', 
  padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' 
};

export default Marketplace;
