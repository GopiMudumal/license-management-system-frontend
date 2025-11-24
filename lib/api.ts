import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Loading state management
let loadingCount = 0;

const setLoading = (loading: boolean) => {
  if (typeof window !== 'undefined') {
    if (loading) {
      loadingCount++;
      window.dispatchEvent(new CustomEvent('api-loading-start'));
    } else {
      loadingCount = Math.max(0, loadingCount - 1);
      if (loadingCount === 0) {
        window.dispatchEvent(new CustomEvent('api-loading-end'));
      }
    }
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests and show loader
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: log token presence (don't log the actual token for security)
      if (process.env.NODE_ENV === 'development') {
        console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing');
      }
    } else {
      console.warn('No token found in localStorage for request to:', config.url);
    }
    
    // Show loader for API calls
    setLoading(true);
  }
  return config;
});

// Handle token expiration and invalid tokens, hide loader
api.interceptors.response.use(
  (response) => {
    setLoading(false);
    return response;
  },
  (error) => {
    setLoading(false);
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Only redirect if we're not already on the login page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Check if it's an invalid signature error (token was signed with different secret)
          const errorMessage = error.response?.data?.message || '';
          if (errorMessage.includes('signature') || errorMessage.includes('invalid')) {
            console.warn('Token signature invalid. Please log in again to get a fresh token.');
          }
          
          // Use a small delay to allow error to be displayed
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

