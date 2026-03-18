import axios from 'axios';

const API = axios.create({
  // Use your live Render URL
  baseURL: 'https://labphase-3.onrender.com/api',
});

// Automatically add token to headers if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;