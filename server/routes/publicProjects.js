import { Router } from "express";
import { getDatabaseClient } from "../db/client.js";
import { mapProjectRow, mapCategoryRow } from "../utils/projectMapper.js";

const router = Router();

/**
 * GET /api/projects
 * Public read-only endpoint returning all published projects and categories.
 */
router.get("/", async (req, res, next) => {
  try {
    const db = getDatabaseClient();

    const [categoriesResult, projectsResult] = await Promise.all([
      db.execute(
        "SELECT * FROM project_categories WHERE is_published = 1 ORDER BY sort_order ASC"
      ),
      db.execute(
        "SELECT * FROM projects WHERE is_published = 1 ORDER BY sort_order ASC, order_num ASC"
      ),
    ]);

    const categoriesMap = {};
    for (const row of categoriesResult.rows) {
      categoriesMap[row.id] = mapCategoryRow(row);
    }

    const projectsList = projectsResult.rows.map(mapProjectRow);

    res.status(200).json({
      success: true,
      projects: projectsList,
      categories: categoriesMap,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

