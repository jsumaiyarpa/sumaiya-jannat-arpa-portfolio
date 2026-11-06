import { useState, useEffect, useMemo } from 'react';
import { adminApi } from './adminApi.js';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import './admin.css';

export default function AdminEducation() {
  const { refreshAll } = usePortfolioData();
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingEdu, setEditingEdu] = useState(null);
  const [formData, setFormData] = useState(getInitialForm());
  const [highlightInput, setHighlightInput] = useState('');
  const [courseInput, setCourseInput] = useState('');
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
      institution: '',
      degree: '',
      major: '',
      dates: '',
      status: 'Currently Studying',
      location: '',
      gpa: '',
      stageTag: '',
      details: '',
      highlights: [],
      coursework: [],
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
      const res = await adminApi('/api/admin/education');
      setEducationList(res.education || []);
    } catch (err) {
      console.error('Failed to load education records:', err);
      setError(err.message || 'Failed to connect to database.');
    } finally {
      setLoading(false);
    }
  }

  const filteredEducation = useMemo(() => {
    return educationList.filter((edu) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        edu.institution.toLowerCase().includes(q) ||
        edu.degree.toLowerCase().includes(q) ||
        (edu.major && edu.major.toLowerCase().includes(q)) ||
        (edu.location && edu.location.toLowerCase().includes(q));

      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'published' && edu.isPublished) ||
        (filterStatus === 'draft' && !edu.isPublished);

      return matchSearch && matchStatus;
    });
  }, [educationList, search, filterStatus]);

  function handleOpenAdd() {
    setModalMode('add');
    setEditingEdu(null);
    setFormData({
      ...getInitialForm(),
      sortOrder: educationList.length > 0 ? Math.max(...educationList.map((e) => e.sortOrder || 0)) + 1 : 1,
    });
    setHighlightInput('');
    setCourseInput('');
    setFormErrors({});
  }

  function handleOpenEdit(edu) {
    setModalMode('edit');
    setEditingEdu(edu);
    setFormData({
      institution: edu.institution || edu.school || '',
      degree: edu.degree || '',
      major: edu.major || '',
      dates: edu.dates || edu.timeline || '',
      status: edu.status || '',
      location: edu.location || '',
      gpa: edu.gpa || '',
      stageTag: edu.stageTag || '',
      details: edu.details || '',
      highlights: Array.isArray(edu.highlights) ? [...edu.highlights] : [],
      coursework: Array.isArray(edu.coursework) ? [...edu.coursework] : [],
      sortOrder: edu.sortOrder ?? 0,
      isPublished: Boolean(edu.isPublished),
    });
    setHighlightInput('');
    setCourseInput('');
    setFormErrors({});
  }

  function handleCloseModal() {
    setModalMode(null);
    setEditingEdu(null);
    setFormErrors({});
  }

  function validateForm() {
    const errors = {};
    if (!formData.institution.trim()) errors.institution = 'Institution / School is required.';
    if (!formData.degree.trim()) errors.degree = 'Degree name is required.';
    if (!formData.dates.trim()) errors.dates = 'Dates / Timeline are required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleAddHighlight(e) {
    if (e) e.preventDefault();
    const val = highlightInput.trim();
    if (val && !formData.highlights.includes(val)) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, val],
      });
      setHighlightInput('');
    }
  }

  function handleRemoveHighlight(idx) {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== idx),
    });
  }

  function handleAddCourse(e) {
    if (e) e.preventDefault();
    const val = courseInput.trim();
    if (val && !formData.coursework.includes(val)) {
      setFormData({
        ...formData,
        coursework: [...formData.coursework, val],
      });
      setCourseInput('');
    }
  }

  function handleRemoveCourse(idx) {
    setFormData({
      ...formData,
      coursework: formData.coursework.filter((_, i) => i !== idx),
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      if (modalMode === 'add') {
        const res = await adminApi('/api/admin/education', {
          method: 'POST',
          body: formData,
        });
        setEducationList((prev) => [...prev, res.education]);
        showToast(`Education record for "${res.education.degree}" added.`);
      } else {
        const res = await adminApi(`/api/admin/education/${editingEdu.id}`, {
          method: 'PUT',
          body: formData,
        });
        setEducationList((prev) => prev.map((e) => (e.id === editingEdu.id ? res.education : e)));
        showToast(`Education record for "${res.education.degree}" updated.`);
      }
      handleCloseModal();
      refreshAll?.();
    } catch (err) {
      console.error('Failed to save education record:', err);
      showToast(err.message || 'Failed to save record.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(edu) {
    try {
      setTogglingId(edu.id);
      const updatedStatus = !edu.isPublished;
      const res = await adminApi(`/api/admin/education/${edu.id}`, {
        method: 'PUT',
        body: {
          ...edu,
          isPublished: updatedStatus,
        },
      });
      setEducationList((prev) => prev.map((e) => (e.id === edu.id ? res.education : e)));
      showToast(`Record is now ${updatedStatus ? 'Published' : 'Draft'}.`);
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
      await adminApi(`/api/admin/education/${deleteTarget.id}`, { method: 'DELETE' });
      setEducationList((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      showToast(`Education record deleted successfully.`);
      setDeleteTarget(null);
      refreshAll?.();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.message || 'Failed to delete record.', 'error');
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
          <h1 className="admin-projects-title">Education Records</h1>
          <p className="admin-projects-subtitle">
            Manage academic degrees, institutions, CGPA, major specializations, and university coursework.
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
            <span>Add Education</span>
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
            placeholder="Search degrees, institutions, coursework..."
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
            <label htmlFor="eduStatusFilter" className="admin-filter-label">
              Status:
            </label>
            <select
              id="eduStatusFilter"
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
          Showing <strong>{filteredEducation.length}</strong> of{' '}
          <strong>{educationList.length}</strong>
        </div>
      </div>

      {/* Main Content: Loading, Error, Empty, or Table */}
      {loading ? (
        <div className="admin-state-container">
          <div className="admin-loading-spinner" />
          <p className="admin-state-message">Fetching education records from Turso database...</p>
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
      ) : filteredEducation.length === 0 ? (
        <div className="admin-empty-state">
          <span className="admin-empty-icon">🎓</span>
          <h3>No Education Records Match Filters</h3>
          <p>Try clearing your search query or choosing another status filter.</p>
          {(search || filterStatus !== 'all') && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => {
                setSearch('');
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
                <th>Degree &amp; Institution</th>
                <th>Major &amp; Timeline</th>
                <th>GPA / Stage</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEducation.map((edu) => {
                const isToggling = togglingId === edu.id;
                return (
                  <tr key={edu.id} className={!edu.isPublished ? 'admin-row-draft' : ''}>
                    {/* Degree & School */}
                    <td className="admin-td-title">
                      <div className="admin-title-line">
                        <span className="admin-project-name">{edu.degree}</span>
                      </div>
                      <div className="admin-slug-line">
                        <code>{edu.institution} {edu.location ? `· ${edu.location}` : ''}</code>
                      </div>
                    </td>

                    {/* Major & Timeline */}
                    <td>
                      <div style={{ fontWeight: 500 }}>{edu.major || '—'}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {edu.dates}
                      </div>
                    </td>

                    {/* GPA / Stage */}
                    <td>
                      {edu.gpa ? (
                        <span className="admin-order-chip">GPA: {edu.gpa}</span>
                      ) : null}
                      {edu.stageTag && (
                        <div style={{ marginTop: '0.25rem' }}>
                          <span className="admin-cat-pill admin-cat-software">
                            {edu.stageTag}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`admin-status-toggle ${edu.isPublished ? 'is-published' : 'is-draft'}`}
                        onClick={() => handleTogglePublish(edu)}
                        disabled={isToggling}
                        title={edu.isPublished ? 'Published — Click to make Draft' : 'Draft — Click to Publish'}
                      >
                        <span className="admin-toggle-dot" />
                        <span>{isToggling ? '...' : edu.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="admin-td-actions">
                      <button
                        type="button"
                        className="admin-action-btn admin-action-edit"
                        onClick={() => handleOpenEdit(edu)}
                        title="Edit Education"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-action-delete"
                        onClick={() => setDeleteTarget(edu)}
                        title="Delete Education"
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
            aria-labelledby="edu-modal-title"
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-eyebrow">
                  {modalMode === 'add' ? 'NEW EDUCATION RECORD' : 'EDIT EDUCATION'}
                </span>
                <h2 id="edu-modal-title" className="admin-modal-title">
                  {modalMode === 'add' ? 'Add Education Record' : `Edit: ${editingEdu?.degree}`}
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

              {/* 1. Degree & Institution */}
              <fieldset className="admin-fieldset">
                <legend className="admin-legend">1. Degree &amp; Institution</legend>
                <div className="admin-form-grid">
                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">
                      Degree Title <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${formErrors.degree ? 'error' : ''}`}
                      placeholder="e.g. Bachelor of Science in Computer Science and Engineering (B.Sc. in CSE)"
                      value={formData.degree}
                      onChange={(e) => {
                        setFormData({ ...formData, degree: e.target.value });
                        if (formErrors.degree) setFormErrors({ ...formErrors, degree: null });
                      }}
                      autoFocus
                      required
                    />
                    {formErrors.degree && (
                      <span className="admin-field-error">{formErrors.degree}</span>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-8">
                    <label className="admin-label">
                      Institution / School <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${formErrors.institution ? 'error' : ''}`}
                      placeholder="e.g. East West University"
                      value={formData.institution}
                      onChange={(e) => {
                        setFormData({ ...formData, institution: e.target.value });
                        if (formErrors.institution) setFormErrors({ ...formErrors, institution: null });
                      }}
                      required
                    />
                    {formErrors.institution && (
                      <span className="admin-field-error">{formErrors.institution}</span>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-4">
                    <label className="admin-label">Location</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Dhaka, Bangladesh"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">Major / Specialization</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Major in Software Engineering"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">
                      Dates / Timeline <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${formErrors.dates ? 'error' : ''}`}
                      placeholder="e.g. Fall 2022 — Present or 2019 — 2021"
                      value={formData.dates}
                      onChange={(e) => {
                        setFormData({ ...formData, dates: e.target.value });
                        if (formErrors.dates) setFormErrors({ ...formErrors, dates: null });
                      }}
                      required
                    />
                    {formErrors.dates && (
                      <span className="admin-field-error">{formErrors.dates}</span>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-4">
                    <label className="admin-label">CGPA / GPA</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. 3.48 / 4.00"
                      value={formData.gpa}
                      onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-4">
                    <label className="admin-label">Academic Status</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Currently Studying"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-4">
                    <label className="admin-label">Stage Tag</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. UNDERGRADUATE // B.SC."
                      value={formData.stageTag}
                      onChange={(e) => setFormData({ ...formData, stageTag: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Academic Focus &amp; Details</label>
                    <textarea
                      className="admin-textarea"
                      rows="2"
                      placeholder="Overview of academic achievements and core subjects..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    />
                  </div>
                </div>
              </fieldset>

              {/* 2. Coursework & Highlights */}
              <fieldset className="admin-fieldset">
                <legend className="admin-legend">2. Highlights &amp; Coursework</legend>
                <div className="admin-form-grid">
                  {/* Highlights Tags */}
                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Academic Highlights &amp; Honors</label>
                    {formData.highlights.length > 0 && (
                      <div className="admin-tags-container">
                        {formData.highlights.map((h, i) => (
                          <span key={i} className="admin-tag-pill admin-tool-tag">
                            <span>{h}</span>
                            <button
                              type="button"
                              className="admin-tag-remove"
                              onClick={() => handleRemoveHighlight(i)}
                              aria-label={`Remove ${h}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="admin-tag-input-row">
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. 100% Merit Scholarship Awardee (press Enter or Add)..."
                        value={highlightInput}
                        onChange={(e) => setHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddHighlight();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={handleAddHighlight}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Coursework Tags */}
                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Core Coursework</label>
                    {formData.coursework.length > 0 && (
                      <div className="admin-tags-container">
                        {formData.coursework.map((c, i) => (
                          <span key={i} className="admin-tag-pill admin-tool-tag">
                            <span>{c}</span>
                            <button
                              type="button"
                              className="admin-tag-remove"
                              onClick={() => handleRemoveCourse(i)}
                              aria-label={`Remove ${c}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="admin-tag-input-row">
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Software Quality Assurance, Data Structures (press Enter or Add)..."
                        value={courseInput}
                        onChange={(e) => setCourseInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCourse();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={handleAddCourse}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* 3. Visibility */}
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
                    <span>Publish Education Record</span>
                  </label>
                  <span className="admin-visibility-hint">
                    Make visible on the formal education timeline on public portfolio
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
                    ? 'Add Education'
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
              Delete Education Record?
            </h3>
            <p className="admin-confirm-message">
              Are you sure you want to delete <strong>&ldquo;{deleteTarget.degree}&rdquo;</strong> (
              {deleteTarget.institution})?
            </p>
            <p className="admin-confirm-sub">
              This will remove the education milestone from the Turso database and public portfolio views.
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

