// src/pages/admin/AdminApplications.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';

const statusColors = {
  PENDING:  { bg: '#fff3e0', color: '#e65100' },
  REVIEWED: { bg: '#e3f2fd', color: '#1565c0' },
  ACCEPTED: { bg: '#e8f5e9', color: '#2e7d32' },
  REJECTED: { bg: '#fde8e8', color: '#c0392b' },
};

/**
 * ADMIN APPLICATIONS PAGE
 * Admin can view all applicants for a specific job.
 * Accessed via: /admin/jobs/:id/applications
 */
const AdminApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [appsRes, jobRes] = await Promise.all([
          jobAPI.getJobApplications(id),
          jobAPI.getJobById(id),
        ]);
        setApplications(appsRes.data);
        setJobTitle(jobRes.data.title);
      } catch (err) {
        alert('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div style={styles.center}>Loading applications...</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/jobs')} style={styles.back}>← Back to Jobs</button>
      <h1 style={styles.title}>Applications for: <span style={styles.jobName}>{jobTitle}</span></h1>
      <p style={styles.subtitle}>{applications.length} total applications</p>

      {applications.length === 0 ? (
        <div style={styles.empty}>No one has applied to this job yet.</div>
      ) : (
        <div style={styles.list}>
          {applications.map((app) => {
            const s = statusColors[app.status] || statusColors.PENDING;
            return (
              <div key={app.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.name}>{app.applicantName}</h3>
                    <span style={styles.username}>@{app.applicantUsername}</span>
                  </div>
                  <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.color }}>
                    {app.status}
                  </span>
                </div>
                {app.coverLetter && (
                  <div style={styles.coverLetter}>
                    <strong>Cover Letter:</strong>
                    <p style={styles.coverText}>{app.coverLetter}</p>
                  </div>
                )}
                <div style={styles.appliedDate}>
                  Applied on: {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
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
  back: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '15px', marginBottom: '20px', padding: 0 },
  title: { fontSize: '24px', color: '#1a1a2e', marginBottom: '6px' },
  jobName: { color: '#4f46e5' },
  subtitle: { color: '#666', marginBottom: '28px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' },
  name: { margin: '0 0 4px', fontSize: '17px', color: '#1a1a2e' },
  username: { color: '#666', fontSize: '13px' },
  badge: { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  coverLetter: { backgroundColor: '#f8f9fa', padding: '14px', borderRadius: '8px', marginBottom: '12px' },
  coverText: { color: '#555', fontSize: '14px', marginTop: '6px', lineHeight: '1.6' },
  appliedDate: { fontSize: '12px', color: '#999' },
  center: { textAlign: 'center', padding: '60px', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#666', backgroundColor: 'white', borderRadius: '12px' },
};

export default AdminApplications;
