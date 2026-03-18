import React, { useState } from 'react';
import API from '../api'; 
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
      await API.post('/listings', formData);
      alert('Success! Listing is live.');
      setFormData({ materialName: '', tons: '', description: '', price: '', location: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting listing');
    }
  };

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ maxWidth: '450px', margin: '60px auto', padding: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
        <h2 style={{ textAlign: 'center', color: '#e9edc9' }}>Create Listing</h2>
        <form onSubmit={onSubmit}>
          <input style={inputS} type="text" name="materialName" value={materialName} onChange={onChange} placeholder="Material Name" required />
          <input style={inputS} type="number" name="tons" value={tons} onChange={onChange} placeholder="Weight in Tons" required />
          <input style={inputS} type="number" name="price" value={price} onChange={onChange} placeholder="Price" />
          <input style={inputS} type="text" name="location" value={location} onChange={onChange} placeholder="Location" />
          <textarea style={inputS} name="description" value={description} onChange={onChange} placeholder="Extra details..."></textarea>
          <button style={btnS} type="submit">Post to Marketplace</button>
        </form>
      </div>
    </div>
  );
};

const inputS = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', border: 'none', color: 'black' };
const btnS = { width: '100%', padding: '12px', backgroundColor: '#e9edc9', color: '#062c1d', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' };

export default AddListing;