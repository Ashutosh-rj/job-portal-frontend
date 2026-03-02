// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '', fullName: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await register({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/jobs'); // Redirect after successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🚀</h2>
        <p style={styles.subtitle}>Join Job Portal and find your dream job</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'John Doe' },
            { label: 'Username', name: 'username', type: 'text', placeholder: 'johndoe' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'john@example.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: 'Min 6 characters' },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: 'Repeat password' },
          ].map((field) => (
            <div key={field.name} style={styles.field}>
              <label style={styles.label}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                style={styles.input}
                required
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '20px',
  },
  card: {
    backgroundColor: 'white', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '440px',
  },
  title: { margin: '0 0 8px', fontSize: '26px', color: '#1a1a2e' },
  subtitle: { margin: '0 0 24px', color: '#666' },
  error: {
    backgroundColor: '#fde8e8', color: '#c0392b', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' },
  input: {
    width: '100%', padding: '10px 14px', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '8px',
  },
  footer: { textAlign: 'center', marginTop: '20px', color: '#666' },
  link: { color: '#4f46e5', textDecoration: 'none', fontWeight: '500' },
};

export default Register;
