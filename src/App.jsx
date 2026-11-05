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

export default function App() {
  return (
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
  );
}
