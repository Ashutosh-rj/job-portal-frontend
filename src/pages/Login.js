// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * LOGIN PAGE - Form to log in with username and password.
 * On success, saves the JWT token and redirects to jobs page.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();

  // Form state - tracks what user types
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');    // Error message to display
  const [loading, setLoading] = useState(false); // Disable button while submitting

  // Update form state as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    setError('');
    setLoading(true);

    try {
      const userData = await login(formData.username, formData.password);
      // Redirect based on role
      if (userData.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      // Show error from backend (e.g., "Invalid credentials")
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to your Job Portal account</p>

        {/* Error message */}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px',
  },
  title: { margin: '0 0 8px', fontSize: '26px', color: '#1a1a2e' },
  subtitle: { margin: '0 0 24px', color: '#666' },
  error: {
    backgroundColor: '#fde8e8', color: '#c0392b', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  field: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' },
  input: {
    width: '100%', padding: '10px 14px', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer',
    marginTop: '8px',
  },
  footer: { textAlign: 'center', marginTop: '20px', color: '#666' },
  link: { color: '#4f46e5', textDecoration: 'none', fontWeight: '500' },
};

export default Login;
