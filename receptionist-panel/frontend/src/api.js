import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/' });

// Custom error handler
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return { message: data.message || 'Invalid request. Please check your input.', type: 'warning' };
      case 401:
        return { message: data.message || 'Authentication failed. Please log in again.', type: 'error' };
      case 403:
        return { message: data.message || 'You do not have permission to access this resource.', type: 'error' };
      case 404:
        return { message: data.message || 'The requested resource was not found.', type: 'warning' };
      case 500:
        return { message: 'Server error. Please try again later.', type: 'error' };
      default:
        return { message: data.message || 'An unexpected error occurred.', type: 'error' };
    }
  } else if (error.request) {
    return { message: 'No response received from server. Please check your network connection.', type: 'error' };
  } else {
    return { message: error.message || 'An unexpected error occurred.', type: 'error' };
  }
};

// Attach token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth API functions
export const login = async (formData) => {
  try {
    const response = await API.post('/auth/login', formData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const signup = async (formData) => {
  try {
    const response = await API.post('/auth/signup', formData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const googleLogin = async (credential) => {
  try {
    const response = await API.post('/auth/google', { credential });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};
