import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components.jsx';
import {
  Home,
  Work,
  Project,
  About,
  Skills,
  Experience,
  Education,
  Achievements,
  Gallery,
  Resume,
  Contact,
} from './pages.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import AdminProtectedRoute from './admin/AdminProtectedRoute.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import AdminProjects from './admin/AdminProjects.jsx';
import AdminSkills from './admin/AdminSkills.jsx';
import AdminExperience from './admin/AdminExperience.jsx';
import AdminEducation from './admin/AdminEducation.jsx';
import AdminCertificates from './admin/AdminCertificates.jsx';
import AdminReviews from './admin/AdminReviews.jsx';
import { ProjectsProvider } from './context/ProjectsContext.jsx';
import { PortfolioDataProvider } from './context/PortfolioDataContext.jsx';

export default function App() {
  return (
    <PortfolioDataProvider>
      <ProjectsProvider>
        <Routes>
          {/* Admin Login Route (standalone, independent of public Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Dashboard Route (wrapped in AdminLayout, independent of public Layout) */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* Admin Protected Projects Management Route */}
          <Route
            path="/admin/projects"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminProjects />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* Admin Protected Skills Management Route */}
          <Route
            path="/admin/skills"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminSkills />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* Admin Protected Experience Management Route */}
          <Route
            path="/admin/experience"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminExperience />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* Admin Protected Education Management Route */}
          <Route
            path="/admin/education"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminEducation />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* Admin Protected Certificates Management Route */}
          <Route
            path="/admin/certificates"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminCertificates />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* Admin Protected Reviews Management Route */}
          <Route
            path="/admin/reviews"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminReviews />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* Public Portfolio Routes (wrapped in public Layout) */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/work" element={<Work />} />
                  <Route path="/work/:slug" element={<Project />} />
                  <Route path="/about" element={<Navigate to={{ pathname: '/', hash: '#about' }} replace state={{ scrollTo: 'about' }} />} />
                  <Route path="/skills" element={<Navigate to={{ pathname: '/', hash: '#skills' }} replace state={{ scrollTo: 'skills' }} />} />
                  <Route path="/experience" element={<Navigate to={{ pathname: '/', hash: '#experience' }} replace state={{ scrollTo: 'experience' }} />} />
                  <Route path="/education" element={<Navigate to={{ pathname: '/', hash: '#education' }} replace state={{ scrollTo: 'education' }} />} />
                  <Route path="/achievements" element={<Navigate to={{ pathname: '/', hash: '#education' }} replace state={{ scrollTo: 'education' }} />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/contact" element={<Navigate to={{ pathname: '/', hash: '#contact' }} replace state={{ scrollTo: 'contact' }} />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </ProjectsProvider>
    </PortfolioDataProvider>
  );
}
