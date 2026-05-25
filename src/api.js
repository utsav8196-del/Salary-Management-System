import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://YOUR_RENDER_URL.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employees API
export const getEmployees = (page, limit, search) => 
  api.get('/employees', { params: { page, limit, search } });

export const getEmployee = (id) => 
  api.get(`/employees/${id}`);

export const createEmployee = (employee) => 
  api.post('/employees', employee);

export const updateEmployee = (id, employee) => 
  api.put(`/employees/${id}`, employee);

export const deleteEmployee = (id) => 
  api.delete(`/employees/${id}`);

// Insights API
export const getCountryInsights = (country) => 
  api.get(`/insights/country/${encodeURIComponent(country)}`);

export const getJobTitleInsights = (country, jobTitle) => 
  api.get(`/insights/country/${encodeURIComponent(country)}/job-title/${encodeURIComponent(jobTitle)}`);

export const getCountryStats = () => 
  api.get('/insights/country-stats');

export const getGlobalInsights = () => 
  api.get('/insights/global');

// Metadata API
export const getCountries = () => 
  api.get('/countries');

export const getJobTitles = () => 
  api.get('/job-titles');