// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * HOME / LANDING PAGE - The first page visitors see.
 * Shows a hero banner with CTA buttons.
 */
const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div style={styles.page}>

      {/* ── Hero Section ─────────────────────────── */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Dream Job 🚀</h1>
        <p style={styles.heroSubtitle}>
          Thousands of job opportunities from top companies — all in one place.
          Register today and start your journey!
        </p>
        <div style={styles.heroBtns}>
          <button onClick={() => navigate('/jobs')} style={styles.primaryBtn}>
            Browse Jobs
          </button>
          {!isAuthenticated && (
            <button onClick={() => navigate('/register')} style={styles.outlineBtn}>
              Create Account
            </button>
          )}
          {isAuthenticated && isAdmin && (
            <button onClick={() => navigate('/admin/dashboard')} style={styles.outlineBtn}>
              Admin Dashboard
            </button>
          )}
        </div>
      </div>

      {/* ── Feature Cards ────────────────────────── */}
      <div style={styles.features}>
        {[
          { icon: '🔍', title: 'Search Jobs', desc: 'Browse hundreds of listings and filter by location, type, and experience.' },
          { icon: '📄', title: 'Easy Apply', desc: 'Apply with one click and write a cover letter to stand out.' },
          { icon: '📊', title: 'Track Status', desc: 'Monitor your applications — Pending, Reviewed, Accepted, or Rejected.' },
          { icon: '🔒', title: 'Secure & Private', desc: 'JWT authentication keeps your account and data safe.' },
        ].map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Stats Bar ────────────────────────────── */}
      <div style={styles.statsBar}>
        {[
          { value: '500+', label: 'Jobs Posted' },
          { value: '1,200+', label: 'Registered Users' },
          { value: '50+', label: 'Companies' },
          { value: '98%', label: 'Satisfaction Rate' },
        ].map((s) => (
          <div key={s.label} style={styles.statItem}>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── CTA Bottom ───────────────────────────── */}
      {!isAuthenticated && (
        <div style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaSubtitle}>Join thousands of job seekers finding their dream careers</p>
          <button onClick={() => navigate('/register')} style={styles.primaryBtn}>
            Register for Free
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px' },

  // Hero
  hero: {
    textAlign: 'center', padding: '80px 20px 60px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '0 0 24px 24px', marginBottom: '60px', color: 'white',
    marginLeft: '-20px', marginRight: '-20px',
  },
  heroTitle: { fontSize: '48px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' },
  heroSubtitle: { fontSize: '18px', opacity: 0.9, maxWidth: '560px', margin: '0 auto 36px', lineHeight: '1.6' },
  heroBtns: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    padding: '14px 32px', backgroundColor: 'white', color: '#4f46e5',
    border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
  },
  outlineBtn: {
    padding: '14px 32px', backgroundColor: 'transparent', color: 'white',
    border: '2px solid white', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
  },

  // Features
  features: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '24px', marginBottom: '60px',
  },
  featureCard: {
    backgroundColor: 'white', padding: '32px 24px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center',
  },
  featureIcon: { fontSize: '40px', marginBottom: '16px' },
  featureTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#1a1a2e' },
  featureDesc: { color: '#666', fontSize: '14px', lineHeight: '1.6' },

  // Stats
  statsBar: {
    display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap',
    backgroundColor: '#1a1a2e', borderRadius: '16px', padding: '40px 20px',
    marginBottom: '60px', gap: '20px',
  },
  statItem: { textAlign: 'center', color: 'white' },
  statValue: { fontSize: '36px', fontWeight: '800', color: '#90caf9' },
  statLabel: { fontSize: '14px', opacity: 0.8, marginTop: '4px' },

  // CTA
  cta: {
    textAlign: 'center', backgroundColor: 'white', padding: '60px 20px',
    borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  },
  ctaTitle: { fontSize: '32px', color: '#1a1a2e', marginBottom: '12px' },
  ctaSubtitle: { color: '#666', marginBottom: '28px', fontSize: '16px' },
};

export default Home;
