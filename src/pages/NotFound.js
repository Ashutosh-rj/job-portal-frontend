// src/pages/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.code}>404</div>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/jobs')} style={styles.btn}>
          ← Back to Jobs
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  box: { textAlign: 'center', padding: '60px 40px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  code: { fontSize: '96px', fontWeight: '900', color: '#4f46e5', lineHeight: 1 },
  title: { fontSize: '28px', color: '#1a1a2e', margin: '16px 0 8px' },
  message: { color: '#666', marginBottom: '32px' },
  btn: { padding: '12px 28px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
};

export default NotFound;
