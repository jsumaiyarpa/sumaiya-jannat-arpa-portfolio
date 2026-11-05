import { useEffect, useState, useCallback } from 'react';
import { adminApi } from './adminApi.js';

const statItems = [
  { key: 'projects', label: 'Projects', tag: 'Case Studies' },
  { key: 'skills', label: 'Skills', tag: 'Tech Stack' },
  { key: 'reviews', label: 'Reviews', tag: 'Testimonials' },
  { key: 'certificates', label: 'Certificates', tag: 'Credentials' },
  { key: 'faqs', label: 'FAQs', tag: 'Q&A Items' },
  { key: 'gallery_items', label: 'Gallery Items', tag: 'Visual Assets' },
  { key: 'education', label: 'Education', tag: 'Academic Records' },
  { key: 'experience', label: 'Experience', tag: 'Work History' },
];

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi('/api/admin/overview');
      setOverview(data);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard overview.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (loading) {
    return (
      <div className="admin-state-container">
        <div className="admin-loading-spinner" />
        <p className="admin-state-message">Loading dashboard overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-state-container admin-error-box">
        <span className="admin-state-icon" aria-hidden="true">⚠️</span>
        <h3>Failed to load dashboard</h3>
        <p className="admin-state-error" role="alert">{error}</p>
        <button
          type="button"
          className="admin-retry-button"
          onClick={fetchOverview}
        >
          ↻ Retry
        </button>
      </div>
    );
  }

  const stats = overview?.stats ?? {};
  const adminName = overview?.admin?.fullName || overview?.admin?.username || 'Admin';
  const adminRole = overview?.admin?.role || 'Admin';

  return (
    <section className="admin-dashboard">
      <div className="admin-welcome">
        <div className="admin-welcome-text">
          <span className="admin-section-eyebrow">OVERVIEW</span>
          <h1>Welcome back, {adminName}</h1>
          <p>Real-time statistics from your connected Turso database.</p>
        </div>

        <div className="admin-welcome-meta">
          <span className="admin-role-badge">
            <span className="admin-role-dot" />
            {adminRole}
          </span>
          <button
            type="button"
            className="admin-refresh-button"
            onClick={fetchOverview}
            title="Refresh statistics"
            aria-label="Refresh dashboard data"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="admin-stats-grid">
        {statItems.map((item) => (
          <article className="admin-stat-card" key={item.key}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">{item.label}</span>
              <span className="admin-stat-tag">{item.tag}</span>
            </div>
            <strong className="admin-stat-number">{stats[item.key] ?? 0}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
