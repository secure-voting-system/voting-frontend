import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  profile: () => api.get('/users/profile').then((res) => res.data),
};

export const electionsAPI = {
  list: () => api.get('/elections').then((res) => res.data),
  create: (payload) => api.post('/elections', payload).then((res) => res.data),
  start: (id) => api.post(`/elections/${id}/start`).then((res) => res.data),
  close: (id) => api.post(`/elections/${id}/close`).then((res) => res.data),
  suspend: (id, reason) => api.post(`/elections/${id}/suspend`, { reason }).then((res) => res.data),
  resume: (id) => api.post(`/elections/${id}/resume`).then((res) => res.data),
  update: (id, payload) => api.patch(`/elections/${id}`, payload).then((res) => res.data),
};

export const candidatesAPI = {
  list: (electionId) => api.get(`/elections/${electionId}/candidates`).then((res) => res.data),
  create: (electionId, payload) =>
    api.post(`/elections/${electionId}/candidates`, payload).then((res) => res.data),
};

export const votesAPI = {
  cast: (payload) => api.post('/votes/cast', payload).then((res) => res.data),
  status: (electionId) => api.get(`/votes/status/${electionId}`).then((res) => res.data),
  verify: (receiptId) => api.get(`/votes/verify/${receiptId}`).then((res) => res.data),
  registerVoter: (payload) => api.post('/votes/register-voter', payload).then((res) => res.data),
};

export const resultsAPI = {
  list: () => api.get('/results').then((res) => res.data),
  byElection: (id) => api.get(`/results/${id}`).then((res) => res.data),
  tally: (id) => api.post(`/results/${id}/tally`).then((res) => res.data),
};

export const auditAPI = {
  logs: (id) => api.get(`/audit/${id}/logs`).then((res) => res.data),
  votes: (id) => api.get(`/audit/${id}/votes`).then((res) => res.data),
};

export default api;
