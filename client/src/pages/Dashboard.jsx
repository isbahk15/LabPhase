import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state – exactly matches your screenshot
  const [formData, setFormData] = useState({
    materialType: 'Fertilizer',
    name: '',
    description: '',
    quantity: '',
    price: ''
  });

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // UPDATED: Now shows the REAL backend error instead of generic message
  const handleCreateListing = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        'https://labphase-3.onrender.com/api/listings',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert("✅ Listing created successfully!");
      
      setListings([response.data, ...listings]);
      
      // Reset form
      setFormData({
        materialType: 'Fertilizer',
        name: '',
        description: '',
        quantity: '',
        price: ''
      });
    } catch (error) {
      console.error('=== FULL ERROR FROM BACKEND ===', error.response || error);
      
      let errorMessage = "Error saving listing. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);   // ← This will now show the exact error (e.g. "name is required")
    }
  };

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
      alert("Delete failed");
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ padding: '40px' }}>

        <h1 style={{ color: '#e9edc9', fontFamily: 'serif' }}>Merchant Dashboard</h1>

        {/* New Listing Form - exact visual match */}
        <div style={{
          backgroundColor: '#0f3d2a',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '500px',
          margin: '30px auto',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ color: '#e9edc9', marginBottom: '20px' }}>New Listing</h2>
          
          <form onSubmit={handleCreateListing}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Material Type</label>
              <select 
                name="materialType" 
                value={formData.materialType} 
                onChange={handleInputChange}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1a4a38', color: 'white', border: 'none' }}
              >
                <option value="Fertilizer">Fertilizer</option>
              </select>
            </div>

            <input 
              type="text" 
              name="name" 
              placeholder="DAP" 
              value={formData.name}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#1a4a38', color: 'white', border: 'none' }}
              required
            />

            <textarea 
              name="description" 
              placeholder="For mulching" 
              value={formData.description}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#1a4a38', color: 'white', border: 'none', minHeight: '80px' }}
              required
            />

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <input 
                type="number" 
                name="quantity" 
                placeholder="12" 
                value={formData.quantity}
                onChange={handleInputChange}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#1a4a38', color: 'white', border: 'none' }}
                required
              />
              <input 
                type="number" 
                name="price" 
                placeholder="1234" 
                value={formData.price}
                onChange={handleInputChange}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#1a4a38', color: 'white', border: 'none' }}
                required
              />
            </div>

            <button 
              type="submit"
              style={{
                backgroundColor: '#e9edc9',
                color: '#062c1d',
                padding: '14px',
                width: '100%',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              CREATE LISTING
            </button>
          </form>
        </div>

        {/* Your Listings */}
        <h2 style={{ color: '#e9edc9' }}>Your Listings</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {listings.map((listing) => (
            <li key={listing._id} style={{ 
              backgroundColor: '#0f3d2a', 
              padding: '15px', 
              marginBottom: '10px', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>
                {listing.name || listing.materialType} — {listing.quantity} × KES {listing.price}
              </span>
              <button 
                onClick={() => deleteListing(listing._id)}
                style={{ backgroundColor: '#c11212', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;