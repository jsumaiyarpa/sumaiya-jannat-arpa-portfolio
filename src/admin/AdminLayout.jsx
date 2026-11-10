import { useState } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { adminApi } from './adminApi.js';
import './admin.css';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const getPageInfo = () => {
    if (location.pathname.startsWith('/admin/projects')) return { label: 'CONTENT MANAGEMENT', title: 'Projects Management' };
    if (location.pathname.startsWith('/admin/skills')) return { label: 'CONTENT MANAGEMENT', title: 'Skills Management' };
    if (location.pathname.startsWith('/admin/experience')) return { label: 'CONTENT MANAGEMENT', title: 'Experience Management' };
    if (location.pathname.startsWith('/admin/education')) return { label: 'CONTENT MANAGEMENT', title: 'Education Management' };
    if (location.pathname.startsWith('/admin/certificates')) return { label: 'CONTENT MANAGEMENT', title: 'Certificates Management' };
    if (location.pathname.startsWith('/admin/reviews')) return { label: 'CONTENT MANAGEMENT', title: 'Reviews Management' };
    return { label: 'ADMINISTRATION', title: 'Portfolio Dashboard' };
  };

  const pageInfo = getPageInfo();

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
          <NavLink
            to="/admin/projects"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span className="admin-nav-icon" aria-hidden="true">💼</span>
            <span>Projects</span>
          </NavLink>

          <NavLink
            to="/admin/skills"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span className="admin-nav-icon" aria-hidden="true">⚡</span>
            <span>Skills</span>
          </NavLink>

          <NavLink
            to="/admin/experience"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span className="admin-nav-icon" aria-hidden="true">🏢</span>
            <span>Experience</span>
          </NavLink>

          <NavLink
            to="/admin/education"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span className="admin-nav-icon" aria-hidden="true">🎓</span>
            <span>Education</span>
          </NavLink>

          <NavLink
            to="/admin/certificates"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span className="admin-nav-icon" aria-hidden="true">📜</span>
            <span>Certificates</span>
          </NavLink>

          <NavLink
            to="/admin/reviews"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span className="admin-nav-icon" aria-hidden="true">💬</span>
            <span>Reviews</span>
          </NavLink>
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
              <span className="admin-topbar-label">{pageInfo.label}</span>
              <h2 className="admin-topbar-title">{pageInfo.title}</h2>
            </div>
          </div>

          <div className="admin-topbar-right">
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
