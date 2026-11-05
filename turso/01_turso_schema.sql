-- ============================================================================
-- SCRIPT: 01_turso_schema.sql
-- Project: Arpa Portfolio Admin Panel
-- Engine: Turso (libSQL / SQLite)
-- Description: Creates all 16 tables with SQLite constraints, types, indexes & triggers.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 01. ADMIN USERS TABLE (Backend Authentication)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  last_login TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 02. ADMIN SESSIONS TABLE (Stateful Server Session Storage & Revocation)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  last_active_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 03. SITE SETTINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'Sumaiya Jannat Arpa',
  short_name TEXT NOT NULL DEFAULT 'Arpa',
  monogram TEXT NOT NULL DEFAULT 'SJA.',
  eyebrow TEXT NOT NULL DEFAULT 'SOFTWARE ENGINEERING × UI/UX × SQA',
  headline TEXT NOT NULL,
  intro TEXT NOT NULL,
  institution TEXT NOT NULL,
  department TEXT NOT NULL,
  major TEXT NOT NULL,
  admission TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates TEXT NOT NULL,
  email TEXT NOT NULL,
  portrait_url TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  resume_filename TEXT NOT NULL,
  resume_updated_at TEXT NOT NULL,
  nav_items TEXT NOT NULL DEFAULT '[]',
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 04. PROFILE & ABOUT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile_about (
  id TEXT PRIMARY KEY,
  heading TEXT NOT NULL,
  subheading TEXT NOT NULL,
  bio_paragraphs TEXT NOT NULL DEFAULT '[]',
  disciplines TEXT NOT NULL DEFAULT '[]',
  personal_interests TEXT NOT NULL DEFAULT '[]',
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 05. EDUCATION
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
  id TEXT PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  major TEXT,
  dates TEXT NOT NULL,
  status TEXT,
  location TEXT,
  gpa TEXT,
  stage_tag TEXT,
  details TEXT,
  highlights TEXT NOT NULL DEFAULT '[]',
  coursework TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 06. EXPERIENCE (ORGANIZATIONS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experience (
  id TEXT PRIMARY KEY,
  org TEXT NOT NULL,
  full_name TEXT NOT NULL,
  location TEXT NOT NULL,
  org_type TEXT NOT NULL,
  is_current INTEGER NOT NULL DEFAULT 0 CHECK (is_current IN (0, 1)),
  logo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 07. EXPERIENCE ROLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experience_roles (
  id TEXT PRIMARY KEY,
  experience_id TEXT NOT NULL REFERENCES experience(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  dates TEXT NOT NULL,
  description TEXT,
  highlights TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 08. SKILL CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  blurb TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 09. SKILLS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 10. PROJECT CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_categories (
  id TEXT PRIMARY KEY,
  code TEXT,
  label TEXT NOT NULL,
  tag TEXT,
  blurb TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 11. PROJECTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  order_num TEXT,
  category_id TEXT REFERENCES project_categories(id) ON DELETE SET NULL,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  layout_span TEXT NOT NULL DEFAULT 'col-span-1',
  status TEXT NOT NULL DEFAULT 'completed',
  summary TEXT NOT NULL,
  cover TEXT NOT NULL,
  cover_alt TEXT,
  aspect_ratio TEXT NOT NULL DEFAULT '16/9',
  role TEXT,
  timeline TEXT,
  tools TEXT NOT NULL DEFAULT '[]',
  link TEXT,
  repo TEXT,
  sections TEXT NOT NULL DEFAULT '{}',
  evidence TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 12. REVIEWS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  author TEXT NOT NULL,
  image TEXT NOT NULL,
  quote TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 13. CERTIFICATES & AWARDS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  date_issued TEXT,
  certificate_type TEXT,
  description TEXT,
  image TEXT,
  url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 14. FAQS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 15. SOCIAL LINKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY,
  platform_id TEXT NOT NULL,
  label TEXT NOT NULL,
  handle TEXT,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 16. GALLERY ITEMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  item_code TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  organization TEXT,
  year TEXT,
  tools TEXT NOT NULL DEFAULT '[]',
  ratio TEXT NOT NULL DEFAULT '4/5',
  dimensions TEXT,
  contribution TEXT,
  description TEXT,
  src TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR QUERY OPTIMIZATION
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_education_order ON education(sort_order);
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(sort_order);
CREATE INDEX IF NOT EXISTS idx_experience_roles_exp_id ON experience_roles(experience_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_skill_categories_order ON skill_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_cat_order ON skills(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_categories_order ON project_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_cat ON projects(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON reviews(sort_order);
CREATE INDEX IF NOT EXISTS idx_certificates_order ON certificates(sort_order);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(sort_order);
CREATE INDEX IF NOT EXISTS idx_social_links_order ON social_links(sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_items_order ON gallery_items(sort_order);

-- ============================================================================
-- INTEGRITY TRIGGERS (Enforcing Foreign-Key Integrity Regardless of PRAGMA Settings)
-- ============================================================================

-- 1. admin_sessions -> admin_users
CREATE TRIGGER IF NOT EXISTS trg_fk_admin_sessions_admin_ins BEFORE INSERT ON admin_sessions
FOR EACH ROW WHEN (SELECT id FROM admin_users WHERE id = NEW.admin_id) IS NULL
BEGIN
  SELECT RAISE(ABORT, 'Foreign key violation: admin_users record does not exist');
END;

CREATE TRIGGER IF NOT EXISTS trg_fk_admin_sessions_admin_upd BEFORE UPDATE OF admin_id ON admin_sessions
FOR EACH ROW WHEN (SELECT id FROM admin_users WHERE id = NEW.admin_id) IS NULL
BEGIN
  SELECT RAISE(ABORT, 'Foreign key violation: admin_users record does not exist');
END;

CREATE TRIGGER IF NOT EXISTS trg_fk_admin_sessions_admin_del BEFORE DELETE ON admin_users
FOR EACH ROW
BEGIN
  DELETE FROM admin_sessions WHERE admin_id = OLD.id;
END;

-- 2. experience_roles -> experience
CREATE TRIGGER IF NOT EXISTS trg_fk_experience_roles_exp_ins BEFORE INSERT ON experience_roles
FOR EACH ROW WHEN (SELECT id FROM experience WHERE id = NEW.experience_id) IS NULL
BEGIN
  SELECT RAISE(ABORT, 'Foreign key violation: experience record does not exist');
END;

CREATE TRIGGER IF NOT EXISTS trg_fk_experience_roles_exp_upd BEFORE UPDATE OF experience_id ON experience_roles
FOR EACH ROW WHEN (SELECT id FROM experience WHERE id = NEW.experience_id) IS NULL
BEGIN
  SELECT RAISE(ABORT, 'Foreign key violation: experience record does not exist');
END;

CREATE TRIGGER IF NOT EXISTS trg_fk_experience_roles_exp_del BEFORE DELETE ON experience
FOR EACH ROW
BEGIN
  DELETE FROM experience_roles WHERE experience_id = OLD.id;
END;

-- 3. skills -> skill_categories
CREATE TRIGGER IF NOT EXISTS trg_fk_skills_cat_ins BEFORE INSERT ON skills
FOR EACH ROW WHEN (SELECT id FROM skill_categories WHERE id = NEW.category_id) IS NULL
BEGIN
  SELECT RAISE(ABORT, 'Foreign key violation: skill_categories record does not exist');
END;

CREATE TRIGGER IF NOT EXISTS trg_fk_skills_cat_upd BEFORE UPDATE OF category_id ON skills
FOR EACH ROW WHEN (SELECT id FROM skill_categories WHERE id = NEW.category_id) IS NULL
BEGIN
  SELECT RAISE(ABORT, 'Foreign key violation: skill_categories record does not exist');
END;

CREATE TRIGGER IF NOT EXISTS trg_fk_skills_cat_del BEFORE DELETE ON skill_categories
FOR EACH ROW
BEGIN
  DELETE FROM skills WHERE category_id = OLD.id;
END;

-- 4. projects -> project_categories (SET NULL on delete)
CREATE TRIGGER IF NOT EXISTS trg_fk_projects_cat_ins BEFORE INSERT ON projects
FOR EACH ROW WHEN NEW.category_id IS NOT NULL AND (SELECT id FROM project_categories WHERE id = NEW.category_id) IS NULL
BEGIN
  SELECT RAISE(ABORT, 'Foreign key violation: project_categories record does not exist');
END;

CREATE TRIGGER IF NOT EXISTS trg_fk_projects_cat_upd BEFORE UPDATE OF category_id ON projects
FOR EACH ROW WHEN NEW.category_id IS NOT NULL AND (SELECT id FROM project_categories WHERE id = NEW.category_id) IS NULL
BEGIN
  SELECT RAISE(ABORT, 'Foreign key violation: project_categories record does not exist');
END;

CREATE TRIGGER IF NOT EXISTS trg_fk_projects_cat_del BEFORE DELETE ON project_categories
FOR EACH ROW
BEGIN
  UPDATE projects SET category_id = NULL WHERE category_id = OLD.id;
END;
