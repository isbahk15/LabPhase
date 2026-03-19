import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for button functionality
import API from '../api';
import Navbar from '../components/Navbar';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const getMarketData = async () => {
      try {
        const res = await API.get('/listings');
        setItems(res.data);
      } catch (err) {
        console.error('Marketplace fetch error:', err);
      }
    };
    getMarketData();
  }, []);

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Available Materials</h2>
        <div style={marketGrid}>
          {items.map(item => (
            <div key={item._id} style={marketCard}>
              {/* Added fallback text to help debug if materialName is missing in DB */}
              <h4>{item.materialName || "Unnamed Material"}</h4>
              <p>Location: {item.location || 'Not specified'}</p>
              <p><strong>{item.tons || 0} Tons</strong> @ ${item.price || 0}/ton</p>
              
              {/* Updated button to navigate to a specific listing page */}
              <button 
                style={viewBtn} 
                onClick={() => navigate(`/listing/${item._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const marketGrid = { display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center' };
const marketCard = { width: '280px', padding: '20px', backgroundColor: 'white', color: '#062c1d', borderRadius: '8px' };
const viewBtn = { width: '100%', marginTop: '10px', padding: '8px', backgroundColor: '#062c1d', color: 'white', border: 'none', cursor: 'pointer' };

export default Marketplace;