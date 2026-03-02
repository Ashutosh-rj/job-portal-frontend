// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PROTECTED ROUTE - Guards pages that require login or specific roles.
 *
 * Usage:
 * <ProtectedRoute>           → requires login
 *   <MyPage />
 * </ProtectedRoute>
 *
 * <ProtectedRoute adminOnly> → requires ROLE_ADMIN
 *   <AdminPage />
 * </ProtectedRoute>
 *
 * If not logged in → redirect to /login
 * If logged in but not admin (for adminOnly) → redirect to /jobs
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Not logged in at all? Go to login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only page but user is not admin? Go to jobs page.
  if (adminOnly && !isAdmin) {
    return <Navigate to="/jobs" replace />;
  }

  // All checks passed - show the page!
  return children;
};

export default ProtectedRoute;
