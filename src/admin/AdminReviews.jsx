import { useState, useEffect, useMemo } from 'react';
import { adminApi } from './adminApi.js';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import './admin.css';

export default function AdminReviews() {
  const { refreshAll } = usePortfolioData();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingReview, setEditingReview] = useState(null);
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
      reviewerName: '',
      role: '',
      organization: '',
      reviewText: '',
      photo: '',
      sortOrder: 1,
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
      const res = await adminApi('/api/admin/reviews');
      setReviews(res.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError(err.message || 'Failed to connect to database.');
    } finally {
      setLoading(false);
    }
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const q = search.toLowerCase();
      const name = (rev.reviewerName || rev.author || rev.name || '').toLowerCase();
      const role = (rev.role || '').toLowerCase();
      const org = (rev.organization || '').toLowerCase();
      const quote = (rev.quote || rev.testimonial || '').toLowerCase();

      const matchSearch =
        !search ||
        name.includes(q) ||
        role.includes(q) ||
        org.includes(q) ||
        quote.includes(q);

      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'published' && rev.isPublished) ||
        (filterStatus === 'draft' && !rev.isPublished);

      return matchSearch && matchStatus;
    });
  }, [reviews, search, filterStatus]);

  function handleOpenAdd() {
    setModalMode('add');
    setEditingReview(null);
    const nextOrder =
      reviews.length > 0
        ? Math.max(...reviews.map((r) => r.sortOrder ?? r.sort_order ?? 0)) + 1
        : 1;
    setFormData({
      ...getInitialForm(),
      sortOrder: nextOrder,
    });
    setFormErrors({});
  }

  function handleOpenEdit(rev) {
    setModalMode('edit');
    setEditingReview(rev);
    setFormData({
      reviewerName: rev.reviewerName || rev.author || rev.name || '',
      role: rev.role || '',
      organization: rev.organization || '',
      reviewText: rev.quote || rev.testimonial || '',
      photo: rev.image || rev.avatar || rev.photo || '',
      sortOrder: rev.sortOrder ?? rev.sort_order ?? 0,
      isPublished: Boolean(rev.isPublished),
    });
    setFormErrors({});
  }

  function handleCloseModal() {
    setModalMode(null);
    setEditingReview(null);
    setFormErrors({});
  }

  function validateForm() {
    const errors = {};
    if (!formData.reviewerName.trim()) {
      errors.reviewerName = 'Reviewer name is required.';
    }
    if (!formData.reviewText.trim()) {
      errors.reviewText = 'Review text is required.';
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
        const res = await adminApi('/api/admin/reviews', {
          method: 'POST',
          body: formData,
        });
        setReviews((prev) => [...prev, res.review]);
        showToast(`Review from "${res.review.reviewerName}" added.`);
      } else {
        const res = await adminApi(`/api/admin/reviews/${editingReview.id}`, {
          method: 'PUT',
          body: formData,
        });
        setReviews((prev) => prev.map((r) => (r.id === editingReview.id ? res.review : r)));
        showToast(`Review from "${res.review.reviewerName}" updated.`);
      }
      handleCloseModal();
      refreshAll?.();
    } catch (err) {
      console.error('Failed to save review:', err);
      showToast(err.message || 'Failed to save review.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(rev) {
    try {
      setTogglingId(rev.id);
      const updatedStatus = !rev.isPublished;
      const res = await adminApi(`/api/admin/reviews/${rev.id}/publish`, {
        method: 'PATCH',
        body: { isPublished: updatedStatus },
      });
      setReviews((prev) => prev.map((r) => (r.id === rev.id ? res.review : r)));
      showToast(`Review is now ${updatedStatus ? 'Published' : 'Draft'}.`);
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
      await adminApi(`/api/admin/reviews/${deleteTarget.id}`, { method: 'DELETE' });
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast(`Review from "${deleteTarget.reviewerName || deleteTarget.author}" deleted.`);
      setDeleteTarget(null);
      refreshAll?.();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.message || 'Failed to delete review.', 'error');
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
          <h1 className="admin-projects-title">Reviews &amp; Endorsements</h1>
          <p className="admin-projects-subtitle">
            Manage peer testimonials, mentor recommendations, and colleague endorsements displayed on the portfolio.
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
            <span>Add Review</span>
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
            placeholder="Search by reviewer, role, organization, or quote..."
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
            <label htmlFor="revStatusFilter" className="admin-filter-label">
              Status:
            </label>
            <select
              id="revStatusFilter"
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
          Showing <strong>{filteredReviews.length}</strong> of{' '}
          <strong>{reviews.length}</strong>
        </div>
      </div>

      {/* Main Content: Loading, Error, Empty, or Table */}
      {loading ? (
        <div className="admin-state-container">
          <div className="admin-loading-spinner" />
          <p className="admin-state-message">Fetching reviews from Turso database...</p>
        </div>
      ) : error ? (
        <div className="admin-state-container admin-error-box">
          <span className="admin-state-icon" aria-hidden="true">⚠</span>
          <h3 className="admin-error-title">Unable to load reviews</h3>
          <p className="admin-state-error">{error}</p>
          <button type="button" className="admin-retry-button" onClick={loadData}>
            ↻ Try Again
          </button>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="admin-empty-state">
          <span className="admin-empty-icon" aria-hidden="true">💬</span>
          <h3>No Reviews Match Filters</h3>
          <p>
            {search || filterStatus !== 'all'
              ? 'Try clearing your search query or choosing another status filter.'
              : 'No reviews exist yet in the database. Click "+ Add Review" to create your first.'}
          </p>
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
                <th className="admin-th-order">#</th>
                <th className="admin-th-reviewer">Reviewer</th>
                <th className="admin-th-role">Role &amp; Organization</th>
                <th>Review Quote</th>
                <th className="admin-th-center">Status</th>
                <th className="admin-td-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((rev) => {
                const isToggling = togglingId === rev.id;
                const reviewerName = rev.reviewerName || rev.author || rev.name || 'Anonymous';
                const quote = rev.quote || rev.testimonial || '';
                const role = rev.role || 'Peer Collaborator';
                const org = rev.organization || '';
                const image = rev.image || rev.avatar || rev.photo || '';
                const sortOrder = rev.sortOrder ?? rev.sort_order ?? 0;

                return (
                  <tr key={rev.id} className={!rev.isPublished ? 'admin-row-draft' : ''}>
                    {/* Display Order */}
                    <td>
                      <span className="admin-order-chip">#{sortOrder}</span>
                    </td>

                    {/* Reviewer Avatar + Name */}
                    <td>
                      <div className="admin-review-reviewer-cell">
                        <div className="admin-review-avatar-frame">
                          {image ? (
                            <img
                              src={image}
                              alt={reviewerName}
                              className="admin-review-avatar-img"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="admin-review-avatar-fallback">
                              {reviewerName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="admin-review-author-meta">
                          <span className="admin-review-name-text">{reviewerName}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Organization */}
                    <td>
                      <div className="admin-review-author-meta">
                        <span className="admin-review-role-badge">{role}</span>
                        {org && (
                          <span className="admin-review-org-tag">
                            <code>{org}</code>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Review Quote */}
                    <td>
                      <p className="admin-review-quote-preview" title={quote}>
                        “{quote}”
                      </p>
                    </td>

                    {/* Publish Status Toggle */}
                    <td className="admin-td-center">
                      <button
                        type="button"
                        className={`admin-status-toggle ${
                          rev.isPublished ? 'is-published' : 'is-draft'
                        }`}
                        onClick={() => handleTogglePublish(rev)}
                        disabled={isToggling}
                        title={`Click to ${rev.isPublished ? 'unpublish' : 'publish'}`}
                      >
                        <span className="admin-toggle-dot" />
                        <span>
                          {isToggling ? '...' : rev.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="admin-td-actions">
                      <button
                        type="button"
                        className="admin-action-btn admin-action-view"
                        onClick={() => handleOpenEdit(rev)}
                        title="Edit review"
                        aria-label="Edit review"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-action-delete"
                        onClick={() => setDeleteTarget(rev)}
                        title="Delete review"
                        aria-label="Delete review"
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

      {/* Add / Edit Review Modal Window */}
      {modalMode && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="admin-modal-window admin-modal-simplified"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="revModalTitle"
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-eyebrow">
                  {modalMode === 'add' ? 'NEW ENDORSEMENT' : 'EDIT ENDORSEMENT'}
                </span>
                <h2 id="revModalTitle" className="admin-modal-title">
                  {modalMode === 'add' ? 'Add Review' : 'Edit Review'}
                </h2>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={handleCloseModal}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-form">
              <div className="admin-form-grid">
                {/* Reviewer Name */}
                <div className="admin-form-field admin-col-8">
                  <label htmlFor="revName" className="admin-label">
                    Reviewer Name <span className="admin-required">*</span>
                  </label>
                  <input
                    id="revName"
                    type="text"
                    className={`admin-input ${formErrors.reviewerName ? 'error' : ''}`}
                    placeholder="e.g. Rafid Hasan"
                    value={formData.reviewerName}
                    onChange={(e) =>
                      setFormData({ ...formData, reviewerName: e.target.value })
                    }
                  />
                  {formErrors.reviewerName && (
                    <span className="admin-field-error">{formErrors.reviewerName}</span>
                  )}
                </div>

                {/* Display Order */}
                <div className="admin-form-field admin-col-4">
                  <label htmlFor="revOrder" className="admin-label">
                    Display Order
                  </label>
                  <input
                    id="revOrder"
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

                {/* Role / Designation */}
                <div className="admin-form-field admin-col-6">
                  <label htmlFor="revRole" className="admin-label">
                    Role / Designation
                  </label>
                  <input
                    id="revRole"
                    type="text"
                    className="admin-input"
                    placeholder="e.g. VP of IT · Ostad Cohort Lead"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  />
                </div>

                {/* Organization */}
                <div className="admin-form-field admin-col-6">
                  <label htmlFor="revOrg" className="admin-label">
                    Organization / Company
                  </label>
                  <input
                    id="revOrg"
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Ostad, BRAC University"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                  />
                </div>

                {/* Reviewer Photo URL */}
                <div className="admin-form-field admin-col-12">
                  <label htmlFor="revPhoto" className="admin-label">
                    Reviewer Photo URL (Optional)
                  </label>
                  <input
                    id="revPhoto"
                    type="text"
                    className="admin-input"
                    placeholder="e.g. /images/reviews/rafid-hasan.jpeg"
                    value={formData.photo}
                    onChange={(e) =>
                      setFormData({ ...formData, photo: e.target.value })
                    }
                  />
                  <span className="admin-field-hint">
                    Path in /public/images/reviews/ or an external image URL. Leave blank to display initials avatar.
                  </span>
                </div>

                {/* Review Text */}
                <div className="admin-form-field admin-col-12">
                  <label htmlFor="revText" className="admin-label">
                    Review Text <span className="admin-required">*</span>
                  </label>
                  <textarea
                    id="revText"
                    rows={5}
                    className={`admin-textarea ${formErrors.reviewText ? 'error' : ''}`}
                    placeholder="The complete, authentic endorsement quote..."
                    value={formData.reviewText}
                    onChange={(e) =>
                      setFormData({ ...formData, reviewText: e.target.value })
                    }
                  />
                  {formErrors.reviewText && (
                    <span className="admin-field-error">{formErrors.reviewText}</span>
                  )}
                </div>

                {/* Publish Checkbox */}
                <div className="admin-form-field admin-col-12">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({ ...formData, isPublished: e.target.checked })
                      }
                    />
                    <span>Publish immediately on public portfolio</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
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
                    ? 'Create Review'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Window */}
      {deleteTarget && (
        <div
          className="admin-modal-backdrop"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="admin-modal-window admin-modal-confirm"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <span className="admin-confirm-icon">🗑</span>
            <h3 className="admin-confirm-title">Delete Review?</h3>
            <p className="admin-confirm-message">
              Are you sure you want to permanently delete the review from{' '}
              <strong>
                "{deleteTarget.reviewerName || deleteTarget.author || deleteTarget.name}"
              </strong>
              ?
            </p>
            <p className="admin-confirm-sub">
              This action will remove the record directly from your Turso database and cannot be undone.
            </p>
            <div className="admin-confirm-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
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
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
