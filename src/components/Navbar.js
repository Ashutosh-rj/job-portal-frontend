// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * NAVBAR - Top navigation bar shown on all pages.
 * Shows different links based on login status and role.
 */
const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>💼 Job Portal</Link>
      </div>

      <div style={styles.links}>
        {/* Public links - always visible */}
        <Link to="/jobs" style={styles.link}>Find Jobs</Link>

        {isAuthenticated ? (
          <>
            {/* User links */}
            {!isAdmin && (
              <Link to="/my-applications" style={styles.link}>My Applications</Link>
            )}

            {/* Admin links */}
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/admin/post-job" style={styles.link}>Post Job</Link>
                <Link to="/admin/users" style={styles.link}>Users</Link>
              </>
            )}

            {/* User info + logout */}
            <span style={styles.username}>
              👤 {user.fullName} {isAdmin && <span style={styles.adminBadge}>ADMIN</span>}
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 32px', backgroundColor: '#1a1a2e', color: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  brand: { fontSize: '22px', fontWeight: 'bold' },
  brandLink: { color: 'white', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '15px' },
  username: { color: '#90caf9', fontSize: '14px' },
  adminBadge: {
    backgroundColor: '#f44336', color: 'white', padding: '2px 6px',
    borderRadius: '4px', fontSize: '11px', marginLeft: '6px',
  },
  logoutBtn: {
    background: 'transparent', border: '1px solid #ccc', color: '#ccc',
    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
  },
  registerBtn: {
    backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px',
    borderRadius: '6px', textDecoration: 'none', fontSize: '14px',
  },
};

export default Navbar;
