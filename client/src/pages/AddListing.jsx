import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AddListing = () => {
  const [formData, setFormData] = useState({
    materialName: '',
    tons: '',
    description: '',
    price: '',
    location: ''
  });

  const { materialName, tons, description, price, location } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Use the live Render URL
      await axios.post('https://labphase-3.onrender.com/api/listings', formData, config);
      alert('Listing Posted Successfully!');
      setFormData({ materialName: '', tons: '', description: '', price: '', location: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error creating listing';
      alert(errorMsg);
    }
  };

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center' }}>Add New Listing</h2>
        <form onSubmit={onSubmit}>
          <input style={inputStyle} type="text" placeholder="Material Name" name="materialName" value={materialName} onChange={onChange} required />
          <input style={inputStyle} type="number" placeholder="Quantity (Tons)" name="tons" value={tons} onChange={onChange} required />
          <input style={inputStyle} type="number" placeholder="Price" name="price" value={price} onChange={onChange} />
          <input style={inputStyle} type="text" placeholder="Location" name="location" value={location} onChange={onChange} />
          <textarea style={inputStyle} placeholder="Description" name="description" value={description} onChange={onChange}></textarea>
          <button style={btnStyle} type="submit">List Material</button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '5px', border: 'none' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#e9edc9', color: '#062c1d', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' };

export default AddListing;