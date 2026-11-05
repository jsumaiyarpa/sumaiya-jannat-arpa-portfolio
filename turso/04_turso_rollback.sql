-- ============================================================================
-- SCRIPT: 04_turso_rollback.sql
-- Project: Arpa Portfolio Admin Panel
-- Engine: Turso (libSQL / SQLite)
-- WARNING: DESTRUCTIVE ACTION. PERMANENTLY DROPS ALL 16 TABLES AND WIPES ALL DATA.
-- ============================================================================

-- SAFETY GUARD:
-- To prevent accidental execution, the DROP statements below are commented out.
-- To execute this rollback, you must explicitly review this warning and uncomment the statements.

-- PRAGMA foreign_keys = OFF;

-- DROP TABLE IF EXISTS gallery_items;
-- DROP TABLE IF EXISTS social_links;
-- DROP TABLE IF EXISTS faqs;
-- DROP TABLE IF EXISTS certificates;
-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS projects;
-- DROP TABLE IF EXISTS project_categories;
-- DROP TABLE IF EXISTS skills;
-- DROP TABLE IF EXISTS skill_categories;
-- DROP TABLE IF EXISTS experience_roles;
-- DROP TABLE IF EXISTS experience;
-- DROP TABLE IF EXISTS education;
-- DROP TABLE IF EXISTS profile_about;
-- DROP TABLE IF EXISTS site_settings;
-- DROP TABLE IF EXISTS admin_sessions;
-- DROP TABLE IF EXISTS admin_users;

-- PRAGMA foreign_keys = ON;
