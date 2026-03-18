import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// A protected form that allows merchants to  post new materials to the marketplace
const AddListing = () => {
  const navigate = useNavigate();
  // Hook for programmatic redirection

  // Initialize state for the form fields
  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    price: "",
    category: "Organic Waste", // Default value
    description: "",
  });

  // handleSubmit: Sends the form data to the backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      //   Post request to the listings endpoint
      // Updated to use the live Render URL and the specific /api/listings path
      await axios.post(
        "https://labphase-3.onrender.com/api/listings",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Listing posted successfully!");
      navigate("/marketplace");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to post. Check your connection.");
    }
  };

  // Array used to map through and generate radio button options
  const categories = ["Organic Waste", "Seed", "Tool", "Plastic"];

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={container}>
        <div style={formBox}>
          <h2 style={title}>List Materials</h2>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputGroup}>
              <label style={labelStyle}>Product Name</label>
              <input
                type="text"
                style={inputStyle}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            {/* --- CATEGORY SELECTION: Using Radio Buttons --- */}{" "}
            <div style={inputGroup}>
              <label style={labelStyle}>Select Category</label>
              <div style={radioContainer}>
                {categories.map((cat) => (
                  <label key={cat} style={radioLabel}>
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={formData.category === cat}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      style={{ marginRight: "10px" }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <div style={row}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Weight (Tons)</label>
                <input
                  type="number"
                  style={inputStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Price (GHS)</label>
                <input
                  type="number"
                  style={inputStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <button type="submit" style={buttonStyle}>
              POST LISTING
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
// --- CSS-in-JS STYLES (Layout & Aesthetics)
const radioContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  background: "rgba(255,255,255,0.05)",
  padding: "15px",
  borderRadius: "8px",
};
const radioLabel = {
  fontSize: "0.9rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};
const pageStyle = {
  backgroundColor: "#062c1d",
  minHeight: "100vh",
  color: "white",
};
const container = {
  display: "flex",
  justifyContent: "center",
  padding: "40px 20px",
};
const formBox = {
  background: "#052317",
  padding: "30px",
  borderRadius: "15px",
  border: "1px solid rgba(233, 237, 201, 0.2)",
  width: "100%",
  maxWidth: "400px",
};
const title = { color: "#e9edc9", textAlign: "center", marginBottom: "20px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const inputGroup = { display: "flex", flexDirection: "column" };
const labelStyle = {
  fontSize: "0.8rem",
  color: "#a7c957",
  marginBottom: "5px",
};
const inputStyle = {
  width: "100%",
  padding: "12px",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "8px",
  color: "white",
};
const row = { display: "flex", gap: "10px" };
const buttonStyle = {
  width: "100%",
  padding: "15px",
  backgroundColor: "#a7c957",
  color: "#062c1d",
  border: "none",
  borderRadius: "30px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
};

export default AddListing;
