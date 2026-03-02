// src/pages/MyApplications.js
import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';

const statusColors = {
  PENDING:  { bg: '#fff3e0', color: '#e65100', label: '⏳ Pending' },
  REVIEWED: { bg: '#e3f2fd', color: '#1565c0', label: '👁️ Reviewed' },
  ACCEPTED: { bg: '#e8f5e9', color: '#2e7d32', label: '✅ Accepted' },
  REJECTED: { bg: '#fde8e8', color: '#c0392b', label: '❌ Rejected' },
};

/**
 * MY APPLICATIONS - Shows all jobs the logged-in user has applied to.
 */
const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await jobAPI.getMyApplications();
        setApplications(response.data);
      } catch (err) {
        setError('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div style={styles.center}>Loading your applications...</div>;
  if (error) return <div style={styles.center}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Applications</h1>
      <p style={styles.subtitle}>Track the status of your job applications</p>

      {applications.length === 0 ? (
        <div style={styles.empty}>
          <h3>No applications yet!</h3>
          <p>Browse jobs and start applying to track them here.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {applications.map((app) => {
            const statusInfo = statusColors[app.status] || statusColors.PENDING;
            return (
              <div key={app.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.jobTitle}>{app.jobTitle}</h3>
                    <span style={styles.company}>{app.company}</span>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusInfo.bg,
                    color: statusInfo.color,
                  }}>
                    {statusInfo.label}
                  </span>
                </div>

                {app.coverLetter && (
                  <div style={styles.coverLetter}>
                    <strong>Your Cover Letter:</strong>
                    <p>{app.coverLetter}</p>
                  </div>
                )}

                <div style={styles.footer}>
                  <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 20px' },
  title: { fontSize: '28px', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', marginBottom: '32px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  jobTitle: { margin: '0 0 4px', fontSize: '18px', color: '#1a1a2e' },
  company: { color: '#4f46e5', fontSize: '14px', fontWeight: '500' },
  statusBadge: { padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap' },
  coverLetter: { backgroundColor: '#f8f9fa', padding: '14px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px', color: '#555' },
  footer: { fontSize: '12px', color: '#999' },
  center: { textAlign: 'center', padding: '60px', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default MyApplications;
