import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Attach Bearer token on each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eduguide_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for graceful error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthenticated, clear local storage
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('eduguide_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
