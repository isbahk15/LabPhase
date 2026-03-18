import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://labphase-3.onrender.com/api/listings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const deleteListing = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://labphase-3.onrender.com/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(listings.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h1 style={{ color: '#e9edc9', fontFamily: 'serif' }}>Merchant Dashboard</h1>
        <ul>
          {listings.map((listing) => (
            <li key={listing._id}>
              {listing.name}
              <button onClick={() => deleteListing(listing._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;