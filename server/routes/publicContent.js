import { Router } from "express";
import { getDatabaseClient } from "../db/client.js";
import {
  mapEducationRow,
  mapCertificateRow,
  mapExperienceRow,
  mapReviewRow,
} from "../utils/contentMappers.js";

const router = Router();

/**
 * GET /api/skills
 * Public read-only endpoint returning published skills grouped by category.
 */
router.get("/skills", async (req, res, next) => {
  try {
    const db = getDatabaseClient();

    const [categoriesResult, skillsResult] = await Promise.all([
      db.execute(
        "SELECT * FROM skill_categories WHERE is_published = 1 ORDER BY sort_order ASC, title ASC"
      ),
      db.execute(
        "SELECT * FROM skills WHERE is_published = 1 ORDER BY sort_order ASC, name ASC"
      ),
    ]);

    const skillsByCat = {};
    for (const s of skillsResult.rows) {
      if (!skillsByCat[s.category_id]) {
        skillsByCat[s.category_id] = [];
      }
      skillsByCat[s.category_id].push(s.name);
    }

    const categoriesWithSkills = categoriesResult.rows.map((cat) => ({
      id: cat.id,
      title: cat.title,
      blurb: cat.blurb || "",
      skills: skillsByCat[cat.id] || [],
    }));

    res.status(200).json({
      success: true,
      skills: categoriesWithSkills,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/experience
 * Public read-only endpoint returning published experiences and roles.
 */
router.get("/experience", async (req, res, next) => {
  try {
    const db = getDatabaseClient();

    const [expResult, rolesResult] = await Promise.all([
      db.execute(
        "SELECT * FROM experience WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC"
      ),
      db.execute(
        "SELECT * FROM experience_roles ORDER BY sort_order ASC, created_at ASC"
      ),
    ]);

    const rolesByExp = {};
    for (const r of rolesResult.rows) {
      if (!rolesByExp[r.experience_id]) {
        rolesByExp[r.experience_id] = [];
      }
      rolesByExp[r.experience_id].push(r);
    }

    const experienceList = expResult.rows.map((row) =>
      mapExperienceRow(row, rolesByExp[row.id] || [])
    );

    res.status(200).json({
      success: true,
      experience: experienceList,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/education
 * Public read-only endpoint returning published education records.
 */
router.get("/education", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const result = await db.execute(
      "SELECT * FROM education WHERE is_published = 1 ORDER BY sort_order ASC, created_at ASC"
    );

    res.status(200).json({
      success: true,
      education: result.rows.map(mapEducationRow),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/certificates
 * Public read-only endpoint returning published certificates.
 */
router.get("/certificates", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const result = await db.execute(
      "SELECT * FROM certificates WHERE is_published = 1 ORDER BY sort_order ASC, created_at ASC"
    );

    res.status(200).json({
      success: true,
      certificates: result.rows.map(mapCertificateRow),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/reviews
 * Public read-only endpoint returning published reviews.
 */
router.get("/reviews", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const result = await db.execute(
      "SELECT * FROM reviews WHERE is_published = 1 ORDER BY sort_order ASC, created_at ASC"
    );

    res.status(200).json({
      success: true,
      reviews: result.rows.map(mapReviewRow),
    });
  } catch (error) {
    next(error);
  }
});

export default router;

