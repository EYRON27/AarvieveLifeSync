import api from './api';

// ============ Tasks ============
export const taskApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/tasks', { params }),
  getById: (id: string) => api.get(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats'),
  create: (data: Record<string, unknown>) => api.post('/tasks', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// ============ Expenses ============
export const expenseApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/expenses', { params }),
  getSummary: () => api.get('/expenses/summary'),
  create: (data: Record<string, unknown>) => api.post('/expenses', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};

// ============ Passwords ============
export const passwordApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/passwords', { params }),
  getDecrypted: (id: string) => api.get(`/passwords/${id}/decrypt`),
  create: (data: Record<string, unknown>) => api.post('/passwords', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/passwords/${id}`, data),
  delete: (id: string) => api.delete(`/passwords/${id}`),
};

// ============ Time Entries ============
export const timeApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/time', { params }),
  getRunning: () => api.get('/time/running'),
  getSummary: () => api.get('/time/summary'),
  start: (data: Record<string, unknown>) => api.post('/time/start', data),
  stop: (id: string) => api.put(`/time/${id}/stop`),
  createManual: (data: Record<string, unknown>) => api.post('/time/manual', data),
  delete: (id: string) => api.delete(`/time/${id}`),
};

// ============ Food Entries ============
export const foodApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/food', { params }),
  getSummary: (date?: string) => api.get('/food/summary', { params: { date } }),
  create: (data: Record<string, unknown>) => api.post('/food', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/food/${id}`, data),
  delete: (id: string) => api.delete(`/food/${id}`),
};

// ============ Dashboard ============
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getActivity: () => api.get('/dashboard/activity'),
};

// ============ Auth ============
export const authApi = {
  syncUser: (data: Record<string, unknown>) => api.post('/auth/sync', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: Record<string, unknown>) => api.put('/auth/profile', data),
};

// ============ Reports ============
export const reportApi = {
  exportExpenses: () => api.get('/reports/expenses', { responseType: 'blob' }),
  exportTime: () => api.get('/reports/time', { responseType: 'blob' }),
  exportFood: () => api.get('/reports/food', { responseType: 'blob' }),
};
