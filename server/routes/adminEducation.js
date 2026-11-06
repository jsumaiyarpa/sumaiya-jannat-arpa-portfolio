import { Router } from "express";
import crypto from "crypto";
import { getDatabaseClient } from "../db/client.js";
import { mapEducationRow, safeJsonArray } from "../utils/contentMappers.js";

const router = Router();

/**
 * GET /api/admin/education
 * List all education records.
 */
router.get("/education", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const result = await db.execute(
      "SELECT * FROM education ORDER BY sort_order ASC, created_at ASC"
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
 * GET /api/admin/education/:id
 * Retrieve a single education record by ID.
 */
router.get("/education/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const result = await db.execute({
      sql: "SELECT * FROM education WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Education record not found.",
      });
    }

    res.status(200).json({
      success: true,
      education: mapEducationRow(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/education
 * Create a new education record.
 */
router.post("/education", async (req, res, next) => {
  try {
    const {
      institution,
      school,
      degree,
      major,
      dates,
      timeline,
      status,
      location,
      gpa,
      stageTag,
      stage_tag,
      details,
      highlights,
      coursework,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
    } = req.body;

    const finalInstitution = typeof (institution ?? school) === "string"
      ? (institution ?? school).trim()
      : "";
    if (!finalInstitution) {
      return res.status(400).json({
        success: false,
        message: "Institution / School name is required.",
      });
    }

    const finalDegree = typeof degree === "string" ? degree.trim() : "";
    if (!finalDegree) {
      return res.status(400).json({
        success: false,
        message: "Degree name is required.",
      });
    }

    const finalDates = typeof (dates ?? timeline) === "string"
      ? (dates ?? timeline).trim()
      : "";
    if (!finalDates) {
      return res.status(400).json({
        success: false,
        message: "Duration / Dates are required.",
      });
    }

    const finalMajor = typeof major === "string" ? major.trim() : "";
    const finalStatus = typeof status === "string" ? status.trim() : "";
    const finalLocation = typeof location === "string" ? location.trim() : "";
    const finalGpa = typeof gpa === "string" ? gpa.trim() : "";
    const finalStageTag = typeof (stageTag ?? stage_tag) === "string"
      ? (stageTag ?? stage_tag).trim()
      : "";
    const finalDetails = typeof details === "string" ? details.trim() : "";
    const highlightsJson = JSON.stringify(safeJsonArray(highlights));
    const courseworkJson = JSON.stringify(safeJsonArray(coursework));
    const finalSortOrder = Number.isInteger(Number(sortOrder ?? sort_order))
      ? Number(sortOrder ?? sort_order)
      : 0;
    const finalIsPublished = (isPublished !== undefined || is_published !== undefined)
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : 1;

    const newId = crypto.randomUUID();
    const db = getDatabaseClient();

    await db.execute({
      sql: `
        INSERT INTO education (
          id, institution, degree, major, dates, status, location, gpa,
          stage_tag, details, highlights, coursework, sort_order, is_published,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `,
      args: [
        newId,
        finalInstitution,
        finalDegree,
        finalMajor,
        finalDates,
        finalStatus,
        finalLocation,
        finalGpa,
        finalStageTag,
        finalDetails,
        highlightsJson,
        courseworkJson,
        finalSortOrder,
        finalIsPublished,
      ],
    });

    const created = await db.execute({
      sql: "SELECT * FROM education WHERE id = ?",
      args: [newId],
    });

    res.status(201).json({
      success: true,
      message: "Education record created successfully.",
      education: mapEducationRow(created.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/education/:id
 * Update an existing education record.
 */
router.put("/education/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      institution,
      school,
      degree,
      major,
      dates,
      timeline,
      status,
      location,
      gpa,
      stageTag,
      stage_tag,
      details,
      highlights,
      coursework,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
    } = req.body;

    const db = getDatabaseClient();

    const existingResult = await db.execute({
      sql: "SELECT * FROM education WHERE id = ?",
      args: [id],
    });

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Education record not found.",
      });
    }

    const existing = existingResult.rows[0];

    const finalInstitution = typeof (institution ?? school) === "string"
      ? (institution ?? school).trim()
      : existing.institution;
    if (!finalInstitution) {
      return res.status(400).json({
        success: false,
        message: "Institution cannot be empty.",
      });
    }

    const finalDegree = typeof degree === "string" ? degree.trim() : existing.degree;
    if (!finalDegree) {
      return res.status(400).json({
        success: false,
        message: "Degree cannot be empty.",
      });
    }

    const finalDates = typeof (dates ?? timeline) === "string"
      ? (dates ?? timeline).trim()
      : existing.dates;

    const finalMajor = typeof major === "string" ? major.trim() : existing.major;
    const finalStatus = typeof status === "string" ? status.trim() : existing.status;
    const finalLocation = typeof location === "string" ? location.trim() : existing.location;
    const finalGpa = typeof gpa === "string" ? gpa.trim() : existing.gpa;
    const finalStageTag = typeof (stageTag ?? stage_tag) === "string"
      ? (stageTag ?? stage_tag).trim()
      : existing.stage_tag;
    const finalDetails = typeof details === "string" ? details.trim() : existing.details;

    const highlightsJson = highlights !== undefined
      ? JSON.stringify(safeJsonArray(highlights))
      : existing.highlights;

    const courseworkJson = coursework !== undefined
      ? JSON.stringify(safeJsonArray(coursework))
      : existing.coursework;

    const finalSortOrder = (sortOrder !== undefined || sort_order !== undefined)
      ? Number(sortOrder ?? sort_order)
      : existing.sort_order;

    const finalIsPublished = (isPublished !== undefined || is_published !== undefined)
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : existing.is_published;

    await db.execute({
      sql: `
        UPDATE education
        SET institution = ?, degree = ?, major = ?, dates = ?, status = ?,
            location = ?, gpa = ?, stage_tag = ?, details = ?, highlights = ?,
            coursework = ?, sort_order = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        finalInstitution,
        finalDegree,
        finalMajor,
        finalDates,
        finalStatus,
        finalLocation,
        finalGpa,
        finalStageTag,
        finalDetails,
        highlightsJson,
        courseworkJson,
        finalSortOrder,
        finalIsPublished,
        id,
      ],
    });

    const updated = await db.execute({
      sql: "SELECT * FROM education WHERE id = ?",
      args: [id],
    });

    res.status(200).json({
      success: true,
      message: "Education record updated successfully.",
      education: mapEducationRow(updated.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/education/:id
 * Delete an education record.
 */
router.delete("/education/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const existing = await db.execute({
      sql: "SELECT id, institution, degree FROM education WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Education record not found.",
      });
    }

    await db.execute({
      sql: "DELETE FROM education WHERE id = ?",
      args: [id],
    });

    res.status(200).json({
      success: true,
      message: `Education record "${existing.rows[0].degree} — ${existing.rows[0].institution}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

