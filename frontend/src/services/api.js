import axios from 'axios';

const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getDashboardStats = () => api.get('/stats/dashboard');
export const getSlots = (params) => api.get('/slots', { params });
export const getSlotById = (id) => api.get(`/slots/${id}`);
export const createSlot = (data) => api.post('/slots', data);
export const updateSlot = (id, data) => api.put(`/slots/${id}`, data);
export const deleteSlot = (id) => api.delete(`/slots/${id}`);

export const postSensorReading = (data) => api.post('/sensors/reading', data);
export const getSensorLogs = (limit = 30) => api.get(`/sensors/logs?limit=${limit}`);

export const getSessions = (params) => api.get('/sessions', { params });
export const recordEntry = (data) => api.post('/sessions/entry', data);
export const recordExit = (data) => api.post('/sessions/exit', data);

export const getSimulatorStatus = () => api.get('/simulator/status');
export const startTrafficSimulation = (intervalMs) => api.post('/simulator/start', { intervalMs });
export const stopTrafficSimulation = () => api.post('/simulator/stop');

export default api;
