import axios from 'axios';

// Base API URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('vortex_current_user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================

export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Register
  register: async (email, password, name, role) => {
    const response = await api.post('/auth/register', { email, password, name, role });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ==================== ELECTION APIs ====================

export const electionAPI = {
  // Get all elections
  getAll: async () => {
    const response = await api.get('/elections');
    return response.data;
  },

  // Get election by ID
  getById: async (id) => {
    const response = await api.get(`/elections/${id}`);
    return response.data;
  },

  // Create election
  create: async (electionData) => {
    const response = await api.post('/elections', electionData);
    return response.data;
  },

  // Update election
  update: async (id, electionData) => {
    const response = await api.put(`/elections/${id}`, electionData);
    return response.data;
  },

  // Delete election
  delete: async (id) => {
    const response = await api.delete(`/elections/${id}`);
    return response.data;
  },

  // Start election
  start: async (id) => {
    const response = await api.post(`/elections/${id}/start`);
    return response.data;
  },

  // Close election
  close: async (id) => {
    const response = await api.post(`/elections/${id}/close`);
    return response.data;
  },
};

// ==================== CANDIDATE APIs ====================

export const candidateAPI = {
  // Get all candidates
  getAll: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  // Get candidates by election
  getByElection: async (electionId) => {
    const response = await api.get(`/candidates/election/${electionId}`);
    return response.data;
  },

  // Create candidate
  create: async (candidateData) => {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },

  // Update candidate
  update: async (id, candidateData) => {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  },

  // Delete candidate
  delete: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
};

// ==================== VOTE APIs ====================

export const voteAPI = {
  // Submit vote
  submit: async (electionId, candidateId) => {
    const response = await api.post('/votes', { electionId, candidateId });
    return response.data;
  },

  // Get user's votes
  getUserVotes: async () => {
    const response = await api.get('/votes/my-votes');
    return response.data;
  },

  // Verify vote by receipt
  verifyReceipt: async (receiptId) => {
    const response = await api.get(`/votes/receipt/${receiptId}`);
    return response.data;
  },

  // Get election results
  getResults: async (electionId) => {
    const response = await api.get(`/votes/results/${electionId}`);
    return response.data;
  },
};

// ==================== VOTER APPROVAL APIs ====================

export const voterAPI = {
  // Get pending voters
  getPending: async () => {
    const response = await api.get('/voters/pending');
    return response.data;
  },

  // Approve voter
  approve: async (voterId) => {
    const response = await api.post(`/voters/${voterId}/approve`);
    return response.data;
  },

  // Reject voter
  reject: async (voterId) => {
    const response = await api.post(`/voters/${voterId}/reject`);
    return response.data;
  },
};

// ==================== ANALYTICS APIs ====================

export const analyticsAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  // Get election turnout
  getTurnout: async (electionId) => {
    const response = await api.get(`/analytics/turnout/${electionId}`);
    return response.data;
  },
};

export default api;
