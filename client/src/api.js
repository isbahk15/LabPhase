import axios from 'axios';

const API = axios.create({
  // This MUST be your Render URL, not localhost
  baseURL: 'https://labphase-3.onrender.com/api', 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;