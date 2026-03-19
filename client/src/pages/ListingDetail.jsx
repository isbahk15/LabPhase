import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Hooks for routing logic
import API from '../api';
import Navbar from '../components/Navbar';

const ListingDetail = () => {
  /**
   * ROUTING HOOKS
   * useParams: Extracts dynamic parameters from the URL (e.g., /listings/:id).
   * useNavigate: Allows programmatic navigation (e.g., going back or redirecting).
   */
  const { id } = useParams(); 
  const navigate = useNavigate();

  /**
   * STATE
   * listing: Initialized as null because we don't have the data yet.
   * loading: True by default to show a loading state on mount.
   */
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * SIDE EFFECT: Fetch data based on ID
   * The dependency array [id] ensures that if the user clicks a "Next" 
   * button to a different ID, the component refetches the correct data.
   */
  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Dynamic string template to hit the specific backend record
        const res = await API.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error('Error fetching listing details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  /**
   * EARLY RETURNS (Guard Clauses)
   * Prevents the component from trying to read properties of "null" 
   * while data is still in flight.
   */
  if (loading) return <div style={msgStyle}>Loading material details...</div>;
  if (!listing) return <div style={msgStyle}>Listing not found.</div>;

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={containerStyle}>
        
        {/* Programmatic Navigation: -1 tells the browser to go back one step in history */}
        <button onClick={() => navigate(-1)} style={backBtn}>
          ← Back to Marketplace
        </button>
        
        {/* Main content card with high-contrast styling for readability */}
        <div style={detailCard}>
          <h1 style={{ color: '#062c1d', marginBottom: '10px' }}>{listing.materialName}</h1>
          
          {/* Fallback logic: ensures the UI doesn't look empty if optional fields are missing */}
          <p style={locationTag}>{listing.location || 'Location not specified'}</p>
          
          <hr style={{ margin: '20px 0', opacity: '0.2' }} />
          
          {/* Stats Grid: Displays key metrics (Weight/Price) side-by-side */}
          <div style={infoGrid}>
            <div>
              <span style={label}>Quantity Available</span>
              <p style={value}>{listing.tons} Tons</p>
            </div>
            <div>
              <span style={label}>Price per Ton</span>
              <p style={value}>${listing.price}</p>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <span style={label}>Description</span>
            <p style={{ color: '#333', lineHeight: '1.6', marginTop: '10px' }}>
              {listing.description || 'No additional description provided for this material.'}
            </p>
          </div>

          {/* Placeholder button for Lead Generation / Messaging logic */}
          <button style={contactBtn}>Contact Provider</button>
        </div>
      </div>
    </div>
  );
};

/**
 * COMPONENT STYLES
 * Using a mix of Flexbox for the info grid and standard padding for a "Clean" look.
 */
const containerStyle = { maxWidth: '800px', margin: '40px auto', padding: '0 20px' };

const msgStyle = { 
  textAlign: 'center', 
  padding: '50px', 
  color: 'white', 
  backgroundColor: '#062c1d', 
  minHeight: '100vh' 
};

const backBtn = { 
  background: 'none', 
  border: 'none', 
  color: '#e9edc9', 
  cursor: 'pointer', 
  marginBottom: '20px', 
  fontWeight: 'bold' 
};

// White background card provides a nice "pop" against the dark green theme
const detailCard = { 
  backgroundColor: 'white', 
  padding: '40px', 
  borderRadius: '15px', 
  color: '#062c1d' 
};

const locationTag = { color: '#666', fontSize: '1.1rem' };

const infoGrid = { 
  display: 'flex', 
  gap: '40px', 
  marginTop: '20px' 
};

const label = { 
  display: 'block', 
  color: '#888', 
  fontSize: '0.9rem', 
  textTransform: 'uppercase', 
  letterSpacing: '1px' 
};

const value = { 
  fontSize: '1.5rem', 
  fontWeight: 'bold', 
  margin: '5px 0' 
};

const contactBtn = { 
  width: '100%', 
  marginTop: '40px', 
  padding: '15px', 
  backgroundColor: '#062c1d', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  fontWeight: 'bold', 
  cursor: 'pointer' 
};

export default ListingDetail;