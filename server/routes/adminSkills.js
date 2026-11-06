import { Router } from "express";
import crypto from "crypto";
import { getDatabaseClient } from "../db/client.js";
import { mapSkillRow, mapSkillCategoryRow } from "../utils/contentMappers.js";

const router = Router();

/**
 * GET /api/admin/skill-categories
 * List all skill categories.
 */
router.get("/skill-categories", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const result = await db.execute(
      "SELECT * FROM skill_categories ORDER BY sort_order ASC, title ASC"
    );
    res.status(200).json({
      success: true,
      categories: result.rows.map(mapSkillCategoryRow),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/skills
 * List all skills with their category info.
 */
router.get("/skills", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const [skillsResult, categoriesResult] = await Promise.all([
      db.execute(`
        SELECT s.*, c.title AS category_title
        FROM skills s
        LEFT JOIN skill_categories c ON s.category_id = c.id
        ORDER BY c.sort_order ASC, s.sort_order ASC, s.name ASC
      `),
      db.execute("SELECT * FROM skill_categories ORDER BY sort_order ASC, title ASC"),
    ]);

    const skills = skillsResult.rows.map((row) => ({
      ...mapSkillRow(row),
      categoryTitle: row.category_title || row.category_id,
    }));

    res.status(200).json({
      success: true,
      skills,
      categories: categoriesResult.rows.map(mapSkillCategoryRow),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/skills/:id
 * Retrieve a single skill by ID.
 */
router.get("/skills/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const result = await db.execute({
      sql: `
        SELECT s.*, c.title AS category_title
        FROM skills s
        LEFT JOIN skill_categories c ON s.category_id = c.id
        WHERE s.id = ?
      `,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const row = result.rows[0];
    res.status(200).json({
      success: true,
      skill: {
        ...mapSkillRow(row),
        categoryTitle: row.category_title || row.category_id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/skills
 * Create a new skill record.
 */
router.post("/skills", async (req, res, next) => {
  try {
    const { name, categoryId, category_id, sortOrder, sort_order, isPublished, is_published } = req.body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required.",
      });
    }

    const targetCategory = (categoryId || category_id || "").trim();
    if (!targetCategory) {
      return res.status(400).json({
        success: false,
        message: "Skill category is required.",
      });
    }

    const db = getDatabaseClient();

    // Verify category exists
    const catCheck = await db.execute({
      sql: "SELECT id FROM skill_categories WHERE id = ?",
      args: [targetCategory],
    });
    if (catCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Category "${targetCategory}" does not exist.`,
      });
    }

    const finalSortOrder = Number.isInteger(Number(sortOrder ?? sort_order))
      ? Number(sortOrder ?? sort_order)
      : 0;
    const finalIsPublished = isPublished !== undefined || is_published !== undefined
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : 1;

    const newId = crypto.randomUUID();

    await db.execute({
      sql: `
        INSERT INTO skills (id, category_id, name, sort_order, is_published, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [newId, targetCategory, trimmedName, finalSortOrder, finalIsPublished],
    });

    const createdResult = await db.execute({
      sql: `
        SELECT s.*, c.title AS category_title
        FROM skills s
        LEFT JOIN skill_categories c ON s.category_id = c.id
        WHERE s.id = ?
      `,
      args: [newId],
    });

    const row = createdResult.rows[0];
    res.status(201).json({
      success: true,
      message: "Skill created successfully.",
      skill: {
        ...mapSkillRow(row),
        categoryTitle: row.category_title || row.category_id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/skills/:id
 * Update an existing skill.
 */
router.put("/skills/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, categoryId, category_id, sortOrder, sort_order, isPublished, is_published } = req.body;

    const db = getDatabaseClient();

    const existingResult = await db.execute({
      sql: "SELECT * FROM skills WHERE id = ?",
      args: [id],
    });

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const existing = existingResult.rows[0];
    const finalName = typeof name === "string" ? name.trim() : existing.name;
    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: "Skill name cannot be empty.",
      });
    }

    const targetCategory = (categoryId || category_id || existing.category_id).trim();
    const catCheck = await db.execute({
      sql: "SELECT id FROM skill_categories WHERE id = ?",
      args: [targetCategory],
    });
    if (catCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Category "${targetCategory}" does not exist.`,
      });
    }

    const finalSortOrder = (sortOrder !== undefined || sort_order !== undefined)
      ? Number(sortOrder ?? sort_order)
      : existing.sort_order;
    const finalIsPublished = (isPublished !== undefined || is_published !== undefined)
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : existing.is_published;

    await db.execute({
      sql: `
        UPDATE skills
        SET category_id = ?, name = ?, sort_order = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [targetCategory, finalName, finalSortOrder, finalIsPublished, id],
    });

    const updatedResult = await db.execute({
      sql: `
        SELECT s.*, c.title AS category_title
        FROM skills s
        LEFT JOIN skill_categories c ON s.category_id = c.id
        WHERE s.id = ?
      `,
      args: [id],
    });

    const row = updatedResult.rows[0];
    res.status(200).json({
      success: true,
      message: "Skill updated successfully.",
      skill: {
        ...mapSkillRow(row),
        categoryTitle: row.category_title || row.category_id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/skills/:id
 * Delete a skill.
 */
router.delete("/skills/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const existing = await db.execute({
      sql: "SELECT id, name FROM skills WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    await db.execute({
      sql: "DELETE FROM skills WHERE id = ?",
      args: [id],
    });

    res.status(200).json({
      success: true,
      message: `Skill "${existing.rows[0].name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

