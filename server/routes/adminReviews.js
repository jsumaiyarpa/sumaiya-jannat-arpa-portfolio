import { Router } from "express";
import crypto from "crypto";
import { getDatabaseClient } from "../db/client.js";
import { mapReviewRow } from "../utils/contentMappers.js";

const router = Router();

/**
 * GET /api/admin/reviews
 * List all review records (published and drafts).
 */
router.get("/reviews", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const result = await db.execute(
      "SELECT * FROM reviews ORDER BY sort_order ASC, created_at ASC"
    );
    res.status(200).json({
      success: true,
      reviews: result.rows.map(mapReviewRow),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/reviews/:id
 * Retrieve a single review by ID.
 */
router.get("/reviews/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const result = await db.execute({
      sql: "SELECT * FROM reviews WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    res.status(200).json({
      success: true,
      review: mapReviewRow(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/reviews
 * Create a new review record.
 */
router.post("/reviews", async (req, res, next) => {
  try {
    const {
      reviewerName,
      reviewer_name,
      name,
      author,
      role,
      designation,
      organization,
      reviewText,
      quote,
      testimonial,
      photo,
      image,
      avatar,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
    } = req.body;

    const finalName = typeof (reviewerName ?? reviewer_name ?? name ?? author) === "string"
      ? (reviewerName ?? reviewer_name ?? name ?? author).trim()
      : "";

    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: "Reviewer name is required.",
      });
    }

    const finalQuote = typeof (reviewText ?? quote ?? testimonial) === "string"
      ? (reviewText ?? quote ?? testimonial).trim()
      : "";

    if (!finalQuote) {
      return res.status(400).json({
        success: false,
        message: "Review text is required.",
      });
    }

    const finalRole = typeof (role ?? designation) === "string"
      ? (role ?? designation).trim()
      : null;

    const finalOrg = typeof organization === "string"
      ? organization.trim()
      : null;

    const finalImage = typeof (photo ?? image ?? avatar) === "string"
      ? (photo ?? image ?? avatar).trim()
      : "";

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
        INSERT INTO reviews (
          id, reviewer_name, author, role, organization,
          image, quote, testimonial, sort_order, is_published,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `,
      args: [
        newId,
        finalName,
        finalName,
        finalRole,
        finalOrg,
        finalImage,
        finalQuote,
        finalQuote,
        finalSortOrder,
        finalIsPublished,
      ],
    });

    const created = await db.execute({
      sql: "SELECT * FROM reviews WHERE id = ?",
      args: [newId],
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully.",
      review: mapReviewRow(created.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/reviews/:id
 * Update an existing review record.
 */
router.put("/reviews/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      reviewerName,
      reviewer_name,
      name,
      author,
      role,
      designation,
      organization,
      reviewText,
      quote,
      testimonial,
      photo,
      image,
      avatar,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
    } = req.body;

    const db = getDatabaseClient();

    const existingResult = await db.execute({
      sql: "SELECT * FROM reviews WHERE id = ?",
      args: [id],
    });

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const existing = existingResult.rows[0];

    const rawName = reviewerName ?? reviewer_name ?? name ?? author;
    const finalName = rawName !== undefined
      ? (typeof rawName === "string" ? rawName.trim() : existing.reviewer_name)
      : existing.reviewer_name;

    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: "Reviewer name cannot be empty.",
      });
    }

    const rawQuote = reviewText ?? quote ?? testimonial;
    const finalQuote = rawQuote !== undefined
      ? (typeof rawQuote === "string" ? rawQuote.trim() : existing.quote)
      : existing.quote;

    if (!finalQuote) {
      return res.status(400).json({
        success: false,
        message: "Review text cannot be empty.",
      });
    }

    const rawRole = role ?? designation;
    const finalRole = rawRole !== undefined
      ? (typeof rawRole === "string" ? rawRole.trim() : null)
      : existing.role;

    const finalOrg = organization !== undefined
      ? (typeof organization === "string" ? organization.trim() : null)
      : existing.organization;

    const rawImage = photo ?? image ?? avatar;
    const finalImage = rawImage !== undefined
      ? (typeof rawImage === "string" ? rawImage.trim() : "")
      : existing.image;

    const finalSortOrder = (sortOrder !== undefined || sort_order !== undefined)
      ? Number(sortOrder ?? sort_order)
      : existing.sort_order;

    const finalIsPublished = (isPublished !== undefined || is_published !== undefined)
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : existing.is_published;

    await db.execute({
      sql: `
        UPDATE reviews
        SET reviewer_name = ?, author = ?, role = ?, organization = ?,
            image = ?, quote = ?, testimonial = ?, sort_order = ?,
            is_published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        finalName,
        finalName,
        finalRole,
        finalOrg,
        finalImage,
        finalQuote,
        finalQuote,
        finalSortOrder,
        finalIsPublished,
        id,
      ],
    });

    const updated = await db.execute({
      sql: "SELECT * FROM reviews WHERE id = ?",
      args: [id],
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review: mapReviewRow(updated.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/reviews/:id/publish
 * Toggle or update publish status.
 */
router.patch("/reviews/:id/publish", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPublished, is_published } = req.body;
    const db = getDatabaseClient();

    const existingResult = await db.execute({
      sql: "SELECT id, reviewer_name, is_published FROM reviews WHERE id = ?",
      args: [id],
    });

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const currentStatus = Boolean(existingResult.rows[0].is_published);
    const newStatus = (isPublished !== undefined || is_published !== undefined)
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : (currentStatus ? 0 : 1);

    await db.execute({
      sql: "UPDATE reviews SET is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [newStatus, id],
    });

    const updated = await db.execute({
      sql: "SELECT * FROM reviews WHERE id = ?",
      args: [id],
    });

    res.status(200).json({
      success: true,
      message: `Review "${existingResult.rows[0].reviewer_name}" is now ${newStatus ? "published" : "draft"}.`,
      review: mapReviewRow(updated.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/reviews/:id
 * Delete a review record.
 */
router.delete("/reviews/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const existing = await db.execute({
      sql: "SELECT id, reviewer_name FROM reviews WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await db.execute({
      sql: "DELETE FROM reviews WHERE id = ?",
      args: [id],
    });

    res.status(200).json({
      success: true,
      message: `Review from "${existing.rows[0].reviewer_name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

