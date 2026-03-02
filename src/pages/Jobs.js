// src/pages/Jobs.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';

/**
 * JOBS PAGE - Lists all available jobs with search functionality.
 * Public page - anyone can view jobs without logging in.
 */
const Jobs = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await jobAPI.getAllJobs();
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search - waits 400ms after user stops typing
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(async () => {
      if (term.trim() === '') { fetchJobs(); return; }
      try {
        const response = await jobAPI.searchJobs(term);
        setJobs(response.data);
      } catch (err) {
        setError('Search failed');
      }
    }, 400);
    setSearchTimeout(timeout);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this job posting?')) return;
    try {
      await jobAPI.deleteJob(id);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (err) {
      alert('Failed to deactivate job');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{isAdmin ? 'Manage Jobs' : 'Find Your Next Job'}</h1>
          <p style={styles.subtitle}>
            {loading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => navigate('/admin/post-job')} style={styles.postBtn}>
            + Post New Job
          </button>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title, company, or location..."
        value={searchTerm}
        onChange={handleSearch}
        style={styles.searchInput}
      />

      {/* Filter chips */}
      <div style={styles.filterTags}>
        {['All', 'Full-time', 'Remote', 'Part-time', 'Internship', 'Contract'].map(tag => (
          <span key={tag} style={{
            ...styles.filterTag,
            backgroundColor: (tag === 'All' && !searchTerm) || searchTerm === tag ? '#4f46e5' : '#f3f4f6',
            color: (tag === 'All' && !searchTerm) || searchTerm === tag ? 'white' : '#555',
          }}
          onClick={() => {
            if (tag === 'All') { setSearchTerm(''); fetchJobs(); }
            else { setSearchTerm(tag); jobAPI.searchJobs(tag).then(r => setJobs(r.data)); }
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Content */}
      {loading ? <Spinner message="Loading jobs..." /> : error ? (
        <div style={styles.errorBox}>{error}</div>
      ) : jobs.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔎</div>
          <h3>No jobs found</h3>
          <p style={{ color: '#999', marginTop: '8px' }}>Try a different search or check back later</p>
          {searchTerm && <button onClick={() => { setSearchTerm(''); fetchJobs(); }} style={styles.clearBtn}>Clear Search</button>}
        </div>
      ) : (
        <div style={styles.grid}>
          {jobs.map(job => (
            <div key={job.id}>
              <JobCard job={job} onDelete={isAdmin ? handleDelete : null} />
              {isAdmin && (
                <button
                  onClick={() => navigate(`/admin/jobs/${job.id}/applications`)}
                  style={styles.viewApplicantsBtn}
                >
                  View {job.applicationCount} Applicant{job.applicationCount !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '32px', color: '#1a1a2e', margin: '0 0 6px' },
  subtitle: { color: '#666', fontSize: '15px' },
  postBtn: { padding: '12px 22px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  searchInput: { width: '100%', padding: '14px 20px', fontSize: '15px', border: '2px solid #e0e0e0', borderRadius: '10px', boxSizing: 'border-box', outline: 'none', marginBottom: '16px', display: 'block' },
  filterTags: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' },
  filterTag: { padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', userSelect: 'none' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '24px' },
  viewApplicantsBtn: { width: '100%', marginTop: '8px', padding: '8px', backgroundColor: '#f3f4f6', color: '#555', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  errorBox: { backgroundColor: '#fde8e8', color: '#c0392b', padding: '20px', borderRadius: '10px', textAlign: 'center' },
  empty: { textAlign: 'center', padding: '80px 20px', color: '#666' },
  clearBtn: { marginTop: '16px', padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};

export default Jobs;
