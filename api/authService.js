import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './APIClient';

export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await apiClient.post('auth/login', { email, password });
    await AsyncStorage.setItem('authToken', data.token);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const signup = async (userData) => {
  try {
    const { data } = await apiClient.post('auth/signup', userData);
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

export const sendOTP = async ({ email }) => {
  try {
    const { data } = await apiClient.post('auth/otp/send', { identifier:  email });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

export const verifyOTP = async ({ email, otp }) => {
  try {
    const { data } = await apiClient.post(
      `auth/otp/verify?identifier=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
      {} // sending an empty body
    );
   await AsyncStorage.setItem('authToken', data.token);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid OTP');
  }
};
