// src/components/Spinner.js
import React from 'react';

/**
 * SPINNER - A simple loading animation shown while data is being fetched.
 * Usage: {loading && <Spinner />}
 */
const Spinner = ({ message = 'Loading...' }) => (
  <div style={styles.container}>
    <div style={styles.spinner} />
    <p style={styles.message}>{message}</p>
  </div>
);

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px' },
  spinner: {
    width: '48px', height: '48px',
    border: '5px solid #e0e0e0',
    borderTop: '5px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  message: { marginTop: '16px', color: '#666', fontSize: '15px' },
};

// Inject keyframes into document head (simple approach without CSS modules)
const styleTag = document.createElement('style');
styleTag.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

export default Spinner;
