// =============================================================
// APP ROOT - App.jsx
// =============================================================
// The root component that sets up:
// 1. React Router for client-side navigation
// 2. AuthProvider for global authentication state
// 3. Toast notifications (react-hot-toast)
// 4. Route definitions (public + protected)
//
// ROUTE STRUCTURE:
// /          → Landing page (public)
// /login     → Login page (public)
// /register  → Register page (public)
// /dashboard → Protected dashboard layout
//   /dashboard          → Dashboard Home
//   /dashboard/tasks    → Tasks CRUD
//   /dashboard/profile  → User Profile
//   /dashboard/settings → Account Settings
//
// HOW ROUTING WORKS:
// React Router renders components based on the current URL.
// The <BrowserRouter> listens for URL changes and renders
// the matching <Route> component.
//
// NESTED ROUTES:
// The /dashboard route uses <DashboardLayout> which renders
// <Outlet /> - this is where child routes are rendered.
// This means the sidebar stays constant while the main
// content area changes based on the sub-route.
//
// PROTECTED ROUTES:
// <ProtectedRoute> wraps dashboard routes.
// If the user is NOT authenticated, they're redirected to /login.
// If they ARE authenticated, the child component is rendered.
// =============================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/DashboardHome';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* ====================================================
            TOAST NOTIFICATIONS
            ====================================================
            react-hot-toast provides beautiful toast notifications.
            Configured with custom styles matching our dark theme.
            Usage anywhere in the app:
              import toast from 'react-hot-toast';
              toast.success('Task created!');
              toast.error('Something went wrong');
            ==================================================== */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a2e',
              color: '#f1f5f9',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#1a1a2e' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1a1a2e' },
            },
          }}
        />

        {/* ====================================================
            ROUTE DEFINITIONS
            ==================================================== */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested routes render inside DashboardLayout's <Outlet /> */}
            <Route index element={<DashboardHome />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
