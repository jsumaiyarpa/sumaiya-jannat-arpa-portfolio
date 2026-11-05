
import { Router } from "express";

import { getDatabaseClient } from "../db/client.js";
import { requireAdmin } from "../middleware/auth/requireAdmin.js";

const router = Router();

// All admin routes require authentication.
router.use(requireAdmin);

// Dashboard overview
router.get("/overview", async (req, res, next) => {
  try {
    const db = getDatabaseClient();

    const result = await db.execute(`
      SELECT
        (SELECT COUNT(*) FROM projects) AS projects,
        (SELECT COUNT(*) FROM skills) AS skills,
        (SELECT COUNT(*) FROM reviews) AS reviews,
        (SELECT COUNT(*) FROM certificates) AS certificates,
        (SELECT COUNT(*) FROM faqs) AS faqs,
        (SELECT COUNT(*) FROM gallery_items) AS gallery_items,
        (SELECT COUNT(*) FROM education) AS education,
        (SELECT COUNT(*) FROM experience) AS experience
    `);

    const stats = result.rows[0];

    res.status(200).json({
      success: true,
      admin: {
        username: req.admin.username,
        fullName: req.admin.full_name,
        role: req.admin.role,
      },
      stats,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
