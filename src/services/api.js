import axios from 'axios';

// Base API URL - change this to your backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/users/profile');
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
    const response = await api.patch(`/elections/${id}`, electionData);
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

  suspend: async (id, reason) => {
    const response = await api.post(`/elections/${id}/suspend`, { reason });
    return response.data;
  },

  resume: async (id) => {
    const response = await api.post(`/elections/${id}/resume`);
    return response.data;
  },
};

// ==================== CANDIDATE APIs ====================

export const candidateAPI = {
  // Get candidates by election
  getByElection: async (electionId) => {
    const response = await api.get(`/elections/${electionId}/candidates`);
    return response.data;
  },

  // Create candidate
  create: async (electionId, candidateData) => {
    const response = await api.post(`/elections/${electionId}/candidates`, candidateData);
    return response.data;
  },
};

// ==================== VOTE APIs ====================

export const voteAPI = {
  // Submit vote
  submit: async (electionId, candidateId) => {
    const response = await api.post('/votes/cast', { electionId, candidateId });
    return response.data;
  },

  // Verify vote by receipt
  verifyReceipt: async (receiptId) => {
    const response = await api.get(`/votes/verify/${receiptId}`);
    return response.data;
  },
  hasVoted: async (electionId) => {
    const response = await api.get(`/votes/status/${electionId}`);
    return response.data;
  },
};

// ==================== RESULTS APIs ====================

export const resultAPI = {
  getAll: async () => {
    const response = await api.get('/results');
    return response.data;
  },
  getByElection: async (electionId) => {
    const response = await api.get(`/results/${electionId}`);
    return response.data;
  },
  tally: async (electionId) => {
    const response = await api.post(`/results/${electionId}/tally`);
    return response.data;
  },
};

export default api;
