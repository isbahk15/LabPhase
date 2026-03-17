import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [myItems, setMyItems] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [formData, setFormData] = useState({
    name: "", 
    weight: "", 
    price: "", 
    description: "", 
    category: "Fertilizer", 
    status: "Active"
  });

  // Fetch data on loadz
  useEffect(() => {
    fetchListings();
  }, []);

  // Use the live Render URL
  const fetchListings = async () => {
    try {
      const res = await axios.get("https://labphase-3.onrender.com/api/listings");
      setMyItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load listings.");
    }
  };

  // Submit with Auth Token to fix "Anonymous Merchant"
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post("https://labphase-3.onrender.com/api/listings", formData, config);
      
      setShowForm(false);
      fetchListings(); 
      setFormData({ name: "", weight: "", price: "", description: "", category: "Fertilizer", status: "Active" });
      toast.success("New material listed successfully!");
    } catch (err) {
      toast.error("Error saving listing. Please ensure you are logged in.");
    }
  };

  const deleteListing = async (id) => {
    if (window.confirm("Remove this material?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://labphase-3.onrender.com/api/listings/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchListings();
        toast.success("Material removed.");
      } catch (err) {
        toast.error("Failed to delete.");
      }
    }
  };

  const filteredItems = myItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (cat) => {
    if (cat === 'Seed') return '🌾';
    if (cat === 'Tool') return '🚜';
    return '🌱'; 
  };

  const getCategoryStyle = (cat) => {
    const styles = {
      Fertilizer: { bg: 'rgba(167, 201, 87, 0.2)', color: '#a7c957' },
      Seed: { bg: 'rgba(244, 162, 97, 0.2)', color: '#f4a261' },
      Tool: { bg: 'rgba(42, 157, 143, 0.2)', color: '#2a9d8f' }
    };
    return styles[cat] || { bg: 'rgba(255,255,255,0.1)', color: 'white' };
  };

  return (
    <div style={dashPage}>
      <Toaster position="top-center" />
      <Navbar />
      <div style={container}>
        <div style={headerSection}>
          <h2 style={title}>Merchant Account</h2>
          <button className="aesthetic-btn" style={addBtn} onClick={() => setShowForm(true)}>
            + List New Material
          </button>
        </div>

        <div style={searchContainer}>
          <input 
            type="text" 
            placeholder="Search by name or category (e.g. Seed)..." 
            style={searchField}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={tableWrapper}>
          <table style={table}>
            <thead>
              <tr style={tableHeader}>
                <th style={th}>Icon</th>
                <th style={th}>Type & Name</th>
                <th style={th}>Weight</th>
                <th style={th}>Price</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const catStyle = getCategoryStyle(item.category);
                return (
                  <tr key={item._id} className="dash-row" style={tableRow}>
                    <td style={td}>
                      <div style={iconContainer}>
                        {getCategoryIcon(item.category)}
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{...catBadge, backgroundColor: catStyle.bg, color: catStyle.color}}>
                        {item.category || 'Fertilizer'}
                      </span>
                      <div style={{marginTop: '8px'}}>
                        <strong style={{color: '#e9edc9', fontSize: '1.1rem'}}>{item.name}</strong>
                        <p style={descPreview}>{item.description}</p>
                      </div>
                    </td>
                    <td style={td}><span style={statBadge}>{item.weight} Tons</span></td>
                    <td style={td}><span style={priceBadge}>{item.price} GHS</span></td>
                    <td style={td}>
                      <button className="delete-btn-aesthetic" onClick={() => deleteListing(item._id)} style={deleteBtn}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div style={modalOverlay} onClick={() => setShowForm(false)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{fontFamily: 'serif', marginBottom: '20px', color: '#e9edc9'}}>New Listing</h2>
            <form style={form} onSubmit={handleSubmit}>
              
              <label style={labelStyle}>Material Type</label>
              <select 
                className="auth-input" 
                value={formData.category}
                style={{cursor: 'pointer', padding: '10px', borderRadius: '8px', background: '#062c1d', color: 'white'}}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Fertilizer">Fertilizer</option>
                <option value="Seed">Seed</option>
                <option value="Tool">Tool</option>
              </select>

              <input 
                type="text" placeholder="Material Name" className="auth-input" required 
                style={inputStyle}
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
              <textarea 
                placeholder="Description" className="auth-input" style={{...inputStyle, ...textAreaStyle}} required 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
              
              <div style={{display: 'flex', gap: '15px'}}>
                <input 
                  type="number" placeholder="Tons" className="auth-input" required 
                  style={inputStyle}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})} 
                />
                <input 
                  type="number" placeholder="Price (GHS)" className="auth-input" required 
                  style={inputStyle}
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                />
              </div>
              <button type="submit" className="aesthetic-btn" style={submitBtn}>Create Listing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const dashPage = { backgroundColor: '#062c1d', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' };
const container = { padding: '40px 8%', maxWidth: '1400px', margin: '0 auto' };
const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const title = { fontFamily: 'serif', fontSize: '2.5rem', color: '#e9edc9' };
const searchContainer = { marginBottom: '20px' };
const searchField = { width: '100%', padding: '15px 25px', borderRadius: '30px', border: '1px solid rgba(233,237,201,0.2)', background: 'rgba(255,255,255,0.03)', color: 'white', outline: 'none' };
const tableWrapper = { background: 'rgba(255, 255, 255, 0.02)', borderRadius: '20px', border: '1px solid rgba(233,237,201,0.1)', overflow: 'hidden' };
const table = { width: '100%', borderCollapse: 'collapse' };
const tableHeader = { background: 'rgba(233, 237, 201, 0.05)' };
const th = { padding: '20px', textAlign: 'left', opacity: 0.5, fontSize: '0.75rem', textTransform: 'uppercase' };
const td = { padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' };
const tableRow = { transition: '0.2s' };

const iconContainer = {
  width: '50px',
  height: '50px',
  borderRadius: '12px',
  backgroundColor: 'rgba(233, 237, 201, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  border: '1px solid rgba(233,237,201,0.1)'
};

const catBadge = { padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' };
const descPreview = { fontSize: '0.85rem', opacity: 0.6, marginTop: '5px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const statBadge = { backgroundColor: 'rgba(167, 201, 87, 0.15)', color: '#a7c957', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' };
const priceBadge = { backgroundColor: 'rgba(233, 237, 201, 0.1)', color: '#e9edc9', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' };
const addBtn = { padding: '12px 25px', backgroundColor: '#e9edc9', color: '#062c1d', border: 'none', borderRadius: '30px', fontWeight: '700', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 };
const modalContent = { background: '#052317', padding: '40px', borderRadius: '20px', width: '500px', border: '1px solid rgba(233, 237, 201, 0.2)' };
const form = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid rgba(233,237,201,0.2)', background: '#062c1d', color: 'white' };
const textAreaStyle = { minHeight: '80px', resize: 'none' };
const submitBtn = { padding: '12px', backgroundColor: '#e9edc9', color: '#062c1d', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const deleteBtn = { padding: '8px 15px', background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '6px', cursor: 'pointer' };
const labelStyle = { fontSize: '0.8rem', opacity: 0.6, marginBottom: '-10px', marginLeft: '5px' };

export default Dashboard;