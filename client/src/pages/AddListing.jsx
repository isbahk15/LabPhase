import React, { useState } from 'react';
import API from '../api'; // Custom Axios instance with base URL configuration
import Navbar from '../components/Navbar';

const AddListing = () => {
  /**
   * STATE MANAGEMENT
   * Using a single object to manage multiple form fields. 
   * This is more efficient than creating 5 separate useState hooks.
   */
  const [formData, setFormData] = useState({
    materialName: '',
    tons: '',
    description: '',
    price: '',
    location: ''
  });

  // Destructuring for cleaner access within the JSX (avoids typing formData.materialName)
  const { materialName, tons, description, price, location } = formData;

  /**
   * INPUT CHANGE HANDLER
   * Uses computed property names [e.target.name] to update the specific 
   * state key that matches the 'name' attribute of the input field.
   * "...formData" ensures we don't overwrite the other fields when updating one.
   */
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  /**
   * FORM SUBMISSION
   * An async function to handle the POST request to the backend.
   */
  const onSubmit = async e => {
    e.preventDefault(); // Prevents the browser from refreshing the page on submit
    
    try {
      // Sends the formData object to the /listings endpoint
      await API.post('/listings', formData);
      
      alert('Success! Listing is live.');
      
      // RESET STATE: Clears the form fields after a successful post
      setFormData({ 
        materialName: '', 
        tons: '', 
        description: '', 
        price: '', 
        location: '' 
      });
    } catch (err) {
      // Error handling: prioritizes the server's error message, falls back to a generic string
      alert(err.response?.data?.message || 'Error posting listing');
    }
  };

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      
      {/* Container for the form with glassmorphism-style background */}
      <div style={{ 
        maxWidth: '450px', 
        margin: '60px auto', 
        padding: '30px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '15px' 
      }}>
        <h2 style={{ textAlign: 'center', color: '#e9edc9' }}>Create Listing</h2>
        
        <form onSubmit={onSubmit}>
          {/* Material Name: Controlled component where value is tied to state */}
          <input 
            style={inputS} 
            type="text" 
            name="materialName" 
            value={materialName} 
            onChange={onChange} 
            placeholder="Material Name" 
            required 
          />
          
          {/* Weight: Handled as a number for backend validation compatibility */}
          <input 
            style={inputS} 
            type="number" 
            name="tons" 
            value={tons} 
            onChange={onChange} 
            placeholder="Weight in Tons" 
            required 
          />
          
          <input 
            style={inputS} 
            type="number" 
            name="price" 
            value={price} 
            onChange={onChange} 
            placeholder="Price" 
          />
          
          <input 
            style={inputS} 
            type="text" 
            name="location" 
            value={location} 
            onChange={onChange} 
            placeholder="Location" 
          />
          
          <textarea 
            style={inputS} 
            name="description" 
            value={description} 
            onChange={onChange} 
            placeholder="Extra details..."
          ></textarea>
          
          <button style={btnS} type="submit">Post to Marketplace</button>
        </form>
      </div>
    </div>
  );
};

/**
 * STYLING OBJECTS
 * Defined outside the component to prevent re-creation on every render.
 */
const inputS = { 
  width: '100%', 
  padding: '12px', 
  margin: '10px 0', 
  borderRadius: '5px', 
  border: 'none', 
  color: 'black' 
};

const btnS = { 
  width: '100%', 
  padding: '12px', 
  backgroundColor: '#e9edc9', 
  color: '#062c1d', 
  fontWeight: 'bold', 
  border: 'none', 
  cursor: 'pointer', 
  marginTop: '10px' 
};

export default AddListing;