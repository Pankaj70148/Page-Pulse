import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const auditUrl = async (url) => {
  try {
    const response = await apiClient.post('/audit', { url });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Audit failed');
    }
    
    return response.data.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Could not reach the server. Please check your connection.');
    } else {
      throw error;
    }
  }
};