import { useState, useEffect, useMemo } from 'react';
import { adminApi } from './adminApi.js';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import './admin.css';

export default function AdminExperience() {
  const { refreshAll } = usePortfolioData();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Org Modal State
  const [orgModalMode, setOrgModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingOrg, setEditingOrg] = useState(null);
  const [orgForm, setOrgForm] = useState({
    org: '',
    fullName: '',
    location: '',
    orgType: 'University Academic & Leadership Club',
    isCurrent: false,
    logoUrl: '',
    sortOrder: 0,
    isPublished: true,
  });
  const [orgErrors, setOrgErrors] = useState({});
  const [savingOrg, setSavingOrg] = useState(false);

  // Role Modal State
  const [roleModalMode, setRoleModalMode] = useState(null); // 'add' | 'edit' | null
  const [targetOrgForRole, setTargetOrgForRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    title: '',
    dates: '',
    description: '',
    highlights: [],
    sortOrder: 0,
  });
  const [highlightInput, setHighlightInput] = useState('');
  const [roleErrors, setRoleErrors] = useState({});
  const [savingRole, setSavingRole] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'org' | 'role', item: ... }
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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi('/api/admin/experience');
      setExperiences(res.experience || []);
    } catch (err) {
      console.error('Failed to load experience records:', err);
      setError(err.message || 'Failed to connect to database.');
    } finally {
      setLoading(false);
    }
  }

  // Filtered experience list
  const filteredExperiences = useMemo(() => {
    return experiences.filter((exp) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        exp.org.toLowerCase().includes(q) ||
        (exp.fullName && exp.fullName.toLowerCase().includes(q)) ||
        (exp.location && exp.location.toLowerCase().includes(q)) ||
        (exp.roles && exp.roles.some((r) => r.title.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q))));

      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'published' && exp.isPublished) ||
        (filterStatus === 'draft' && !exp.isPublished) ||
        (filterStatus === 'current' && exp.isCurrent);

      return matchSearch && matchStatus;
    });
  }, [experiences, search, filterStatus]);

  // Organization modal handlers
  function handleOpenAddOrg() {
    setOrgModalMode('add');
    setEditingOrg(null);
    setOrgForm({
      org: '',
      fullName: '',
      location: '',
      orgType: 'University Academic & Leadership Club',
      isCurrent: false,
      logoUrl: '',
      sortOrder: experiences.length > 0 ? Math.max(...experiences.map((e) => e.sortOrder || 0)) + 1 : 1,
      isPublished: true,
    });
    setOrgErrors({});
  }

  function handleOpenEditOrg(exp) {
    setOrgModalMode('edit');
    setEditingOrg(exp);
    setOrgForm({
      org: exp.org || '',
      fullName: exp.fullName || exp.org || '',
      location: exp.location || '',
      orgType: exp.orgType || exp.type || 'Organization',
      isCurrent: Boolean(exp.isCurrent),
      logoUrl: exp.logoUrl || '',
      sortOrder: exp.sortOrder ?? 0,
      isPublished: Boolean(exp.isPublished),
    });
    setOrgErrors({});
  }

  function validateOrgForm() {
    const errors = {};
    if (!orgForm.org.trim()) errors.org = 'Organization display name is required.';
    if (!orgForm.fullName.trim()) errors.fullName = 'Full organization name is required.';
    if (!orgForm.location.trim()) errors.location = 'Location is required.';
    setOrgErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmitOrg(e) {
    e.preventDefault();
    if (!validateOrgForm()) return;

    try {
      setSavingOrg(true);
      if (orgModalMode === 'add') {
        const res = await adminApi('/api/admin/experience', {
          method: 'POST',
          body: orgForm,
        });
        setExperiences((prev) => [...prev, res.experience]);
        showToast(`Organization "${res.experience.org}" added successfully.`);
      } else {
        const res = await adminApi(`/api/admin/experience/${editingOrg.id}`, {
          method: 'PUT',
          body: orgForm,
        });
        setExperiences((prev) => prev.map((e) => (e.id === editingOrg.id ? res.experience : e)));
        showToast(`Organization "${res.experience.org}" updated successfully.`);
      }
      setOrgModalMode(null);
      setEditingOrg(null);
      refreshAll?.();
    } catch (err) {
      console.error('Failed to save organization:', err);
      showToast(err.message || 'Failed to save organization.', 'error');
    } finally {
      setSavingOrg(false);
    }
  }

  async function handleTogglePublishOrg(exp) {
    try {
      setTogglingId(exp.id);
      const updatedStatus = !exp.isPublished;
      const res = await adminApi(`/api/admin/experience/${exp.id}`, {
        method: 'PUT',
        body: {
          ...exp,
          isPublished: updatedStatus,
        },
      });
      setExperiences((prev) => prev.map((e) => (e.id === exp.id ? res.experience : e)));
      showToast(`"${exp.org}" is now ${updatedStatus ? 'Published' : 'Draft'}.`);
      refreshAll?.();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
      showToast(err.message || 'Failed to update publication status.', 'error');
    } finally {
      setTogglingId(null);
    }
  }

  // Role modal handlers
  function handleOpenAddRole(exp) {
    setRoleModalMode('add');
    setTargetOrgForRole(exp);
    setEditingRole(null);
    setRoleForm({
      title: '',
      dates: '',
      description: '',
      highlights: [],
      sortOrder: exp.roles?.length > 0 ? Math.max(...exp.roles.map((r) => r.sortOrder || 0)) + 1 : 1,
    });
    setHighlightInput('');
    setRoleErrors({});
  }

  function handleOpenEditRole(exp, role) {
    setRoleModalMode('edit');
    setTargetOrgForRole(exp);
    setEditingRole(role);
    setRoleForm({
      title: role.title || '',
      dates: role.dates || '',
      description: role.description || '',
      highlights: Array.isArray(role.highlights) ? [...role.highlights] : [],
      sortOrder: role.sortOrder ?? 0,
    });
    setHighlightInput('');
    setRoleErrors({});
  }

  function handleAddHighlight(e) {
    if (e) e.preventDefault();
    const val = highlightInput.trim();
    if (val && !roleForm.highlights.includes(val)) {
      setRoleForm({
        ...roleForm,
        highlights: [...roleForm.highlights, val],
      });
      setHighlightInput('');
    }
  }

  function handleRemoveHighlight(idx) {
    setRoleForm({
      ...roleForm,
      highlights: roleForm.highlights.filter((_, i) => i !== idx),
    });
  }

  function validateRoleForm() {
    const errors = {};
    if (!roleForm.title.trim()) errors.title = 'Role title is required.';
    if (!roleForm.dates.trim()) errors.dates = 'Dates / Timeline are required (e.g. 2024 — Present).';
    setRoleErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmitRole(e) {
    e.preventDefault();
    if (!validateRoleForm()) return;

    try {
      setSavingRole(true);
      if (roleModalMode === 'add') {
        const res = await adminApi(`/api/admin/experience/${targetOrgForRole.id}/roles`, {
          method: 'POST',
          body: roleForm,
        });
        setExperiences((prev) =>
          prev.map((exp) => {
            if (exp.id === targetOrgForRole.id) {
              return {
                ...exp,
                roles: [...(exp.roles || []), res.role],
              };
            }
            return exp;
          })
        );
        showToast(`Role "${res.role.title}" added to ${targetOrgForRole.org}.`);
      } else {
        const res = await adminApi(`/api/admin/experience-roles/${editingRole.id}`, {
          method: 'PUT',
          body: roleForm,
        });
        setExperiences((prev) =>
          prev.map((exp) => {
            if (exp.id === targetOrgForRole.id) {
              return {
                ...exp,
                roles: exp.roles.map((r) => (r.id === editingRole.id ? res.role : r)),
              };
            }
            return exp;
          })
        );
        showToast(`Role "${res.role.title}" updated.`);
      }
      setRoleModalMode(null);
      setEditingRole(null);
      setTargetOrgForRole(null);
      refreshAll?.();
    } catch (err) {
      console.error('Failed to save role:', err);
      showToast(err.message || 'Failed to save role.', 'error');
    } finally {
      setSavingRole(false);
    }
  }

  // Delete handlers
  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      if (deleteTarget.type === 'org') {
        await adminApi(`/api/admin/experience/${deleteTarget.item.id}`, { method: 'DELETE' });
        setExperiences((prev) => prev.filter((e) => e.id !== deleteTarget.item.id));
        showToast(`Organization "${deleteTarget.item.org}" deleted.`);
      } else if (deleteTarget.type === 'role') {
        await adminApi(`/api/admin/experience-roles/${deleteTarget.item.id}`, { method: 'DELETE' });
        setExperiences((prev) =>
          prev.map((exp) => ({
            ...exp,
            roles: exp.roles?.filter((r) => r.id !== deleteTarget.item.id) || [],
          }))
        );
        showToast(`Role "${deleteTarget.item.title}" deleted.`);
      }
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
          <h1 className="admin-projects-title">Experience &amp; Leadership</h1>
          <p className="admin-projects-subtitle">
            Manage organizations, campus leadership positions, volunteering history, and progressive promotion roles.
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
            onClick={handleOpenAddOrg}
          >
            <span aria-hidden="true">+</span>
            <span>Add Organization</span>
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
            placeholder="Search organizations, roles, locations..."
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
            <label htmlFor="expStatusFilter" className="admin-filter-label">
              Status:
            </label>
            <select
              id="expStatusFilter"
              className="admin-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Experiences</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
              <option value="current">Current Roles Only</option>
            </select>
          </div>
        </div>

        <div className="admin-count-badge">
          Showing <strong>{filteredExperiences.length}</strong> of{' '}
          <strong>{experiences.length}</strong>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="admin-state-container">
          <div className="admin-loading-spinner" />
          <p className="admin-state-message">Fetching experience records from Turso database...</p>
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
      ) : filteredExperiences.length === 0 ? (
        <div className="admin-empty-state">
          <span className="admin-empty-icon">🏢</span>
          <h3>No Experience Records Match Filters</h3>
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
        <div className="admin-exp-cards-list">
          {filteredExperiences.map((exp) => (
            <article className="admin-exp-card" key={exp.id}>
              {/* Org Header Bar */}
              <div className="admin-exp-card-header">
                <div className="admin-exp-card-info">
                  <div className="admin-exp-title-row">
                    <h2 className="admin-exp-org-title">{exp.org}</h2>
                    {exp.isCurrent && (
                      <span className="admin-order-chip">Current</span>
                    )}
                    <span className="admin-cat-pill admin-cat-uiux">
                      {exp.orgType || exp.type}
                    </span>
                  </div>
                  <p className="admin-exp-fullname">{exp.fullName}</p>
                  <p className="admin-exp-location">📍 {exp.location}</p>
                </div>

                <div className="admin-exp-card-actions">
                  <button
                    type="button"
                    className={`admin-status-toggle ${exp.isPublished ? 'is-published' : 'is-draft'}`}
                    onClick={() => handleTogglePublishOrg(exp)}
                    disabled={togglingId === exp.id}
                    title={exp.isPublished ? 'Published — Click to make Draft' : 'Draft — Click to Publish'}
                  >
                    <span className="admin-toggle-dot" />
                    <span>{exp.isPublished ? 'Published' : 'Draft'}</span>
                  </button>

                  <button
                    type="button"
                    className="admin-action-btn admin-action-edit"
                    onClick={() => handleOpenEditOrg(exp)}
                    title="Edit Organization"
                  >
                    ✎
                  </button>

                  <button
                    type="button"
                    className="admin-action-btn admin-action-delete"
                    onClick={() => setDeleteTarget({ type: 'org', item: exp })}
                    title="Delete Organization"
                  >
                    🗑
                  </button>
                </div>
              </div>

              {/* Roles Section */}
              <div className="admin-exp-roles-section">
                <div className="admin-exp-roles-header">
                  <h3>Roles &amp; Positions ({exp.roles?.length || 0})</h3>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-micro"
                    onClick={() => handleOpenAddRole(exp)}
                  >
                    <span aria-hidden="true">+</span>
                    <span>Add Role</span>
                  </button>
                </div>

                {(!exp.roles || exp.roles.length === 0) ? (
                  <p className="admin-exp-no-roles">No roles recorded for this organization.</p>
                ) : (
                  <div className="admin-exp-roles-list">
                    {exp.roles.map((role) => (
                      <div className="admin-exp-role-item" key={role.id}>
                        <div className="admin-role-item-main">
                          <div className="admin-role-item-title-row">
                            <strong className="admin-role-title">{role.title}</strong>
                            <span className="admin-slug-line"><code>{role.dates}</code></span>
                          </div>
                          {role.description && (
                            <p className="admin-role-desc">{role.description}</p>
                          )}
                          {role.highlights && role.highlights.length > 0 && (
                            <div className="admin-tags-container" style={{ margin: '0.4rem 0 0' }}>
                              {role.highlights.map((h, i) => (
                                <span key={i} className="admin-tag-pill admin-tool-tag" style={{ cursor: 'default' }}>
                                  {h}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="admin-role-item-actions">
                          <button
                            type="button"
                            className="admin-action-btn admin-action-edit"
                            onClick={() => handleOpenEditRole(exp, role)}
                            title="Edit Role"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn admin-action-delete"
                            onClick={() => setDeleteTarget({ type: 'role', item: role })}
                            title="Delete Role"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Organization Add / Edit Modal */}
      {orgModalMode && (
        <div className="admin-modal-backdrop" onClick={() => !savingOrg && setOrgModalMode(null)}>
          <div
            className="admin-modal-window admin-modal-simplified"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="org-modal-title"
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-eyebrow">
                  {orgModalMode === 'add' ? 'NEW ORGANIZATION' : 'EDIT ORGANIZATION'}
                </span>
                <h2 id="org-modal-title" className="admin-modal-title">
                  {orgModalMode === 'add' ? 'Add Experience Organization' : `Edit: ${editingOrg?.org}`}
                </h2>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setOrgModalMode(null)}
                disabled={savingOrg}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitOrg} className="admin-modal-form">
              {orgErrors.submit && (
                <div className="admin-form-banner-error">{orgErrors.submit}</div>
              )}

              <fieldset className="admin-fieldset">
                <legend className="admin-legend">1. Organization Details</legend>
                <div className="admin-form-grid">
                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">
                      Organization Display Name <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${orgErrors.org ? 'error' : ''}`}
                      placeholder="e.g. EWU English Conversation Club (EWUECC)"
                      value={orgForm.org}
                      onChange={(e) => {
                        setOrgForm({ ...orgForm, org: e.target.value });
                        if (orgErrors.org) setOrgErrors({ ...orgErrors, org: null });
                      }}
                      autoFocus
                      required
                    />
                    {orgErrors.org && <span className="admin-field-error">{orgErrors.org}</span>}
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">
                      Full Organization Name <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${orgErrors.fullName ? 'error' : ''}`}
                      placeholder="e.g. East West University English Conversation Club"
                      value={orgForm.fullName}
                      onChange={(e) => {
                        setOrgForm({ ...orgForm, fullName: e.target.value });
                        if (orgErrors.fullName) setOrgErrors({ ...orgErrors, fullName: null });
                      }}
                      required
                    />
                    {orgErrors.fullName && <span className="admin-field-error">{orgErrors.fullName}</span>}
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">
                      Location <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${orgErrors.location ? 'error' : ''}`}
                      placeholder="e.g. East West University, Dhaka"
                      value={orgForm.location}
                      onChange={(e) => {
                        setOrgForm({ ...orgForm, location: e.target.value });
                        if (orgErrors.location) setOrgErrors({ ...orgErrors, location: null });
                      }}
                      required
                    />
                    {orgErrors.location && <span className="admin-field-error">{orgErrors.location}</span>}
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">Organization Type</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. University Leadership Club"
                      value={orgForm.orgType}
                      onChange={(e) => setOrgForm({ ...orgForm, orgType: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-8">
                    <label className="admin-label">Logo / Image Path (optional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. /images/orgs/ewuecc.png"
                      value={orgForm.logoUrl}
                      onChange={(e) => setOrgForm({ ...orgForm, logoUrl: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-4">
                    <label className="admin-label">Display Order</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={orgForm.sortOrder}
                      onChange={(e) => setOrgForm({ ...orgForm, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>
              </fieldset>

              {/* Visibility Box */}
              <div className="admin-visibility-box">
                <div className="admin-visibility-item">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={orgForm.isCurrent}
                      onChange={(e) => setOrgForm({ ...orgForm, isCurrent: e.target.checked })}
                    />
                    <span>Currently Active Organization</span>
                  </label>
                  <span className="admin-visibility-hint">
                    Marks this as your ongoing activity / current affiliation
                  </span>
                </div>

                <div className="admin-visibility-item">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={orgForm.isPublished}
                      onChange={(e) => setOrgForm({ ...orgForm, isPublished: e.target.checked })}
                    />
                    <span>Publish Organization</span>
                  </label>
                  <span className="admin-visibility-hint">
                    Make visible on the experience timeline on public portfolio
                  </span>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={() => setOrgModalMode(null)}
                  disabled={savingOrg}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={savingOrg}>
                  {savingOrg ? 'Saving...' : orgModalMode === 'add' ? 'Add Organization' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Add / Edit Modal */}
      {roleModalMode && (
        <div
          className="admin-modal-backdrop"
          onClick={() => {
            if (!savingRole) {
              setRoleModalMode(null);
              setEditingRole(null);
            }
          }}
        >
          <div
            className="admin-modal-window admin-modal-simplified"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-modal-title"
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-eyebrow">
                  {roleModalMode === 'add' ? 'NEW ROLE' : 'EDIT ROLE'}
                </span>
                <h2 id="role-modal-title" className="admin-modal-title">
                  {roleModalMode === 'add'
                    ? `Add Role to ${targetOrgForRole?.org}`
                    : `Edit: ${editingRole?.title}`}
                </h2>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => {
                  setRoleModalMode(null);
                  setEditingRole(null);
                }}
                disabled={savingRole}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRole} className="admin-modal-form">
              <fieldset className="admin-fieldset">
                <legend className="admin-legend">1. Role Information</legend>
                <div className="admin-form-grid">
                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">
                      Position / Role Title <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${roleErrors.title ? 'error' : ''}`}
                      placeholder="e.g. Head of Sub-Executives & Volunteers"
                      value={roleForm.title}
                      onChange={(e) => {
                        setRoleForm({ ...roleForm, title: e.target.value });
                        if (roleErrors.title) setRoleErrors({ ...roleErrors, title: null });
                      }}
                      autoFocus
                      required
                    />
                    {roleErrors.title && <span className="admin-field-error">{roleErrors.title}</span>}
                  </div>

                  <div className="admin-form-field admin-col-8">
                    <label className="admin-label">
                      Dates / Timeline <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${roleErrors.dates ? 'error' : ''}`}
                      placeholder="e.g. 2024 — Present or 2023 — 2024"
                      value={roleForm.dates}
                      onChange={(e) => {
                        setRoleForm({ ...roleForm, dates: e.target.value });
                        if (roleErrors.dates) setRoleErrors({ ...roleErrors, dates: null });
                      }}
                      required
                    />
                    {roleErrors.dates && <span className="admin-field-error">{roleErrors.dates}</span>}
                  </div>

                  <div className="admin-form-field admin-col-4">
                    <label className="admin-label">Sort Order</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={roleForm.sortOrder}
                      onChange={(e) => setRoleForm({ ...roleForm, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>

                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Role Overview / Description</label>
                    <textarea
                      className="admin-textarea"
                      rows="3"
                      placeholder="Summary of responsibilities and scope of the role..."
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    />
                  </div>
                </div>
              </fieldset>

              {/* Highlights */}
              <fieldset className="admin-fieldset">
                <legend className="admin-legend">2. Key Highlights &amp; Contributions</legend>
                <div className="admin-form-grid">
                  <div className="admin-form-field admin-col-12">
                    {roleForm.highlights.length > 0 && (
                      <div className="admin-tags-container">
                        {roleForm.highlights.map((h, i) => (
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
                        placeholder="Type an achievement (e.g. Led event planning) and press Enter or Add..."
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
                </div>
              </fieldset>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={() => {
                    setRoleModalMode(null);
                    setEditingRole(null);
                  }}
                  disabled={savingRole}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={savingRole}>
                  {savingRole ? 'Saving...' : roleModalMode === 'add' ? 'Add Role' : 'Save Changes'}
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
              Delete {deleteTarget.type === 'org' ? 'Organization' : 'Role'}?
            </h3>
            <p className="admin-confirm-message">
              {deleteTarget.type === 'org' ? (
                <>
                  Are you sure you want to delete <strong>&ldquo;{deleteTarget.item.org}&rdquo;</strong> and all of its associated roles?
                </>
              ) : (
                <>
                  Are you sure you want to delete the role <strong>&ldquo;{deleteTarget.item.title}&rdquo;</strong>?
                </>
              )}
            </p>
            <p className="admin-confirm-sub">
              {deleteTarget.type === 'org'
                ? 'This will remove the organization and all its nested roles from the Turso database and public portfolio views. This action cannot be undone.'
                : 'This will remove the role position from this organization. This action cannot be undone.'}
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

