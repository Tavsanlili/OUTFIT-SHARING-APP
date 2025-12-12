import API from './api';

const authService = {
  // Admin Login
  adminLogin: async (credentials) => {
    try {
      const response = await API.post('/auth/admin-login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Organization Register
  registerOrganization: async (data) => {
    try {
      const response = await API.post('/auth/register-organization', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // User Login
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh Token
  refresh: async (refreshToken) => {
    try {
      const response = await API.post('/auth/refresh', { refreshToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // User Register
  register: async (data) => {
    try {
      const response = await API.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout (Local)
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export default authService;