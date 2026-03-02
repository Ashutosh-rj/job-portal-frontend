// src/pages/JobDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * JOB DETAIL PAGE - Shows full job info and apply button.
 * useParams() extracts the :id from the URL (/jobs/5 → id = "5").
 */
const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobAPI.getJobById(id);
        setJob(response.data);
      } catch (err) {
        setMessage('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      const response = await jobAPI.applyToJob(id, { coverLetter });
      setMessage('✅ ' + response.data);
      setApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || err.response?.data || 'Application failed'));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (!job) return <div style={styles.center}>Job not found</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/jobs')} style={styles.back}>← Back to Jobs</button>

      <div style={styles.card}>
        {/* Job Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{job.title}</h1>
            <h2 style={styles.company}>{job.company}</h2>
          </div>
          {!isAdmin && !applied && (
            <button
              onClick={() => isAuthenticated ? setShowApplyForm(true) : navigate('/login')}
              style={styles.applyBtn}
            >
              {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
            </button>
          )}
          {applied && <span style={styles.appliedBadge}>✅ Applied!</span>}
        </div>

        {/* Status Message */}
        {message && (
          <div style={{
            ...styles.messageBanner,
            backgroundColor: message.startsWith('✅') ? '#e8f5e9' : '#fde8e8',
            color: message.startsWith('✅') ? '#2e7d32' : '#c0392b',
          }}>
            {message}
          </div>
        )}

        {/* Job Info */}
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}><strong>📍 Location</strong><span>{job.location}</span></div>
          {job.jobType && <div style={styles.infoItem}><strong>⏰ Type</strong><span>{job.jobType}</span></div>}
          {job.experience && <div style={styles.infoItem}><strong>💡 Experience</strong><span>{job.experience}</span></div>}
          {job.salary && <div style={styles.infoItem}><strong>💰 Salary</strong><span>{job.salary}</span></div>}
          <div style={styles.infoItem}><strong>👥 Applicants</strong><span>{job.applicationCount}</span></div>
          <div style={styles.infoItem}><strong>📅 Posted</strong><span>{new Date(job.postedAt).toLocaleDateString()}</span></div>
        </div>

        {/* Description */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Job Description</h3>
          <p style={styles.description}>{job.description}</p>
        </div>

        {/* Apply Form */}
        {showApplyForm && !applied && (
          <div style={styles.applyForm}>
            <h3 style={styles.sectionTitle}>Apply for this Position</h3>
            <form onSubmit={handleApply}>
              <label style={styles.label}>Cover Letter (Optional)</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit..."
                rows={5}
                style={styles.textarea}
              />
              <div style={styles.formActions}>
                <button type="button" onClick={() => setShowApplyForm(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={applying} style={styles.submitBtn}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 20px' },
  back: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '15px', marginBottom: '20px', padding: 0 },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { margin: '0 0 6px', fontSize: '28px', color: '#1a1a2e' },
  company: { margin: 0, color: '#4f46e5', fontSize: '18px', fontWeight: '500' },
  applyBtn: { padding: '12px 28px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap' },
  appliedBadge: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: '500' },
  messageBanner: { padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#333' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '18px', color: '#1a1a2e', marginBottom: '12px' },
  description: { color: '#555', lineHeight: '1.8', whiteSpace: 'pre-wrap' },
  applyForm: { borderTop: '1px solid #eee', paddingTop: '24px', marginTop: '24px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' },
  textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' },
  formActions: { display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer' },
  submitBtn: { padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  center: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default JobDetail;
