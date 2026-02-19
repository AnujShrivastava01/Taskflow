// =============================================================
// PROTECTED ROUTE - components/ProtectedRoute.jsx
// =============================================================
// A wrapper component that restricts access to authenticated users.
//
// HOW IT WORKS:
// 1. Checks if auth state is still loading (show spinner)
// 2. If not authenticated, redirects to /login
// 3. If authenticated, renders the child components
//
// USAGE IN ROUTER:
// <Route path="/dashboard" element={
//   <ProtectedRoute>
//     <Dashboard />
//   </ProtectedRoute>
// } />
//
// Navigate's `replace` prop replaces the current history entry
// so the user can't "go back" to the protected page after logout.
// The `state` prop remembers where the user tried to go,
// so we can redirect them back after login.
// =============================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 rounded-full animate-spin"
                        style={{
                            borderColor: 'var(--primary-700)',
                            borderTopColor: 'var(--primary-400)'
                        }}
                    />
                    <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
