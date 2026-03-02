// src/App.js
// =============================================
// MAIN APP - Sets up routing and global context
// =============================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Public
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import NotFound from './pages/NotFound';

// Pages - User
import MyApplications from './pages/MyApplications';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import PostJob from './pages/admin/PostJob';
import ManageUsers from './pages/admin/ManageUsers';
import AdminApplications from './pages/admin/AdminApplications';

/**
 * APP COMPONENT - The root of our React application.
 *
 * Structure:
 * - AuthProvider: Wraps everything (provides auth state globally)
 * - Router: Enables client-side routing (URL changes without page reload)
 * - Routes: Defines which component to show for each URL
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar appears on every page */}
        <Navbar />

        {/* Main content area */}
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
          <Routes>
            {/* ===== PUBLIC ROUTES ===== */}
            {/* Home landing page */}
            <Route path="/" element={<Home />} />

            {/* Anyone can view jobs */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Auth pages (redirect to /jobs if already logged in is handled by login page logic) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ===== USER ROUTES (must be logged in) ===== */}
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            {/* ===== ADMIN ROUTES (must be ROLE_ADMIN) ===== */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/post-job"
              element={
                <ProtectedRoute adminOnly>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs/:id/applications"
              element={
                <ProtectedRoute adminOnly>
                  <AdminApplications />
                </ProtectedRoute>
              }
            />

            {/* Catch-all: show 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
