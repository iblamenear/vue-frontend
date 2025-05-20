import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Simpan token ke localStorage
const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'register', userData);
    if (response.data.token) {
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Registrasi gagal');
  }
};

// Login user
const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + 'login', { email, password });
    if (response.data.token) {
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login gagal');
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

// Get current user
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Cek jika user sudah login
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Setup token untuk requests
const token = localStorage.getItem('token');
if (token) {
  setToken(token);
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};