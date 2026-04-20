import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getCrowdData = () => api.get('/crowd');
export const getQueueTimes = () => api.get('/queue');
export const getAlerts = () => api.get('/alerts');
export const getAIAdvice = () => api.get('/ai-recommendation');
export const translateContent = (text, lang) => api.get('/translate', { params: { text, target: lang } });
export const getAnalytics = () => api.get('/admin/analytics');

export default api;
