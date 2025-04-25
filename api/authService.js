import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const signup = async (userData) => {
  try {
    const { data } = await api.post('/auth/signup', userData);
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

export const sendOTP = async ({ mobileNumber }) => {
  try {
    const { data } = await api.post('/auth/otp/send', { mobileNumber });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

export const verifyOTP = async ({ mobileNumber, otp }) => {
  try {
    const { data } = await api.post('/auth/otp/verify', { mobileNumber, otp });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid OTP');
  }
};
