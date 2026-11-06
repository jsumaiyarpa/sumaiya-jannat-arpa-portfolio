import { useState, useEffect, useMemo } from 'react';
import { adminApi } from './adminApi.js';
import './admin.css';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal & Form State
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(getInitialForm());
  const [toolInput, setToolInput] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Quick Action State
  const [togglingSlug, setTogglingSlug] = useState(null);

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  function showToast(message, type = 'success') {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 4000);
  }

  function getInitialForm() {
    return {
      title: '',
      category: 'software',
      summary: '',
      cover: '',
      role: '',
      tools: [],
      link: '',
      repo: '',
      featured: false,
      isPublished: true,
    };
  }

  // Fetch projects and categories on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [projRes, catRes] = await Promise.all([
        adminApi('/api/admin/projects'),
        adminApi('/api/admin/project-categories'),
      ]);
      setProjects(projRes.projects || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      console.error('Failed to load admin projects data:', err);
      setError(err.message || 'Failed to connect to database.');
    } finally {
      setLoading(false);
    }
  }

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        (p.summary && p.summary.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = filterCategory === 'all' || p.category === filterCategory;

      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'published' && p.isPublished) ||
        (filterStatus === 'draft' && !p.isPublished);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [projects, search, filterCategory, filterStatus]);

  // Open Add Modal
  function handleOpenAdd() {
    setModalMode('add');
    setEditingProject(null);
    setFormData(getInitialForm());
    setToolInput('');
    setFormErrors({});
  }

  // Open Edit Modal
  function handleOpenEdit(project) {
    setModalMode('edit');
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      category: project.category || 'software',
      summary: project.summary || '',
      cover: project.cover || '',
      role: project.role || '',
      tools: Array.isArray(project.tools) ? [...project.tools] : [],
      link: project.link || '',
      repo: project.repo || '',
      featured: Boolean(project.featured),
      isPublished: Boolean(project.isPublished),
    });
    setToolInput('');
    setFormErrors({});
  }

  // Slug generator helper
  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Ensure slug uniqueness
  function generateUniqueSlug(title, existingProjects = []) {
    let base = slugify(title);
    if (!base) base = 'project';
    let candidate = base;
    let counter = 2;
    const existingSlugs = new Set(existingProjects.map((p) => p.slug));
    while (existingSlugs.has(candidate)) {
      candidate = `${base}-${counter}`;
      counter++;
    }
    return candidate;
  }

  // Tool tag helpers
  function handleAddTool(e) {
    if (e) e.preventDefault();
    const trimmed = toolInput.trim();
    if (trimmed && !formData.tools.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tools: [...prev.tools, trimmed],
      }));
      setToolInput('');
    }
  }

  function handleRemoveTool(toolToRemove) {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t !== toolToRemove),
    }));
  }

  // Form Validation (simplified: only Project Name, Category, and Short Description are required)
  function validateForm() {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Project name is required.';
    }
    if (!formData.category) {
      errors.category = 'Category is required.';
    }
    if (!formData.summary.trim()) {
      errors.summary = 'Short description is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Submit Add or Edit
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);

      if (modalMode === 'add') {
        const autoSlug = generateUniqueSlug(formData.title, projects);
        const nextOrderNum = String(projects.length + 1).padStart(2, '0');
        const maxSort = projects.reduce((max, p) => Math.max(max, Number(p.sortOrder) || 0), 0);
        const nextSortOrder = maxSort + 1;
        const autoCoverAlt = formData.title.trim() ? `${formData.title.trim()} preview` : '';

        const payload = {
          title: formData.title.trim(),
          slug: autoSlug,
          category: formData.category,
          summary: formData.summary.trim(),
          cover: formData.cover.trim(),
          coverAlt: autoCoverAlt,
          role: formData.role.trim(),
          tools: formData.tools,
          link: formData.link.trim(),
          repo: formData.repo.trim(),
          featured: formData.featured,
          isPublished: formData.isPublished,
          orderNum: nextOrderNum,
          sortOrder: nextSortOrder,
          aspectRatio: '16/10',
          layoutSpan: 'col-span-1',
          status: 'completed',
          timeline: new Date().getFullYear().toString(),
        };

        const res = await adminApi('/api/admin/projects', {
          method: 'POST',
          body: payload,
        });
        setProjects((prev) => [res.project, ...prev]);
        showToast(`Project "${res.project.title}" created successfully.`);
      } else {
        // Edit mode: preserve existing slug and all hidden technical fields
        const existing = editingProject || {};
        const preserveCoverAlt = existing.coverAlt || (formData.title.trim() ? `${formData.title.trim()} preview` : '');

        const payload = {
          title: formData.title.trim(),
          slug: existing.slug, // Preserve existing slug/URL even if project title changes
          category: formData.category,
          summary: formData.summary.trim(),
          cover: formData.cover.trim(),
          coverAlt: preserveCoverAlt,
          role: formData.role.trim(),
          tools: formData.tools,
          link: formData.link.trim(),
          repo: formData.repo.trim(),
          featured: formData.featured,
          isPublished: formData.isPublished,
          // Preserved hidden fields to prevent accidental overwrites:
          orderNum: existing.orderNum || '',
          sortOrder: Number(existing.sortOrder) || 0,
          aspectRatio: existing.aspectRatio || '16/10',
          layoutSpan: existing.layoutSpan || 'col-span-1',
          status: existing.status || 'completed',
          timeline: existing.timeline || new Date().getFullYear().toString(),
          sections: existing.sections || {},
          evidence: existing.evidence || [],
        };

        const res = await adminApi(`/api/admin/projects/${existing.slug}`, {
          method: 'PUT',
          body: payload,
        });
        setProjects((prev) => prev.map((p) => (p.slug === existing.slug ? res.project : p)));
        showToast(`Project "${res.project.title}" updated successfully.`);
      }

      setModalMode(null);
    } catch (err) {
      console.error('Failed to save project:', err);
      setFormErrors((prev) => ({
        ...prev,
        submit: err.message || 'Failed to save project changes.',
      }));
    } finally {
      setSaving(false);
    }
  }

  // Instant Publish/Unpublish Toggle
  async function handleTogglePublish(project) {
    const targetSlug = project.slug;
    const nextState = !project.isPublished;

    try {
      setTogglingSlug(targetSlug);
      // Optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.slug === targetSlug ? { ...p, isPublished: nextState } : p))
      );

      const res = await adminApi(`/api/admin/projects/${targetSlug}/publish`, {
        method: 'PATCH',
        body: { isPublished: nextState },
      });

      // Confirm with server response
      setProjects((prev) =>
        prev.map((p) => (p.slug === targetSlug ? { ...p, isPublished: res.isPublished } : p))
      );
      showToast(
        `Project "${project.title}" ${nextState ? 'published' : 'unpublished'} successfully.`
      );
    } catch (err) {
      console.error('Publish toggle failed:', err);
      // Revert optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.slug === targetSlug ? { ...p, isPublished: !nextState } : p))
      );
      showToast(`Failed to update publication status: ${err.message}`, 'error');
    } finally {
      setTogglingSlug(null);
    }
  }

  // Delete Action
  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await adminApi(`/api/admin/projects/${deleteTarget.slug}`, {
        method: 'DELETE',
      });

      setProjects((prev) => prev.filter((p) => p.slug !== deleteTarget.slug));
      showToast(`Project "${deleteTarget.title}" permanently deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
      showToast(`Failed to delete project: ${err.message}`, 'error');
    } finally {
      setDeleting(false);
    }
  }

  // Category label helper
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c.id] = c.label;
    });
    return map;
  }, [categories]);

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
          <h1 className="admin-projects-title">Projects Directory</h1>
          <p className="admin-projects-subtitle">
            Synchronized directly with the Turso LibSQL database and public portfolio views.
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
            <span>Add Project</span>
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
            placeholder="Search by title, slug, or summary..."
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
            <label htmlFor="categoryFilter" className="admin-filter-label">
              Category:
            </label>
            <select
              id="categoryFilter"
              className="admin-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-select-wrap">
            <label htmlFor="statusFilter" className="admin-filter-label">
              Status:
            </label>
            <select
              id="statusFilter"
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
          Showing <strong>{filteredProjects.length}</strong> of{' '}
          <strong>{projects.length}</strong>
        </div>
      </div>

      {/* Main Content: Loading, Error, or Table */}
      {loading ? (
        <div className="admin-state-container">
          <div className="admin-loading-spinner" />
          <p className="admin-state-message">Fetching projects from Turso database...</p>
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
      ) : filteredProjects.length === 0 ? (
        <div className="admin-empty-state">
          <span className="admin-empty-icon">📁</span>
          <h3>No Projects Match Filters</h3>
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
                <th style={{ width: '4rem' }}>Cover</th>
                <th>Title &amp; Slug</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Featured</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Sort</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => {
                const isToggling = togglingSlug === p.slug;
                return (
                  <tr key={p.slug} className={!p.isPublished ? 'admin-row-draft' : ''}>
                    {/* Cover Thumbnail */}
                    <td className="admin-td-cover">
                      {p.cover ? (
                        <img
                          src={p.cover}
                          alt={p.coverAlt || p.title}
                          className="admin-project-thumb"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="admin-project-thumb-placeholder">
                          <span>{p.orderNum || '✦'}</span>
                        </div>
                      )}
                    </td>

                    {/* Title & Slug */}
                    <td className="admin-td-title">
                      <div className="admin-title-line">
                        <span className="admin-project-name">{p.title}</span>
                        {p.orderNum && (
                          <span className="admin-order-chip">#{p.orderNum}</span>
                        )}
                      </div>
                      <div className="admin-slug-line">
                        <code>/work/{p.slug}</code>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className={`admin-cat-pill admin-cat-${p.category}`}>
                        {categoryMap[p.category] || p.category}
                      </span>
                    </td>

                    {/* Featured */}
                    <td style={{ textAlign: 'center' }}>
                      {p.featured ? (
                        <span className="admin-star-featured" title="Featured on Showcase">
                          ★
                        </span>
                      ) : (
                        <span className="admin-star-muted" title="Standard">
                          ☆
                        </span>
                      )}
                    </td>

                    {/* Publication Status Toggle */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`admin-status-toggle ${p.isPublished ? 'is-published' : 'is-draft'}`}
                        onClick={() => handleTogglePublish(p)}
                        disabled={isToggling}
                        title={
                          p.isPublished
                            ? 'Published — Click to make Draft'
                            : 'Draft — Click to Publish'
                        }
                      >
                        <span className="admin-toggle-dot" />
                        <span>{isToggling ? '...' : p.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Sort Order */}
                    <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>
                      {p.sortOrder}
                    </td>

                    {/* Actions */}
                    <td className="admin-td-actions">
                      <a
                        href={`#/work/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-action-btn admin-action-view"
                        title="View Public Project"
                      >
                        ↗
                      </a>
                      <button
                        type="button"
                        className="admin-action-btn admin-action-edit"
                        onClick={() => handleOpenEdit(p)}
                        title="Edit Project"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-action-delete"
                        onClick={() => setDeleteTarget(p)}
                        title="Delete Project"
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

      {/* =====================================================================
          ADD / EDIT PROJECT MODAL (SIMPLIFIED)
          ===================================================================== */}
      {modalMode && (
        <div className="admin-modal-backdrop" onClick={() => !saving && setModalMode(null)}>
          <div
            className="admin-modal-window admin-modal-simplified"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-heading"
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-eyebrow">
                  {modalMode === 'add' ? 'NEW PROJECT' : 'EDIT PROJECT'}
                </span>
                <h2 id="modal-heading" className="admin-modal-title">
                  {modalMode === 'add' ? 'Add New Project' : `Edit: ${editingProject?.title || formData.title}`}
                </h2>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => !saving && setModalMode(null)}
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
                <legend className="admin-legend">1. Basic Information</legend>
                <div className="admin-form-grid">
                  <div className="admin-form-field admin-col-8">
                    <label className="admin-label">
                      Project Name <span className="admin-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`admin-input ${formErrors.title ? 'error' : ''}`}
                      placeholder="e.g. HealthCare Connect"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      required
                    />
                    {formErrors.title && (
                      <span className="admin-field-error">{formErrors.title}</span>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-4">
                    <label className="admin-label">
                      Category <span className="admin-required">*</span>
                    </label>
                    <select
                      className="admin-input"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, category: e.target.value }))
                      }
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">
                      Short Description <span className="admin-required">*</span>
                    </label>
                    <textarea
                      className={`admin-textarea ${formErrors.summary ? 'error' : ''}`}
                      rows="3"
                      placeholder="Brief overview of what this project does and why it was built..."
                      value={formData.summary}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, summary: e.target.value }))
                      }
                      required
                    />
                    {formErrors.summary && (
                      <span className="admin-field-error">{formErrors.summary}</span>
                    )}
                  </div>

                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Project Image (Optional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. /images/projects/website/my-app.png or https://..."
                      value={formData.cover}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, cover: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </fieldset>

              {/* 2. Project Details */}
              <fieldset className="admin-fieldset">
                <legend className="admin-legend">2. Project Details</legend>
                <div className="admin-form-grid">
                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Your Role (Optional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Full-Stack Developer &amp; UI/UX Designer"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, role: e.target.value }))
                      }
                    />
                  </div>

                  {/* Interactive Tools Tags */}
                  <div className="admin-form-field admin-col-12">
                    <label className="admin-label">Technologies &amp; Tools (Optional)</label>
                    {formData.tools.length > 0 && (
                      <div className="admin-tags-container">
                        {formData.tools.map((t) => (
                          <span key={t} className="admin-tag-pill admin-tool-tag">
                            <span>{t}</span>
                            <button
                              type="button"
                              className="admin-tag-remove"
                              onClick={() => handleRemoveTool(t)}
                              aria-label={`Remove ${t}`}
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
                        placeholder="Type tool (e.g. React, Tailwind, Figma) and press Enter or Add..."
                        value={toolInput}
                        onChange={(e) => setToolInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTool();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={handleAddTool}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">Live Project Link (Optional)</label>
                    <input
                      type="url"
                      className="admin-input"
                      placeholder="https://..."
                      value={formData.link}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, link: e.target.value }))
                      }
                    />
                  </div>

                  <div className="admin-form-field admin-col-6">
                    <label className="admin-label">GitHub Repository Link (Optional)</label>
                    <input
                      type="url"
                      className="admin-input"
                      placeholder="https://github.com/username/repository"
                      value={formData.repo}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, repo: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </fieldset>

              {/* 3. Visibility Controls */}
              <div className="admin-visibility-box">
                <div className="admin-visibility-item">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                      }
                    />
                    <span>Featured Project</span>
                  </label>
                  <span className="admin-visibility-hint">Highlight on the featured carousel and showcase</span>
                </div>

                <div className="admin-visibility-item">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                      }
                    />
                    <span>Publish Project</span>
                  </label>
                  <span className="admin-visibility-hint">Make visible on the public portfolio</span>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  onClick={() => setModalMode(null)}
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
                    ? 'Add Project'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          DELETE CONFIRMATION DIALOG
          ===================================================================== */}
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
              Delete Project Permanently?
            </h3>
            <p className="admin-confirm-message">
              Are you sure you want to delete <strong>&ldquo;{deleteTarget.title}&rdquo;</strong> (
              <code>{deleteTarget.slug}</code>)?
            </p>
            <p className="admin-confirm-sub">
              This will remove the project from the Turso database and all public portfolio views.
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
