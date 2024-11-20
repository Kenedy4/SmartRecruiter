import api from './api';

// Login Service
const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data; // Return the data from the server
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
    throw new Error(errorMessage);
  }
};

// Signup Service
const signup = async (data) => {
  try {
    const response = await api.post('/signup', data);
    return response.data; // Return the data from the server
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
    throw new Error(errorMessage);
  }
};

// Forgot Password Service
const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data; // Return the data from the server
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to send password reset email. Please try again.";
    throw new Error(errorMessage);
  }
};

// Reset Password Service
const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(`/reset-password/${token}`, { newPassword });
    return response.data; // Return the data from the server
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to reset password. Please try again.";
    throw new Error(errorMessage);
  }
};

export default {
  login,
  signup,
  forgotPassword,
  resetPassword,
};
