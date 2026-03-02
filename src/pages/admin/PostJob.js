// src/pages/admin/PostJob.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';

/**
 * POST JOB PAGE - Admin form to create a new job posting.
 */
const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', description: '',
    salary: '', jobType: 'Full-time', experience: 'Fresher',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await jobAPI.postJob(formData);
      alert('✅ Job posted successfully!');
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Post a New Job</h1>
      <p style={styles.subtitle}>Fill in the details to publish a job opening</p>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Job Title *</label>
              <input name="title" value={formData.title} onChange={handleChange}
                placeholder="e.g. Senior Java Developer" style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Company *</label>
              <input name="company" value={formData.company} onChange={handleChange}
                placeholder="e.g. TechCorp Inc." style={styles.input} required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Location *</label>
              <input name="location" value={formData.location} onChange={handleChange}
                placeholder="e.g. Bangalore, India" style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Salary</label>
              <input name="salary" value={formData.salary} onChange={handleChange}
                placeholder="e.g. ₹8-12 LPA" style={styles.input} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} style={styles.input}>
                {['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Experience Required</label>
              <select name="experience" value={formData.experience} onChange={handleChange} style={styles.input}>
                {['Fresher', '0-1 years', '1-2 years', '2-3 years', '3-5 years', '5+ years'].map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Job Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder="Describe the role, responsibilities, required skills..."
              rows={8} style={{ ...styles.input, resize: 'vertical' }} required />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={() => navigate('/jobs')} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Posting...' : '🚀 Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 20px' },
  title: { fontSize: '28px', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', marginBottom: '24px' },
  error: { backgroundColor: '#fde8e8', color: '#c0392b', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: { padding: '12px 24px', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  submitBtn: { padding: '12px 28px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
};

export default PostJob;
