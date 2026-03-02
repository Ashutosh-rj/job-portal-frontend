// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

/**
 * ADMIN DASHBOARD - Overview stats for the admin.
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboard();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={styles.center}>Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👤', color: '#e3f2fd', border: '#1565c0' },
    { label: 'Total Jobs', value: stats?.totalJobs ?? 0, icon: '💼', color: '#e8f5e9', border: '#2e7d32' },
    { label: 'Active Jobs', value: stats?.activeJobs ?? 0, icon: '✅', color: '#fff3e0', border: '#e65100' },
    { label: 'Applications', value: stats?.totalApplications ?? 0, icon: '📄', color: '#f3e5f5', border: '#6a1b9a' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      <p style={styles.subtitle}>Welcome back! Here's an overview of your portal.</p>

      {/* Stats Cards */}
      <div style={styles.grid}>
        {statCards.map((card) => (
          <div key={card.label} style={{ ...styles.statCard, backgroundColor: card.color, borderLeft: `4px solid ${card.border}` }}>
            <div style={styles.statIcon}>{card.icon}</div>
            <div>
              <div style={styles.statValue}>{card.value}</div>
              <div style={styles.statLabel}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.actionsSection}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actions}>
          <Link to="/admin/post-job" style={styles.actionCard}>
            <span style={styles.actionIcon}>➕</span>
            <span>Post New Job</span>
          </Link>
          <Link to="/admin/users" style={styles.actionCard}>
            <span style={styles.actionIcon}>👥</span>
            <span>Manage Users</span>
          </Link>
          <Link to="/jobs" style={styles.actionCard}>
            <span style={styles.actionIcon}>💼</span>
            <span>View All Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' },
  title: { fontSize: '28px', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', marginBottom: '32px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statIcon: { fontSize: '32px' },
  statValue: { fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e' },
  statLabel: { color: '#666', fontSize: '14px' },
  actionsSection: { marginTop: '8px' },
  sectionTitle: { fontSize: '20px', color: '#1a1a2e', marginBottom: '16px' },
  actions: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  actionCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    padding: '24px 32px', backgroundColor: 'white', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textDecoration: 'none',
    color: '#1a1a2e', cursor: 'pointer', border: '1px solid #eee',
    transition: 'box-shadow 0.2s',
  },
  actionIcon: { fontSize: '28px' },
  center: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default AdminDashboard;
