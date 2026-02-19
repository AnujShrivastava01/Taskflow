// =============================================================
// AUTH CONTEXT - context/AuthContext.jsx
// =============================================================
// Global authentication state management using React Context API.
//
// WHAT IS CONTEXT?
// React Context provides a way to share data (like auth state)
// across the component tree WITHOUT prop drilling.
// Instead of passing user/token through every component:
//   App → Layout → Sidebar → UserAvatar (passing props down)
// We can access it directly from anywhere:
//   const { user } = useAuth(); // Works in ANY component
//
// STATE MANAGED:
// - user: The current user object (null if logged out)
// - token: JWT token string (null if logged out)
// - loading: True during initial auth check
//
// FUNCTIONS PROVIDED:
// - login(email, password): Authenticate and store credentials
// - register(name, email, password): Create account and auto-login
// - logout(): Clear credentials and redirect
// - updateUser(data): Update the stored user object
//
// PERSISTENCE:
// - User and token are stored in localStorage
// - On page refresh, we check localStorage and verify the token
// - If token is still valid, user stays logged in
//
// WHY NOT REDUX?
// For this project scope, Context is simpler and sufficient.
// Redux would add unnecessary complexity for a single global state.
// For larger apps, consider Redux Toolkit or Zustand.
// =============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Create the context
const AuthContext = createContext(null);

// =============================================================
// AUTH PROVIDER COMPONENT
// =============================================================
// Wraps the entire app and provides auth state to all children.
// =============================================================
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // =============================================================
    // CHECK AUTH ON MOUNT
    // =============================================================
    // When the app loads (or refreshes), check if there's a stored
    // token. If yes, verify it by fetching the user profile.
    // If the token is expired/invalid, the API interceptor will
    // clear storage and redirect to login.
    // =============================================================
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data.data);
                    setToken(storedToken);
                } catch (error) {
                    // Token is invalid/expired
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setToken(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // =============================================================
    // LOGIN FUNCTION
    // =============================================================
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            // Store in localStorage for persistence
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data));

            // Update state
            setUser(data.data);
            setToken(data.token);

            toast.success('Welcome back! 👋');
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
            return { success: false, message };
        }
    };

    // =============================================================
    // REGISTER FUNCTION
    // =============================================================
    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', {
                name,
                email,
                password,
            });

            // Auto-login after registration
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data));

            setUser(data.data);
            setToken(data.token);

            toast.success('Account created successfully! 🎉');
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'Registration failed. Please try again.';
            toast.error(message);
            return { success: false, message };
        }
    };

    // =============================================================
    // LOGOUT FUNCTION
    // =============================================================
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        toast.success('Logged out successfully');
    };

    // =============================================================
    // UPDATE USER (after profile edit)
    // =============================================================
    const updateUser = (updatedData) => {
        setUser(updatedData);
        localStorage.setItem('user', JSON.stringify(updatedData));
    };

    // The value prop contains everything components can access
    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =============================================================
// CUSTOM HOOK - useAuth()
// =============================================================
// Convenience hook to access auth context.
// Usage: const { user, login, logout } = useAuth();
//
// Throws an error if used outside AuthProvider
// (helps catch bugs early during development)
// =============================================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
