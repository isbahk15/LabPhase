import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Essential for linking cards to their detail pages
import API from '../api';
import Navbar from '../components/Navbar';

const Marketplace = () => {
  /**
   * STATE
   * items: Stores the array of all available listings fetched from the database.
   */
  const [items, setItems] = useState([]);
  
  // navigate: Hook used to change URLs programmatically when a button is clicked
  const navigate = useNavigate(); 

  /**
   * DATA FETCHING
   * This effect runs once on mount. It hits the general listings endpoint 
   * to populate the marketplace.
   */
  useEffect(() => {
    const getMarketData = async () => {
      try {
        // Axios GET request to retrieve all marketplace entries
        const res = await API.get('/listings');
        
        // Update state with the array of items (res.data)
        setItems(res.data);
      } catch (err) {
        // Logs the error to the console for developer debugging
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
        
        {/* CONTAINER GRID */}
        <div style={marketGrid}>
          {/* DYNAMIC RENDERING
            We use .map() to loop through the 'items' array. 
            For every object in the array, we return a 'marketCard' JSX block.
          */}
          {items.map(item => (
            <div key={item._id} style={marketCard}>
              
              {/* FALLBACKS (The "||" logic)
                  Essential for data integrity. If a field is missing in the DB, 
                  the UI won't look "broken" or empty. 
              */}
              <h4>{item.materialName || "Unnamed Material"}</h4>
              
              <p>Location: {item.location || 'Not specified'}</p>
              
              <p><strong>{item.tons || 0} Tons</strong> @ ${item.price || 0}/ton</p>
              
              {/* INTERACTIVITY
                The onClick uses a template literal to inject the item's unique ID 
                into the URL, matching the route defined in your App.js/Router.
              */}
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

/**
 * COMPONENT STYLES
 */

// Uses Flexbox with wrap to ensure cards move to the next row on smaller screens
const marketGrid = { 
  display: 'flex', 
  flexWrap: 'wrap', 
  gap: '25px', 
  justifyContent: 'center' 
};

// High-contrast card (Dark text on white) to separate it from the deep green background
const marketCard = { 
  width: '280px', 
  padding: '20px', 
  backgroundColor: 'white', 
  color: '#062c1d', 
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)' // Added a slight shadow for depth
};

const viewBtn = { 
  width: '100%', 
  marginTop: '10px', 
  padding: '8px', 
  backgroundColor: '#062c1d', 
  color: 'white', 
  border: 'none', 
  cursor: 'pointer',
  borderRadius: '4px',
  fontWeight: 'bold'
};

export default Marketplace;