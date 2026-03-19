import React, { useEffect, useState } from 'react';
import API from '../api'; // Your Axios instance (likely handles Auth headers)
import Navbar from '../components/Navbar';

const Dashboard = () => {
  /**
   * STATE INITIALIZATION
   * listings: Array to store the data returned from the database.
   * loading: Boolean to track the API request status (shows a message while waiting).
   */
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * SIDE EFFECT: useEffect
   * The empty dependency array [] means this runs exactly ONCE 
   * when the component first mounts (appears on screen).
   */
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        // GET request to your backend endpoint.
        // If your API.js includes an interceptor, it attaches the JWT token automatically.
        const res = await API.get('/api/listings'); 
        
        // Update the state with the array of listings from the server
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        // Stop the loading state regardless of whether the request succeeded or failed
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

        {/* CONDITIONAL RENDERING TRIAGE:
          1. Check if we are still loading.
          2. If not loading, check if we have listings to show.
          3. If no listings, show the "Empty State" message.
        */}
        
        {loading ? (
          // 1. Loading State: Provides visual feedback so the user doesn't see a blank screen.
          <p>Loading your listings...</p>
        ) : listings.length > 0 ? (
          // 2. Success State: We have data, so we map through the array.
          <div style={gridStyle}>
            {listings.map((item) => (
              /* KEY PROP: React needs a unique 'key' for each list item 
                 to track changes efficiently (usually the database _id).
              */
              <div key={item._id} style={cardStyle}>
                <h3>{item.materialName}</h3>
                <p>Quantity: {item.tons} Tons</p>
                <p>Price: ${item.price}</p>
                {/* Visual indicator that the post is live */}
                <span style={statusBadge}>Active</span>
              </div>
            ))}
          </div>
        ) : (
          // 3. Empty State: The request finished, but the merchant has no posts yet.
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>You haven't posted any materials yet.</p>
            <a href="/add-listing" style={linkBtn}>Create Your First Listing</a>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * CSS-IN-JS STYLING
 */

// Grid layout: Automatically wraps cards based on screen width (Responsive)
const gridStyle = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
  gap: '20px', 
  marginTop: '20px' 
};

// Card design: Uses semi-transparent background (glassmorphism) and borders
const cardStyle = { 
  background: 'rgba(255,255,255,0.1)', 
  padding: '20px', 
  borderRadius: '10px', 
  border: '1px solid #e9edc9' 
};

// Status Badge: Small visual tag for UI polish
const statusBadge = { 
  backgroundColor: '#e9edc9', 
  color: '#062c1d', 
  padding: '2px 8px', 
  borderRadius: '4px', 
  fontSize: '0.8rem' 
};

const linkBtn = { 
  color: '#e9edc9', 
  textDecoration: 'underline', 
  fontWeight: 'bold' 
};

export default Dashboard;