import axios from 'axios';

// Get backend API URL from environment variable or fallback to local
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  // In development, Vite proxy routes '/api' to backend
  return '';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

export const analyzeMessageApi = async (messageText) => {
  try {
    const response = await apiClient.post('/api/analyze', { message: messageText });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.detail || 'Analysis request failed.');
    } else if (error.request) {
      throw new Error('Backend server is unreachable. Please verify backend is running.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
};

export const checkHealthApi = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    return { status: 'offline', model_loaded: false };
  }
};

export const getDemoMessagesApi = async () => {
  try {
    const response = await apiClient.get('/api/demos');
    return response.data;
  } catch (error) {
    return null; // Will fallback to local static demo array
  }
};
