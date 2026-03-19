import axios from 'axios';

/**
 * AXIOS INSTANCE CREATION
 * Instead of using the global 'axios', we create a custom instance.
 * This allows us to set global defaults like the baseURL so we only 
 * have to type '/listings' instead of the full URL in our components.
 */
const API = axios.create({
  // Pointing to the hosted backend on Render.
  // Ensure the '/api' suffix matches your backend route prefix.
  baseURL: 'https://labphase-3.onrender.com/api', 
});

/**
 * REQUEST INTERCEPTOR
 * Think of this as a "security checkpoint" that every outgoing request 
 * must pass through before it leaves your browser.
 */
API.interceptors.request.use((req) => {
  // 1. Pull the JWT token from the browser's local storage.
  const token = localStorage.getItem('token');

  // 2. If a token exists (meaning the user is logged in), 
  //    attach it to the 'Authorization' header.
  if (token) {
    /**
     * 'Bearer' is the standard schema for JWT.
     * The backend will split this string to verify the token.
     */
    req.headers.Authorization = `Bearer ${token}`;
  }

  // 3. Return the modified request so Axios can proceed with the call.
  return req;
});

// Export the instance to be used as 'API' in Dashboard, AddListing, etc.
export default API;