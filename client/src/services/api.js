import axios from 'axios';

// Use import.meta.env for Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle CORS
apiClient.interceptors.request.use(
  config => {
    // Remove trailing slash from URL if present
    if (config.url && config.url.endsWith('/')) {
      config.url = config.url.slice(0, -1);
    }
    return config;
  },
  error => Promise.reject(error)
);

export const auditUrl = async (url) => {
  try {
    const response = await apiClient.post('/audit', { url });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Audit failed');
    }
    
    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      throw new Error('Could not reach the server. Please check your connection.');
    } else {
      throw error;
    }
  }
};