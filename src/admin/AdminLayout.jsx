import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../components.jsx';
import { adminApi } from './adminApi.js';
import './admin.css';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    try {
      setSigningOut(true);
      await adminApi('/api/auth/logout', { method: 'POST' });
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/admin/login', { replace: true });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="admin-shell">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <span className="admin-brand-mark">SJA.</span>
          <div className="admin-brand-text">
            <strong>ARPA</strong>
            <span>PORTFOLIO ADMIN</span>
          </div>
        </div>

        <nav className="admin-navigation" aria-label="Admin navigation">
          <span className="admin-nav-label">WORKSPACE</span>

          <NavLink
            to="/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span className="admin-nav-icon" aria-hidden="true">▦</span>
            <span>Dashboard</span>
          </NavLink>

          <span className="admin-nav-label">CONTENT MANAGEMENT</span>
          <div className="admin-nav-coming-soon">
            <span>Portfolio Sections</span>
            <span className="admin-tag-pill">Read Only</span>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <Link
            to="/"
            className="admin-public-link"
            title="Open public portfolio"
          >
            <span aria-hidden="true">↗</span>
            <span>View Public Site</span>
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
            disabled={signingOut}
          >
            <span aria-hidden="true">↪</span>
            <span>{signingOut ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="admin-burger-bar" />
              <span className="admin-burger-bar" />
              <span className="admin-burger-bar" />
            </button>

            <div>
              <span className="admin-topbar-label">ADMINISTRATION</span>
              <h2 className="admin-topbar-title">Portfolio Dashboard</h2>
            </div>
          </div>

          <div className="admin-topbar-right">
            <ThemeToggle />
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
