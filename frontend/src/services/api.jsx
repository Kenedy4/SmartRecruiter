import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: '/api', // Proxy path; Vite forwards this to the backend during development
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT token interceptor - Adds Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assumes JWT is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle errors during request creation
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses globally
api.interceptors.response.use(
  (response) => {
    // Simply return the response if successful
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error("API Response Error:", error?.response || error.message);

    // Handle specific HTTP status codes
    if (error?.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error("Unauthorized - Redirecting to login...");
        // Optional: Redirect to login page or clear localStorage if token is invalid
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Uncomment if redirection is required
      }
      if (status === 403) {
        console.error("Forbidden - Access denied.");
      }
    } else {
      console.error("No response received from the server.");
    }

    // Reject the promise with a meaningful error message
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
