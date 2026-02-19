// =============================================================
// API SERVICE - services/api.js
// =============================================================
// Centralized Axios instance for all API calls.
//
// WHY A CENTRALIZED API INSTANCE?
// - Single place to configure base URL, headers, interceptors
// - Automatic token injection for authenticated requests
// - Centralized error handling (e.g., auto-logout on 401)
// - Easy to switch between environments (dev/staging/prod)
//
// HOW IT WORKS:
// 1. Creates an Axios instance with base config
// 2. REQUEST INTERCEPTOR: Before every request, checks localStorage
//    for a JWT token and adds it to the Authorization header
// 3. RESPONSE INTERCEPTOR: After every response, checks for 401
//    errors. If token expired/invalid, clears storage and redirects
//    to login page automatically.
//
// USAGE IN COMPONENTS:
// import api from '../services/api';
// const { data } = await api.get('/auth/me');
// const { data } = await api.post('/tasks', { title: 'New Task' });
// =============================================================

import axios from 'axios';

// Create Axios instance with default configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Uses env var in prod, proxy in dev

    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// =============================================================
// REQUEST INTERCEPTOR
// =============================================================
// Runs BEFORE every request is sent.
// Reads the JWT token from localStorage and adds it to headers.
//
// WHY localStorage?
// - Persists across browser sessions (unlike sessionStorage)
// - Simple to implement
// - For production, consider httpOnly cookies for better security
// =============================================================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =============================================================
// RESPONSE INTERCEPTOR
// =============================================================
// Runs AFTER every response is received.
// If we get a 401 (Unauthorized), it means:
// - Token is expired
// - Token is invalid
// - Token was tampered with
//
// In any of these cases, we:
// 1. Clear the stored token and user data
// 2. Redirect to the login page
// This provides automatic session expiry handling.
// =============================================================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if not already on login/register page
            if (
                !window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/register')
            ) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
