import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust path if needed

const Dashboard = () => {
  const [listings, setListings] = useState([]); // Correct state name
  const [loading, setLoading] = useState(true);


    fetchListings();
  }, []; // Run once on mount

  // 2. Handle Delete (This can stay outside as it's an event handler)
  const deleteListing = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://labphase-3.onrender.com/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter out the deleted item from state
      setListings(listings.filter(item => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <div style={{color: 'white', textAlign: 'center'}}>Loading Dashboard...</div>;

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h1 style={{ color: '#e9edc9', fontFamily: 'serif' }}>Merchant Dashboard</h1>
        {/* Render your listings table or grid here using listings.map() */}
      </div>
    </div>
  );
};

export default Dashboard;