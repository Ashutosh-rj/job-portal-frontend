// src/components/JobCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * JOB CARD - Reusable card to display a single job summary.
 * Used in Jobs.js listing page.
 *
 * Props:
 * - job: the job object
 * - onDelete: callback when admin clicks Deactivate
 */
const JobCard = ({ job, onDelete }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const jobTypeColor = {
    'Full-time':  { bg: '#e8f5e9', color: '#2e7d32' },
    'Part-time':  { bg: '#fff3e0', color: '#e65100' },
    'Remote':     { bg: '#e3f2fd', color: '#1565c0' },
    'Contract':   { bg: '#f3e5f5', color: '#6a1b9a' },
    'Internship': { bg: '#fce4ec', color: '#880e4f' },
  };
  const typeStyle = jobTypeColor[job.jobType] || { bg: '#f3f4f6', color: '#555' };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.companyIcon}>
          {job.company.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 style={styles.title}>{job.title}</h3>
          <span style={styles.company}>{job.company}</span>
        </div>
      </div>

      {/* Tags */}
      <div style={styles.tags}>
        <span style={styles.tag}>📍 {job.location}</span>
        {job.jobType && (
          <span style={{ ...styles.tag, backgroundColor: typeStyle.bg, color: typeStyle.color }}>
            {job.jobType}
          </span>
        )}
        {job.experience && <span style={styles.tag}>💡 {job.experience}</span>}
        {job.salary && (
          <span style={{ ...styles.tag, backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
            💰 {job.salary}
          </span>
        )}
      </div>

      {/* Description Preview */}
      <p style={styles.description}>
        {job.description.length > 120
          ? job.description.substring(0, 120) + '...'
          : job.description}
      </p>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.meta}>
          📅 {new Date(job.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span style={styles.meta}>👥 {job.applicationCount} applicants</span>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button onClick={() => navigate(`/jobs/${job.id}`)} style={styles.viewBtn}>
          View Details
        </button>
        {isAuthenticated && !isAdmin && (
          <button onClick={() => navigate(`/jobs/${job.id}`)} style={styles.applyBtn}>
            Apply Now →
          </button>
        )}
        {isAdmin && onDelete && (
          <button onClick={() => onDelete(job.id)} style={styles.deleteBtn}>
            Deactivate
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white', borderRadius: '14px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0',
    display: 'flex', flexDirection: 'column', gap: '14px',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  header: { display: 'flex', gap: '14px', alignItems: 'flex-start' },
  companyIcon: {
    width: '44px', height: '44px', borderRadius: '10px',
    backgroundColor: '#4f46e5', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '20px', flexShrink: 0,
  },
  title: { fontSize: '17px', fontWeight: '700', color: '#1a1a2e', marginBottom: '2px' },
  company: { color: '#4f46e5', fontSize: '13px', fontWeight: '600' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: { backgroundColor: '#f3f4f6', color: '#555', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  description: { color: '#666', fontSize: '13px', lineHeight: '1.6', flexGrow: 1 },
  footer: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' },
  meta: {},
  actions: { display: 'flex', gap: '10px', marginTop: '4px' },
  viewBtn: {
    flex: 1, padding: '9px', border: '1.5px solid #4f46e5', color: '#4f46e5',
    backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
  },
  applyBtn: {
    flex: 1, padding: '9px', backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
  },
  deleteBtn: {
    flex: 1, padding: '9px', backgroundColor: '#fde8e8', color: '#c0392b',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
  },
};

export default JobCard;
