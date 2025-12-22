import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "customer";
}

/**
 * Protects routes from unauthenticated users
 * If requiredRole is specified, also checks for that specific role
 */
export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { user, loading, isAuthenticated } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    // Not logged in -> redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If a specific role is required, check it
    if (requiredRole && user?.role !== requiredRole) {
        // Customer trying to access admin dashboard -> redirect to home
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

/**
 * Shortcut component for admin-only routes
 */
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

/**
 * Shortcut component for customer-only routes
 */
export const CustomerRoute = ({ children }: { children: React.ReactNode }) => {
    return <ProtectedRoute requiredRole="customer">{children}</ProtectedRoute>;
};
