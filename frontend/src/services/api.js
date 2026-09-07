import axios from 'axios';

// Get backend API URL from environment variable or fallback to local/relative
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  return '';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const analyzeMessageApi = async (messageText) => {
  try {
    const response = await apiClient.post('/api/analyze', { message: messageText });
    if (response.data && typeof response.data === 'object' && response.data.risk_score !== undefined) {
      return response.data;
    }
    throw new Error('Received malformed response format from backend server.');
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.detail || 'Analysis request failed.');
    } else if (error.request) {
      throw new Error('Backend server is unreachable. Please check backend host status.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
};

export const checkHealthApi = async () => {
  try {
    const response = await apiClient.get('/api/health');
    if (response.data && typeof response.data === 'object' && response.data.status) {
      return response.data;
    }
    return { status: 'offline', model_loaded: false };
  } catch (error) {
    return { status: 'offline', model_loaded: false };
  }
};

export const getDemoMessagesApi = async () => {
  try {
    const response = await apiClient.get('/api/demos');
    // Ensure response is strictly a valid Array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return null; // Fallback to local static demo array
  } catch (error) {
    return null; // Fallback to local static demo array
  }
};
