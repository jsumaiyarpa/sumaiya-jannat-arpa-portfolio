import { Router } from "express";
import crypto from "crypto";
import { getDatabaseClient } from "../db/client.js";
import { mapCertificateRow } from "../utils/contentMappers.js";

const router = Router();

/**
 * GET /api/admin/certificates
 * List all certificate records.
 */
router.get("/certificates", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const result = await db.execute(
      "SELECT * FROM certificates ORDER BY sort_order ASC, created_at ASC"
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
 * GET /api/admin/certificates/:id
 * Retrieve a single certificate by ID.
 */
router.get("/certificates/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const result = await db.execute({
      sql: "SELECT * FROM certificates WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    res.status(200).json({
      success: true,
      certificate: mapCertificateRow(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/certificates
 * Create a new certificate record.
 */
router.post("/certificates", async (req, res, next) => {
  try {
    const {
      category,
      title,
      organization,
      dateIssued,
      date_issued,
      date,
      certificateType,
      certificate_type,
      description,
      image,
      url,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
    } = req.body;

    const finalCategory = typeof category === "string" ? category.trim() : "";
    if (!finalCategory) {
      return res.status(400).json({
        success: false,
        message: "Certificate category is required.",
      });
    }

    const finalTitle = typeof title === "string" ? title.trim() : "";
    if (!finalTitle) {
      return res.status(400).json({
        success: false,
        message: "Certificate title is required.",
      });
    }

    const finalOrg = typeof organization === "string" ? organization.trim() : "";
    if (!finalOrg) {
      return res.status(400).json({
        success: false,
        message: "Issuing organization is required.",
      });
    }

    const finalDateIssued = typeof (dateIssued ?? date_issued ?? date) === "string"
      ? (dateIssued ?? date_issued ?? date).trim()
      : null;

    const finalCertType = typeof (certificateType ?? certificate_type) === "string"
      ? (certificateType ?? certificate_type).trim()
      : null;

    const finalDescription = typeof description === "string"
      ? description.trim()
      : null;

    const finalImage = typeof image === "string" && image.trim()
      ? image.trim()
      : null;

    const finalUrl = typeof url === "string" && url.trim()
      ? url.trim()
      : null;

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
        INSERT INTO certificates (
          id, category, title, organization, date_issued, certificate_type,
          description, image, url, sort_order, is_published,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `,
      args: [
        newId,
        finalCategory,
        finalTitle,
        finalOrg,
        finalDateIssued,
        finalCertType,
        finalDescription,
        finalImage,
        finalUrl,
        finalSortOrder,
        finalIsPublished,
      ],
    });

    const created = await db.execute({
      sql: "SELECT * FROM certificates WHERE id = ?",
      args: [newId],
    });

    res.status(201).json({
      success: true,
      message: "Certificate created successfully.",
      certificate: mapCertificateRow(created.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/certificates/:id
 * Update an existing certificate record.
 */
router.put("/certificates/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      category,
      title,
      organization,
      dateIssued,
      date_issued,
      date,
      certificateType,
      certificate_type,
      description,
      image,
      url,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
    } = req.body;

    const db = getDatabaseClient();

    const existingResult = await db.execute({
      sql: "SELECT * FROM certificates WHERE id = ?",
      args: [id],
    });

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    const existing = existingResult.rows[0];

    const finalCategory = typeof category === "string" ? category.trim() : existing.category;
    if (!finalCategory) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be empty.",
      });
    }

    const finalTitle = typeof title === "string" ? title.trim() : existing.title;
    if (!finalTitle) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty.",
      });
    }

    const finalOrg = typeof organization === "string" ? organization.trim() : existing.organization;
    if (!finalOrg) {
      return res.status(400).json({
        success: false,
        message: "Organization cannot be empty.",
      });
    }

    const finalDateIssued = (dateIssued !== undefined || date_issued !== undefined || date !== undefined)
      ? ((dateIssued ?? date_issued ?? date) ? String(dateIssued ?? date_issued ?? date).trim() : null)
      : existing.date_issued;

    const finalCertType = (certificateType !== undefined || certificate_type !== undefined)
      ? ((certificateType ?? certificate_type) ? String(certificateType ?? certificate_type).trim() : null)
      : existing.certificate_type;

    const finalDescription = description !== undefined
      ? (description ? String(description).trim() : null)
      : existing.description;

    const finalImage = image !== undefined
      ? (image ? String(image).trim() : null)
      : existing.image;

    const finalUrl = url !== undefined
      ? (url ? String(url).trim() : null)
      : existing.url;

    const finalSortOrder = (sortOrder !== undefined || sort_order !== undefined)
      ? Number(sortOrder ?? sort_order)
      : existing.sort_order;

    const finalIsPublished = (isPublished !== undefined || is_published !== undefined)
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : existing.is_published;

    await db.execute({
      sql: `
        UPDATE certificates
        SET category = ?, title = ?, organization = ?, date_issued = ?,
            certificate_type = ?, description = ?, image = ?, url = ?,
            sort_order = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        finalCategory,
        finalTitle,
        finalOrg,
        finalDateIssued,
        finalCertType,
        finalDescription,
        finalImage,
        finalUrl,
        finalSortOrder,
        finalIsPublished,
        id,
      ],
    });

    const updated = await db.execute({
      sql: "SELECT * FROM certificates WHERE id = ?",
      args: [id],
    });

    res.status(200).json({
      success: true,
      message: "Certificate updated successfully.",
      certificate: mapCertificateRow(updated.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/certificates/:id
 * Delete a certificate record.
 */
router.delete("/certificates/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const existing = await db.execute({
      sql: "SELECT id, title FROM certificates WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    await db.execute({
      sql: "DELETE FROM certificates WHERE id = ?",
      args: [id],
    });

    res.status(200).json({
      success: true,
      message: `Certificate "${existing.rows[0].title}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

