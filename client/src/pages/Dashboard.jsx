import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        // This automatically uses the token from your new API.js
        const res = await API.get('/merchant/listings'); 
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h1 style={{ color: '#e9edc9' }}>Merchant Dashboard</h1>
        {loading ? (
          <p>Loading your listings...</p>
        ) : listings.length > 0 ? (
          <div style={gridStyle}>
            {listings.map((item) => (
              <div key={item._id} style={cardStyle}>
                <h3>{item.materialName}</h3>
                <p>Quantity: {item.tons} Tons</p>
                <p>Price: ${item.price}</p>
                <span style={statusBadge}>Active</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>You haven't posted any materials yet.</p>
            <a href="/add-listing" style={linkBtn}>Create Your First Listing</a>
          </div>
        )}
      </div>
    </div>
  );
};

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' };
const cardStyle = { background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', border: '1px solid #e9edc9' };
const statusBadge = { backgroundColor: '#e9edc9', color: '#062c1d', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' };
const linkBtn = { color: '#e9edc9', textDecoration: 'underline', fontWeight: 'bold' };

export default Dashboard;