import { useState, useEffect, useMemo } from 'react';
import { adminApi } from './adminApi.js';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import './admin.css';

export default function AdminCertificates() {
  const { refreshAll } = usePortfolioData();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState(getInitialForm());
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Status toggle tracking
  const [togglingId, setTogglingId] = useState(null);

  // Notification Toast
  const [notification, setNotification] = useState(null);

  function showToast(message, type = 'success') {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 4000);
  }

  function getInitialForm() {
    return {
      category: 'UI/UX DESIGN',
      title: '',
      organization: '',
      dateIssued: '',
      certificateType: 'Certificate of Completion',
      description: '',
      image: '',
      url: '',
      sortOrder: 0,
      isPublished: true,
    };
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi('/api/admin/certificates');
      setCertificates(res.certificates || []);
    } catch (err) {
      console.error('Failed to load certificates:', err);
      setError(err.message || 'Failed to connect to database.');
    } finally {
      setLoading(false);
    }
  }

  // Derive unique categories from existing certificates for filter
  const existingCategories = useMemo(() => {
    const set = new Set();
    certificates.forEach((c) => {
      if (c.category) set.add(c.category.trim());
    });
    return Array.from(set).sort();
  }, [certificates]);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        cert.title.toLowerCase().includes(q) ||
        cert.organization.toLowerCase().includes(q) ||
        cert.category.toLowerCase().includes(q) ||
        (cert.description && cert.description.toLowerCase().includes(q));

      const matchCategory = filterCategory === 'all' || cert.category === filterCategory;
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'published' && cert.isPublished) ||
        (filterStatus === 'draft' && !cert.isPublished);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [certificates, search, filterCategory, filterStatus]);

  function handleOpenAdd() {
    setModalMode('add');
    setEditingCert(null);
    setFormData({
      ...getInitialForm(),
      sortOrder: certificates.length > 0 ? Math.max(...certificates.map((c) => c.sortOrder || 0)) + 1 : 1,
    });
    setFormErrors({});
  }

  function handleOpenEdit(cert) {
    setModalMode('edit');
    setEditingCert(cert);
    setFormData({
      category: cert.category || 'UI/UX DESIGN',
      title: cert.title || '',
      organization: cert.organization || '',
      dateIssued: cert.dateIssued || cert.date || '',
      certificateType: cert.certificateType || '',
      description: cert.description || '',
      image: cert.image || '',
      url: cert.url || '',
      sortOrder: cert.sortOrder ?? 0,
      isPublished: Boolean(cert.isPublished),
    });
    setFormErrors({});
  }

  function handleCloseModal() {
    setModalMode(null);
    setEditingCert(null);
    setFormErrors({});
  }

  function validateForm() {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Certificate title is required.';
    if (!formData.organization.trim()) errors.organization = 'Issuing organization is required.';
    if (!formData.category.trim()) errors.category = 'Category is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      if (modalMode === 'add') {
        const res = await adminApi('/api/admin/certificates', {
          method: 'POST',
          body: formData,
        });
        setCertificates((prev) => [...prev, res.certificate]);
        showToast(`Certificate "${res.certificate.title}" added.`);
      } else {
        const res = await adminApi(`/api/admin/certificates/${editingCert.id}`, {
          method: 'PUT',
          body: formData,
        });
        setCertificates((prev) => prev.map((c) => (c.id === editingCert.id ? res.certificate : c)));
        showToast(`Certificate "${res.certificate.title}" updated.`);
      }
      handleCloseModal();
      refreshAll?.();
    } catch (err) {
      console.error('Failed to save certificate:', err);
      showToast(err.message || 'Failed to save certificate.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(cert) {
    try {
      setTogglingId(cert.id);
      const updatedStatus = !cert.isPublished;
      const res = await adminApi(`/api/admin/certificates/${cert.id}`, {
        method: 'PUT',
        body: {
          ...cert,
          isPublished: updatedStatus,
        },
      });
      setCertificates((prev) => prev.map((c) => (c.id === cert.id ? res.certificate : c)));
      showToast(`Certificate is now ${updatedStatus ? 'Published' : 'Draft'}.`);
      refreshAll?.();
    } catch (err) {
      console.error('Toggle failed:', err);
      showToast(err.message || 'Failed to update publication status.', 'error');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminApi(`/api/admin/certificates/${deleteTarget.id}`, { method: 'DELETE' });
      setCertificates((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast(`Certificate "${deleteTarget.title}" deleted successfully.`);
      setDeleteTarget(null);
      refreshAll?.();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.message || 'Failed to delete certificate.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-projects-wrapper">
      {/* Toast Notification */}
      {notification && (
        <div className={`admin-toast admin-toast-${notification.type}`} role="status">
          <span className="admin-toast-icon">
            {notification.type === 'success' ? '✓' : '⚠'}
          </span>
          <span className="admin-toast-message">{notification.message}</span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="admin-projects-header">
        <div className="admin-projects-title-box">
          <span className="admin-projects-eyebrow">DATABASE MANAGEMENT · TURSO</span>
          <h1 className="admin-projects-title">Certificates &amp; Credentials</h1>
          <p className="admin-projects-subtitle">
            Manage professional certificates, verified assessments, academic scholarships, and competition recognitions.
          </p>
        </div>

        <div className="admin-projects-actions">
          <button
            type="button"
            className="admin-btn admin-btn-refresh"
            onClick={loadData}
            disabled={loading}
            title="Refresh database records"
          >
            <span aria-hidden="true">↻</span>
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <span aria-hidden="true">+</span>
            <span>Add Certificate</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="admin-projects-toolbar">
        <div className="admin-search-wrap">
          <span className="admin-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="admin-search-input"
            placeholder="Search by title, organization, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="admin-filter-group">
          <div className="admin-select-wrap">
            <label htmlFor="certCatFilter" className="admin-filter-label">
              Category:
            </label>
            <select
              id="certCatFilter"
              className="admin-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-select-wrap">
            <label htmlFor="certStatusFilter" className="admin-filter-label">
              Status:
            </label>
            <select
              id="certStatusFilter"
              className="admin-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>

        <div className="admin-count-badge">
          Showing <strong>{filteredCertificates.length}</strong> of{' '}
          <strong>{certificates.length}</strong>
        </div>
      </div>

      {/* Main Content: Loading, Error, Empty, or Table */}
      {loading ? (
        <div className="admin-state-container">
          <div className="admin-loading-spinner" />
          <p className="admin-state-message">Fetching certificates from Turso database...</p>
        </div>
      ) : error ? (
        <div className="admin-state-container admin-error-box">
          <span className="admin-state-icon">⚠</span>
          <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Connection Error</h3>
          <p className="admin-state-error">{error}</p>
          <button type="button" className="admin-retry-button" onClick={loadData}>
            Retry Connection
          </button>
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="admin-empty-state">
          <span className="admin-empty-icon">📜</span>
          <h3>No Certificates Match Filters</h3>
          <p>Try clearing your search query or choosing another category filter.</p>
          {(search || filterCategory !== 'all' || filterStatus !== 'all') && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => {
                setSearch('');
                setFilterCategory('all');
                setFilterStatus('all');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '4.5rem' }}>Cover</th>
                <th>Title &amp; Issuer</th>
                <th>Category &amp; Type</th>
                <th>Date Issued</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((cert) => {
                const isToggling = togglingId === cert.id;
                return (
                  <tr key={cert.id} className={!cert.isPublished ? 'admin-row-draft' : ''}>
                    {/* Thumbnail */}
                    <td className="admin-td-cover">
                      {cert.image ? (
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="admin-project-thumb"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="admin-project-thumb-placeholder">
                          <span>📜</span>
                        </div>
                      )}
                    </td>

                    {/* Title & Organization */}
                    <td className="admin-td-title">
                      <div className="admin-title-line">
                        <span className="admin-project-name">{cert.title}</span>
                      </div>
                      <div className="admin-slug-line">
                        <code>{cert.organization}</code>
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td>
                      <span className="admin-cat-pill admin-cat-uiux">
                        {cert.category}
                      </span>
                      {cert.certificateType && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {cert.certificateType}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {cert.dateIssued || cert.date || '—'}
                      </span>
                    </td>

                    {/* Publication Status Toggle */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`admin-status-toggle ${cert.isPublished ? 'is-published' : 'is-draft'}`}
                        onClick={() => handleTogglePublish(cert)}
                        disabled={isToggling}
                        title={cert.isPublished ? 'Published — Click to make Draft' : 'Draft — Click to Publish'}
                      >
                        <span className="admin-toggle-dot" />
                        <span>{isToggling ? '...' : cert.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="admin-td-actions">
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-action-btn admin-action-view"
                          title="Verify Credential Link"
                        >
                          ↗
                        </a>
                      )}
                      <button
                        type="button"
                        className="admin-action-btn admin-action-edit"
                        onClick={() => handleOpenEdit(cert)}
                        title="Edit Certificate"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-action-delete"
                        onClick={() => setDeleteTarget(cert)}
                        title="Delete Certificate"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalMode && (
        <div className="admin-modal-backdrop" onClick={() => !saving && handleCloseModal()}>
          <div
            className="admin-modal-window admin-modal-simplified"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-eyebrow">
                  {modalMode === 'add' ? 'NEW CREDENTIAL' : 'EDIT CREDENTIAL'}
                </span>
                <h2 id="cert-modal-title" className="admin-modal-title">
                  {modalMode === 'add' ? 'Add New Certificate' : `Edit: ${editingCert?.title}`}
                </h2>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={handleCloseModal}
                disabled={saving}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-form">
              {formErrors.submit && (
                <div className="admin-form-banner-error">{formErrors.submit}</div>
              )}

              {/* 1. Basic Information */}
              <fieldset className="admin-fieldset">
                <legend className="admin-legend">1. Certificate Information</legend>
                <div className="admin-form-grid">
                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">
                      Certificate Title <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${formErrors.title ? 'error' : ''}`}
                      placeholder="e.g. UI/UX Design Career Track Program"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                      }}
                      autoFocus
                      required
                    />
                    {formErrors.title && (
                      <span className="admin-field-error">{formErrors.title}</span>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">
                      Issuing Organization <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${formErrors.organization ? 'error' : ''}`}
                      placeholder="e.g. OSTAD, East West University, Google"
                      value={formData.organization}
                      onChange={(e) => {
                        setFormData({ ...formData, organization: e.target.value });
                        if (formErrors.organization) setFormErrors({ ...formErrors, organization: null });
                      }}
                      required
                    />
                    {formErrors.organization && (
                      <span className="admin-field-error">{formErrors.organization}</span>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">
                      Category <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${formErrors.category ? 'error' : ''}`}
                      placeholder="e.g. UI/UX DESIGN, AI & DATA, ACADEMIC HONOR"
                      value={formData.category}
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value });
                        if (formErrors.category) setFormErrors({ ...formErrors, category: null });
                      }}
                      required
                    />
                    {formErrors.category && (
                      <span className="admin-field-error">{formErrors.category}</span>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">Date Issued / Awarded</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Issued August 2026 or March 2023"
                      value={formData.dateIssued}
                      onChange={(e) => setFormData({ ...formData, dateIssued: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">Certificate Type</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Certificate of Completion, Merit Award"
                      value={formData.certificateType}
                      onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
                    />
                  </div>
                </div>
              </fieldset>

              {/* 2. Media & Links */}
              <fieldset className="admin-fieldset">
                <legend className="admin-legend">2. Media &amp; Verification</legend>
                <div className="admin-form-grid">
                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Verification URL (Optional)</label>
                    <input
                      type="url"
                      className="admin-input"
                      placeholder="https://ostad.app/share/certificate/..."
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Certificate Image (Optional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. /images/certificates/ostad_marks_uiux.png"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    {formData.image && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="admin-project-thumb"
                          style={{ width: '4.5rem', height: '3rem' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Image preview active</span>
                      </div>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Description / Achievement Details</label>
                    <textarea
                      className="admin-textarea"
                      rows="2"
                      placeholder="Summary of credential coverage, score, or scholarship details..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </fieldset>

              {/* 3. Visibility Box */}
              <div className="admin-visibility-box">
                <div className="admin-visibility-item">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({ ...formData, isPublished: e.target.checked })
                      }
                    />
                    <span>Publish Certificate</span>
                  </label>
                  <span className="admin-visibility-hint">
                    Make visible on the public education &amp; achievements credentials showcase
                  </span>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : modalMode === 'add'
                    ? 'Add Certificate'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => !deleting && setDeleteTarget(null)}>
          <div
            className="admin-modal-window admin-modal-confirm"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-heading"
          >
            <div className="admin-confirm-icon">🗑</div>
            <h3 id="delete-heading" className="admin-confirm-title">
              Delete Certificate Permanently?
            </h3>
            <p className="admin-confirm-message">
              Are you sure you want to delete <strong>&ldquo;{deleteTarget.title}&rdquo;</strong> (
              {deleteTarget.organization})?
            </p>
            <p className="admin-confirm-sub">
              This will remove the credential from the Turso database and public portfolio views.
              This action cannot be undone.
            </p>

            <div className="admin-confirm-actions">
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

