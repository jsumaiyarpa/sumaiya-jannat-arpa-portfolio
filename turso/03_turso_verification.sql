-- ============================================================================
-- SCRIPT: 03_turso_verification.sql
-- Project: Arpa Portfolio Admin Panel
-- Engine: Turso (libSQL / SQLite)
-- Description: Individual table row count assertions, exact schema table inventory audit,
--              foreign key integrity checks, and separate auth state verification.
-- ============================================================================

-- 1. Verify Foreign Key Engine State & Integrity Violations
PRAGMA foreign_keys;
-- Expected output: 1

PRAGMA foreign_key_check;
-- Expected output: 0 rows returned (no violations across the entire database)

-- 2. Audit Exact Schema Table Inventory (Must match all 16 tables, 0 missing, 0 unexpected)
WITH expected_tables(name) AS (
  VALUES
    ('admin_sessions'), ('admin_users'), ('certificates'), ('education'),
    ('experience'), ('experience_roles'), ('faqs'), ('gallery_items'),
    ('profile_about'), ('project_categories'), ('projects'), ('reviews'),
    ('site_settings'), ('skill_categories'), ('skills'), ('social_links')
),
actual_tables AS (
  SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
),
missing_tables AS (
  SELECT name FROM expected_tables WHERE name NOT IN (SELECT name FROM actual_tables)
),
unexpected_tables AS (
  SELECT name FROM actual_tables WHERE name NOT IN (SELECT name FROM expected_tables)
)
SELECT
  (SELECT count(*) FROM actual_tables) AS total_actual_tables,
  (SELECT count(*) FROM expected_tables) AS total_expected_tables,
  (SELECT count(*) FROM missing_tables) AS missing_count,
  (SELECT count(*) FROM unexpected_tables) AS unexpected_count,
  CASE
    WHEN (SELECT count(*) FROM missing_tables) = 0 AND (SELECT count(*) FROM unexpected_tables) = 0
    THEN 'PASS'
    ELSE 'FAIL'
  END AS inventory_status;

-- 3. Individual Table Row Count Assertions (14 Portfolio Content Tables = 116 records)
SELECT
  'site_settings' AS table_name,
  count(*) AS actual_count,
  1 AS expected_count,
  CASE WHEN count(*) = 1 THEN 'PASS' ELSE 'FAIL' END AS status
FROM site_settings
UNION ALL
SELECT 'profile_about', count(*), 1, CASE WHEN count(*) = 1 THEN 'PASS' ELSE 'FAIL' END FROM profile_about
UNION ALL
SELECT 'education', count(*), 3, CASE WHEN count(*) = 3 THEN 'PASS' ELSE 'FAIL' END FROM education
UNION ALL
SELECT 'experience', count(*), 4, CASE WHEN count(*) = 4 THEN 'PASS' ELSE 'FAIL' END FROM experience
UNION ALL
SELECT 'experience_roles', count(*), 6, CASE WHEN count(*) = 6 THEN 'PASS' ELSE 'FAIL' END FROM experience_roles
UNION ALL
SELECT 'skill_categories', count(*), 4, CASE WHEN count(*) = 4 THEN 'PASS' ELSE 'FAIL' END FROM skill_categories
UNION ALL
SELECT 'skills', count(*), 38, CASE WHEN count(*) = 38 THEN 'PASS' ELSE 'FAIL' END FROM skills
UNION ALL
SELECT 'project_categories', count(*), 4, CASE WHEN count(*) = 4 THEN 'PASS' ELSE 'FAIL' END FROM project_categories
UNION ALL
SELECT 'projects', count(*), 20, CASE WHEN count(*) = 20 THEN 'PASS' ELSE 'FAIL' END FROM projects
UNION ALL
SELECT 'reviews', count(*), 4, CASE WHEN count(*) = 4 THEN 'PASS' ELSE 'FAIL' END FROM reviews
UNION ALL
SELECT 'certificates', count(*), 14, CASE WHEN count(*) = 14 THEN 'PASS' ELSE 'FAIL' END FROM certificates
UNION ALL
SELECT 'faqs', count(*), 5, CASE WHEN count(*) = 5 THEN 'PASS' ELSE 'FAIL' END FROM faqs
UNION ALL
SELECT 'social_links', count(*), 4, CASE WHEN count(*) = 4 THEN 'PASS' ELSE 'FAIL' END FROM social_links
UNION ALL
SELECT 'gallery_items', count(*), 8, CASE WHEN count(*) = 8 THEN 'PASS' ELSE 'FAIL' END FROM gallery_items;

-- 4. Global Content State Verification (Strict Discrepancy & State Integrity Audit)
-- Rejects mixed, excessive, partial, or misleading aggregate states.
-- Accepts ONLY:
--   a) Completely Empty (all 14 tables contain 0 rows)
--   b) Fully Initialized (all 14 tables match exact counts AND aggregate = 116)
WITH table_checks AS (
  SELECT 'site_settings' AS tbl, count(*) AS actual, 1 AS expected FROM site_settings
  UNION ALL SELECT 'profile_about', count(*), 1 FROM profile_about
  UNION ALL SELECT 'education', count(*), 3 FROM education
  UNION ALL SELECT 'experience', count(*), 4 FROM experience
  UNION ALL SELECT 'experience_roles', count(*), 6 FROM experience_roles
  UNION ALL SELECT 'skill_categories', count(*), 4 FROM skill_categories
  UNION ALL SELECT 'skills', count(*), 38 FROM skills
  UNION ALL SELECT 'project_categories', count(*), 4 FROM project_categories
  UNION ALL SELECT 'projects', count(*), 20 FROM projects
  UNION ALL SELECT 'reviews', count(*), 4 FROM reviews
  UNION ALL SELECT 'certificates', count(*), 14 FROM certificates
  UNION ALL SELECT 'faqs', count(*), 5 FROM faqs
  UNION ALL SELECT 'social_links', count(*), 4 FROM social_links
  UNION ALL SELECT 'gallery_items', count(*), 8 FROM gallery_items
)
SELECT
  SUM(actual) AS total_actual_content,
  116 AS expected_seeded_total,
  SUM(CASE WHEN actual != expected THEN 1 ELSE 0 END) AS individual_discrepancies,
  SUM(CASE WHEN actual = 0 THEN 1 ELSE 0 END) AS empty_tables_count,
  CASE
    -- State A: Completely Empty Content Database
    WHEN SUM(actual) = 0 AND SUM(CASE WHEN actual = 0 THEN 1 ELSE 0 END) = 14
      THEN 'PASS (VALID_EMPTY_UNSEEDED)'
    -- State B: Fully Initialized Content Database (Zero individual discrepancies AND sum = 116)
    WHEN SUM(actual) = 116 AND SUM(CASE WHEN actual != expected THEN 1 ELSE 0 END) = 0
      THEN 'PASS (VALID_FULLY_INITIALIZED)'
    -- Any other state (mixed, excessive, partial, or misleading aggregate)
    ELSE 'FAIL (CORRUPT_OR_PARTIAL_STATE)'
  END AS content_validation_status
FROM table_checks;

-- 5. Authentication Tables Verification (Evaluated Separately from Content)
-- Note: Expected immediately after seed = 0 rows in each.
-- admin_users becomes 1 after running interactive CLI `node server/scripts/create-admin.js`.
-- admin_sessions becomes >0 upon admin login.
SELECT
  'admin_users' AS auth_table,
  count(*) AS actual_count,
  0 AS expected_initial_seed,
  1 AS expected_post_cli,
  'Out-of-band CLI provisioned' AS management_model
FROM admin_users
UNION ALL
SELECT
  'admin_sessions',
  count(*),
  0,
  0,
  'Runtime dynamic state'
FROM admin_sessions;

-- 6. Content Visibility / Publishing Distribution Audit
SELECT 'Published Projects' AS item, count(*) AS count FROM projects WHERE is_published = 1
UNION ALL SELECT 'Draft Projects', count(*) FROM projects WHERE is_published = 0
UNION ALL SELECT 'Published Reviews', count(*) FROM reviews WHERE is_published = 1
UNION ALL SELECT 'Draft Reviews', count(*) FROM reviews WHERE is_published = 0;
