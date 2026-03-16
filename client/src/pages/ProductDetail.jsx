import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Ensure this URL matches your backend port (5000)
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Loading Product...</div>;

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ padding: '50px' }}>
        <h1 style={{ color: '#e9edc9' }}>{product.name}</h1>
        <p style={{ fontSize: '1.5rem', color: '#a7c957' }}>GHS {product.price}</p>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail; // CRITICAL: This must be at the very bottom