import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (credentials) => api.post('/auth/register', credentials),
};

export const expenseAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getByType: (type, params) => api.get('/expenses/by_type', { params: { expenseType: type, ...params } }),
  create: (expense) => api.post('/expenses', expense),
  update: (id, expense) => api.put(`/expenses/${id}`, expense),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const analyticsAPI = {
  getBalance: () => api.get('/analytics/balance'),
  getDailyExpenses: (start, end, params) => api.get('/analytics/expenses/daily', { params: { start, end, ...params } }),
  getTopExpenses: (limit = 5, params) => api.get('/analytics/expenses/top', { params: { limit, ...params } }),
  getExpensesByCategory: (start, end, params) => api.get('/analytics/expenses/by_category', { params: { start, end, ...params } }),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const reminderAPI = {
  getAll: (params) => api.get('/reminders', { params }),
  getByDate: (date, params) => api.get('/reminders/by_date', { params: { date, ...params } }),
  create: (reminder) => api.post('/reminders', reminder),
  delete: (id) => api.delete(`/reminders/${id}`),
  deactivate: (id) => api.put(`/reminders/deactivate/${id}`),
};

export const csvAPI = {
  exportExpenses: () => api.get('/csv/export/expenses', { responseType: 'blob' }),
  importExpenses: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/csv/import/expenses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};