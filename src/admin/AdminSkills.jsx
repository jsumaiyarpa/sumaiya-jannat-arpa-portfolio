import { useState, useEffect, useMemo } from 'react';
import { adminApi } from './adminApi.js';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import './admin.css';

export default function AdminSkills() {
  const { refreshAll } = usePortfolioData();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal & Form State
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'uiux',
    level: '',
    sortOrder: 0,
    isPublished: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toggling status state
  const [togglingId, setTogglingId] = useState(null);

  // Notification Toast
  const [notification, setNotification] = useState(null);

  function showToast(message, type = 'success') {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 4000);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi('/api/admin/skills');
      setSkills(res.skills || []);
      setCategories(res.categories || []);
      if (res.categories && res.categories.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: res.categories[0].id }));
      }
    } catch (err) {
      console.error('Failed to load skills:', err);
      setError(err.message || 'Failed to connect to database.');
    } finally {
      setLoading(false);
    }
  }

  // Filtered skills
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.categoryTitle && s.categoryTitle.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = filterCategory === 'all' || s.categoryId === filterCategory;
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'published' && s.isPublished) ||
        (filterStatus === 'draft' && !s.isPublished);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [skills, search, filterCategory, filterStatus]);

  function handleOpenAdd() {
    setModalMode('add');
    setEditingSkill(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 'uiux',
      level: '',
      sortOrder: skills.length > 0 ? Math.max(...skills.map((s) => s.sortOrder || 0)) + 1 : 1,
      isPublished: true,
    });
    setFormErrors({});
  }

  function handleOpenEdit(skill) {
    setModalMode('edit');
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      categoryId: skill.categoryId || categories[0]?.id || 'uiux',
      level: skill.level || '',
      sortOrder: skill.sortOrder ?? 0,
      isPublished: Boolean(skill.isPublished),
    });
    setFormErrors({});
  }

  function handleCloseModal() {
    setModalMode(null);
    setEditingSkill(null);
    setFormErrors({});
  }

  function validateForm() {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Skill name is required.';
    }
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      if (modalMode === 'add') {
        const res = await adminApi('/api/admin/skills', {
          method: 'POST',
          body: formData,
        });
        setSkills((prev) => [...prev, res.skill]);
        showToast(`Skill "${res.skill.name}" added successfully.`);
      } else {
        const res = await adminApi(`/api/admin/skills/${editingSkill.id}`, {
          method: 'PUT',
          body: formData,
        });
        setSkills((prev) => prev.map((s) => (s.id === editingSkill.id ? res.skill : s)));
        showToast(`Skill "${res.skill.name}" updated successfully.`);
      }
      handleCloseModal();
      refreshAll?.();
    } catch (err) {
      console.error('Failed to save skill:', err);
      showToast(err.message || 'Failed to save skill.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(skill) {
    try {
      setTogglingId(skill.id);
      const updatedStatus = !skill.isPublished;
      const res = await adminApi(`/api/admin/skills/${skill.id}`, {
        method: 'PUT',
        body: {
          ...skill,
          isPublished: updatedStatus,
        },
      });
      setSkills((prev) => prev.map((s) => (s.id === skill.id ? res.skill : s)));
      showToast(`Skill "${skill.name}" is now ${updatedStatus ? 'Published' : 'Draft'}.`);
      refreshAll?.();
    } catch (err) {
      console.error('Failed to toggle skill publication:', err);
      showToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminApi(`/api/admin/skills/${deleteTarget.id}`, { method: 'DELETE' });
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      showToast(`Skill "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      refreshAll?.();
    } catch (err) {
      console.error('Failed to delete skill:', err);
      showToast(err.message || 'Failed to delete skill.', 'error');
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
          <h1 className="admin-projects-title">Skills Inventory</h1>
          <p className="admin-projects-subtitle">
            Manage technical proficiencies, frameworks, tools, and design capabilities across categories.
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
            <span>Add Skill</span>
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
            placeholder="Search by skill name or category..."
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
            <label htmlFor="skillCatFilter" className="admin-filter-label">
              Category:
            </label>
            <select
              id="skillCatFilter"
              className="admin-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-select-wrap">
            <label htmlFor="skillStatusFilter" className="admin-filter-label">
              Status:
            </label>
            <select
              id="skillStatusFilter"
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
          Showing <strong>{filteredSkills.length}</strong> of{' '}
          <strong>{skills.length}</strong>
        </div>
      </div>

      {/* Main Content: Loading, Error, Empty, or Table */}
      {loading ? (
        <div className="admin-state-container">
          <div className="admin-loading-spinner" />
          <p className="admin-state-message">Fetching skills from Turso database...</p>
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
      ) : filteredSkills.length === 0 ? (
        <div className="admin-empty-state">
          <span className="admin-empty-icon">⚡</span>
          <h3>No Skills Match Filters</h3>
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
                <th>Skill Name</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Sort</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map((s) => {
                const isToggling = togglingId === s.id;
                return (
                  <tr key={s.id} className={!s.isPublished ? 'admin-row-draft' : ''}>
                    <td className="admin-td-title">
                      <div className="admin-title-line">
                        <span className="admin-project-name">{s.name}</span>
                        {s.level && (
                          <span className="admin-order-chip">{s.level}</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className={`admin-cat-pill admin-cat-${s.categoryId}`}>
                        {s.categoryTitle || s.categoryId}
                      </span>
                    </td>

                    <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>
                      {s.sortOrder}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`admin-status-toggle ${s.isPublished ? 'is-published' : 'is-draft'}`}
                        onClick={() => handleTogglePublish(s)}
                        disabled={isToggling}
                        title={s.isPublished ? 'Published — Click to make Draft' : 'Draft — Click to Publish'}
                      >
                        <span className="admin-toggle-dot" />
                        <span>{isToggling ? '...' : s.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="admin-td-actions">
                      <button
                        type="button"
                        className="admin-action-btn admin-action-edit"
                        onClick={() => handleOpenEdit(s)}
                        title="Edit Skill"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-action-delete"
                        onClick={() => setDeleteTarget(s)}
                        title="Delete Skill"
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
            aria-labelledby="skill-modal-title"
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-eyebrow">
                  {modalMode === 'add' ? 'NEW SKILL' : 'EDIT SKILL'}
                </span>
                <h2 id="skill-modal-title" className="admin-modal-title">
                  {modalMode === 'add' ? 'Add New Skill' : `Edit: ${editingSkill?.name}`}
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

              <fieldset className="admin-fieldset">
                <legend className="admin-legend">1. Skill Information</legend>
                <div className="admin-form-grid">
                  <div className="admin-form-field admin-col-8">
                    <label className="admin-label">
                      Skill Name <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${formErrors.name ? 'error' : ''}`}
                      placeholder="e.g. React, UX Research, Newman CLI"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                      }}
                      autoFocus
                      required
                    />
                    {formErrors.name && (
                      <span className="admin-field-error">{formErrors.name}</span>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-4">
                    <label className="admin-label">
                      Category <span className="admin-required">*</span>
                    </label>
                    <select
                      className="admin-input"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">Proficiency / Level</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Core Competency, Advanced, Professional"
                      value={formData.level || ''}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">Sort Order</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={formData.sortOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sortOrder: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </fieldset>

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
                    <span>Publish Skill</span>
                  </label>
                  <span className="admin-visibility-hint">
                    Make visible on the public skills matrix and layered stack
                  </span>
                </div>
              </div>

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
                    ? 'Add Skill'
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
              Delete Skill Permanently?
            </h3>
            <p className="admin-confirm-message">
              Are you sure you want to delete <strong>&ldquo;{deleteTarget.name}&rdquo;</strong>?
            </p>
            <p className="admin-confirm-sub">
              This will remove the skill from the Turso database and public portfolio views.
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

