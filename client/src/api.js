import axios from 'axios';

const API = axios.create({
  baseURL: 'https://labphase-3.onrender.com/api',
});

// Attach the token automatically to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;