import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const getCrowdData = () => api.get('/crowd');
export const getQueueTimes = () => api.get('/queue');
export const getAlerts = () => api.get('/alerts');
export const getNavigation = (start, end) => api.post('/navigation', { current_location: start, destination: end });
export const updateCrowdLevel = (zoneId, density) => api.post('/admin/update-crowd', { zone_id: zoneId, density });
export const triggerAlert = (alert) => api.post('/admin/trigger-alert', alert);
export const getAnalytics = () => api.get('/admin/analytics');

export default api;
