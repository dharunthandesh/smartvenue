import axios from 'axios';

// Security: Use environment variables for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Efficiency: Add interceptors for token injection (Security)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || 'admin-secret-token'; // Mock token
  if (config.url.includes('/admin')) {
    config.params = { ...config.params, token };
  }
  return config;
});

export const getCrowdData = () => api.get('/crowd');
export const getQueueTimes = () => api.get('/queue');
export const getAlerts = () => api.get('/alerts');
export const getNavigation = (start, end) => api.post('/navigation', { current_location: start, destination: end });
export const updateCrowdLevel = (zoneId, density) => api.post('/admin/update-crowd', { zone_id: zoneId, density });
export const triggerAlert = (alert) => api.post('/admin/trigger-alert', alert);
export const getAnalytics = () => api.get('/admin/analytics');

export default api;
