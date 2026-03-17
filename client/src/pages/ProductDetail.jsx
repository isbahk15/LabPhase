import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
// ProductDetail Component: Displays the full information for a single marketplace item.
const ProductDetail = () => {
  const { id } = useParams();
  // State to hold the specific product object once fetched
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // GET request to a parameterized API route
        // Updated to use the correct /api/listings/:id endpoint
        const res = await axios.get(`https://labphase-3.onrender.com/api/listings/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };
    // Conditional Rendering: Show a loading state until the 'product' object is populated
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{ backgroundColor: "#062c1d", minHeight: "100vh", color: "white" }}
    >
      <Navbar />
      {/* Main Content Container */}
      <div style={{ padding: "50px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#e9edc9", fontFamily: "serif", fontSize: "3rem" }}>
          {product.name}
        </h1>
        <p style={{ fontSize: "2rem", color: "#a7c957", fontWeight: "bold" }}>
          GHS {product.price}
        </p>
{/* Technical Details Section */}
        <div
          style={{
            marginTop: "30px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "20px",
          }}
        >
          {/* {/* Category Display logic with a fallback string */}
          <p style={detailItem}>
            <strong style={detailLabel}>Category:</strong>{" "}
            {product.category || "General / Organic"}
          </p>
          {/* Logic to handle nested user data (prevents undefined errors) */}
          <p style={detailItem}>
            <strong style={detailLabel}>Posted By:</strong>
            {/* Check if user exists first to prevent crashes */}
            {/* Note: Ensure backend uses 'populate' to send the user object */}
            {product.user ? product.user.name : "Anonymous Merchant"}
          </p>
          {/* Numerical data display */}
          <p style={detailItem}>
            <strong style={detailLabel}>Quantity Available:</strong>{" "}
            {product.weight} tons
          </p>
{/* Long-form Description text */}
          <h3
            style={{
              color: "#e9edc9",
              marginTop: "40px",
              marginBottom: "10px",
            }}
          >
            Description
          </h3>
          <p style={{ lineHeight: "1.8", opacity: 0.8, fontSize: "1.1rem" }}>
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const detailItem = { marginBottom: "15px", fontSize: "1.2rem" };
const detailLabel = { color: "#a7c957", marginRight: "10px" };

export default ProductDetail;