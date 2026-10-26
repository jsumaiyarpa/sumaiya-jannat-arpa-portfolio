import { Routes, Route } from 'react-router-dom';
import { Layout } from './components.jsx';
import { Home, Work, Project, About, Skills, Experience, Education, Achievements, Gallery, Resume, Contact } from './pages.jsx';

export default function App() {
  return (
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
  );
}
