// src/services/api.js
// =============================================
// API SERVICE - Centralized place for all HTTP calls to our backend
// =============================================

import axios from 'axios';

// Base URL of our Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR - Runs BEFORE every API call.
 * Automatically adds the JWT token to every request header.
 *
 * This way we don't have to manually add the token in every component!
 */
api.interceptors.request.use(
  (config) => {
    // Get the token stored in localStorage (saved during login)
    const token = localStorage.getItem('token');
    if (token) {
      // Add it as an Authorization header: "Bearer eyJhbGci..."
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR - Runs AFTER every API response.
 * If we get a 401 (Unauthorized), the token expired → log out.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =============================================
// AUTH API CALLS
// =============================================
export const authAPI = {
  // POST /api/auth/register
  register: (data) => api.post('/auth/register', data),
  // POST /api/auth/login
  login: (data) => api.post('/auth/login', data),
};

// =============================================
// JOB API CALLS
// =============================================
export const jobAPI = {
  // GET /api/jobs (public)
  getAllJobs: () => api.get('/jobs'),
  // GET /api/jobs/:id (public)
  getJobById: (id) => api.get(`/jobs/${id}`),
  // GET /api/jobs/search?keyword=... (public)
  searchJobs: (keyword) => api.get(`/jobs/search?keyword=${keyword}`),
  // POST /api/jobs (admin only)
  postJob: (data) => api.post('/jobs', data),
  // POST /api/jobs/:id/apply (user)
  applyToJob: (id, data) => api.post(`/jobs/${id}/apply`, data),
  // GET /api/jobs/my-applications (user)
  getMyApplications: () => api.get('/jobs/my-applications'),
  // DELETE /api/jobs/:id (admin)
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  // GET /api/jobs/:id/applications (admin)
  getJobApplications: (id) => api.get(`/jobs/${id}/applications`),
};

// =============================================
// USER API CALLS
// =============================================
export const userAPI = {
  // GET /api/user/profile
  getProfile: () => api.get('/user/profile'),
};

// =============================================
// ADMIN API CALLS
// =============================================
export const adminAPI = {
  // GET /api/admin/dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  // GET /api/admin/users
  getAllUsers: () => api.get('/admin/users'),
  // DELETE /api/admin/users/:id
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // PATCH /api/admin/users/:id/make-admin
  makeAdmin: (id) => api.patch(`/admin/users/${id}/make-admin`),
};

export default api;
