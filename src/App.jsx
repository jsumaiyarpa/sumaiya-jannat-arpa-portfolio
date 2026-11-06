import { Routes, Route } from 'react-router-dom';
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
                  <Route path="/about" element={<About />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/experience" element={<Experience />} />
                  <Route path="/education" element={<Education />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/contact" element={<Contact />} />
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
