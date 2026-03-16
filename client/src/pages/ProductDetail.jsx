import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
// the id is used to tell backend exactly what data to fetch

const ProductDetail = () => {
  const { id } = useParams();
  //we start of at nulll as there is no data until an API call is complete
  const [product, setProduct] = useState(null);
// to retrieve the data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
//we make a GET request to a specific id endpoint and this matches the backend route
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };
    //if the URL ID changes, the effect reruns
    fetchProduct();
  }, [id]);
//it allows the app to run asynchronously showing a loading screen
  if (!product) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Loading Product...</div>;

  return (
    <div style={{ backgroundColor: '#062c1d', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      {/* the main content */}
      <div style={{ padding: '50px' }}>
        <h1 style={{ color: '#e9edc9' }}>{product.name}</h1>
        {/* this is to show how much a product costs */}
        <p style={{ fontSize: '1.5rem', color: '#a7c957' }}>GHS {product.price}</p>
        <div style={{ marginTop: '20px', lineHeight: '1.6', opacity: '0.9' }}>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Quantity Available:</strong> {product.weight} tons</p>
          <hr style={{ borderColor: 'rgba(233, 237, 201, 0.1)', margin: '20px 0' }} />
        <p>{product.description}</p>
        {/* this is a detailed set of sentences to describe exactly what the item is */}
</div>
      </div>
    </div>
  );
};

export default ProductDetail; // CRITICAL: This must be at the very bottom