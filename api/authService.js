import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
}; 

export const signup = async (data) => {
  try {
    const response = await axios.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};
