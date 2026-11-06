import { Router } from "express";
import crypto from "crypto";
import { getDatabaseClient } from "../db/client.js";
import {
  mapExperienceRow,
  mapExperienceRoleRow,
  safeJsonArray,
} from "../utils/contentMappers.js";

const router = Router();

/**
 * GET /api/admin/experience
 * List all experience organizations with their roles nested.
 */
router.get("/experience", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const [expResult, rolesResult] = await Promise.all([
      db.execute("SELECT * FROM experience ORDER BY sort_order ASC, created_at DESC"),
      db.execute("SELECT * FROM experience_roles ORDER BY sort_order ASC, created_at ASC"),
    ]);

    const rolesByExp = {};
    for (const r of rolesResult.rows) {
      if (!rolesByExp[r.experience_id]) {
        rolesByExp[r.experience_id] = [];
      }
      rolesByExp[r.experience_id].push(r);
    }

    const experiences = expResult.rows.map((row) =>
      mapExperienceRow(row, rolesByExp[row.id] || [])
    );

    res.status(200).json({
      success: true,
      experience: experiences,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/experience/:id
 * Retrieve a single experience record with roles.
 */
router.get("/experience/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const [expResult, rolesResult] = await Promise.all([
      db.execute({
        sql: "SELECT * FROM experience WHERE id = ?",
        args: [id],
      }),
      db.execute({
        sql: "SELECT * FROM experience_roles WHERE experience_id = ? ORDER BY sort_order ASC",
        args: [id],
      }),
    ]);

    if (expResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience record not found.",
      });
    }

    res.status(200).json({
      success: true,
      experience: mapExperienceRow(expResult.rows[0], rolesResult.rows),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/experience
 * Create a new experience organization (and optional initial roles).
 */
router.post("/experience", async (req, res, next) => {
  try {
    const {
      org,
      fullName,
      full_name,
      location,
      orgType,
      org_type,
      type,
      isCurrent,
      is_current,
      current,
      logoUrl,
      logo_url,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
      roles,
    } = req.body;

    const trimmedOrg = typeof org === "string" ? org.trim() : "";
    if (!trimmedOrg) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required.",
      });
    }

    const finalFullName = typeof (fullName ?? full_name) === "string"
      ? (fullName ?? full_name).trim()
      : trimmedOrg;

    const finalLocation = typeof location === "string" ? location.trim() : "";
    if (!finalLocation) {
      return res.status(400).json({
        success: false,
        message: "Location is required.",
      });
    }

    const finalOrgType = typeof (orgType ?? org_type ?? type) === "string"
      ? (orgType ?? org_type ?? type).trim()
      : "Organization";

    const finalIsCurrent = Boolean(isCurrent ?? is_current ?? current) ? 1 : 0;
    const finalLogoUrl = typeof (logoUrl ?? logo_url) === "string" ? (logoUrl ?? logo_url).trim() : null;
    const finalSortOrder = Number.isInteger(Number(sortOrder ?? sort_order))
      ? Number(sortOrder ?? sort_order)
      : 0;
    const finalIsPublished = isPublished !== undefined || is_published !== undefined
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : 1;

    const newExpId = crypto.randomUUID();
    const db = getDatabaseClient();

    await db.execute({
      sql: `
        INSERT INTO experience (
          id, org, full_name, location, org_type, is_current, logo_url,
          sort_order, is_published, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `,
      args: [
        newExpId,
        trimmedOrg,
        finalFullName,
        finalLocation,
        finalOrgType,
        finalIsCurrent,
        finalLogoUrl,
        finalSortOrder,
        finalIsPublished,
      ],
    });

    // If initial roles are provided, insert them
    if (Array.isArray(roles) && roles.length > 0) {
      for (const r of roles) {
        if (!r.title || !r.dates) continue;
        const roleId = crypto.randomUUID();
        const roleSort = Number.isInteger(Number(r.sortOrder ?? r.sort_order))
          ? Number(r.sortOrder ?? r.sort_order)
          : 0;
        const highlightsJson = JSON.stringify(safeJsonArray(r.highlights));

        await db.execute({
          sql: `
            INSERT INTO experience_roles (
              id, experience_id, title, dates, description, highlights, sort_order, created_at, updated_at
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
          `,
          args: [
            roleId,
            newExpId,
            r.title.trim(),
            r.dates.trim(),
            (r.description || "").trim(),
            highlightsJson,
            roleSort,
          ],
        });
      }
    }

    // Fetch created record
    const [createdExp, createdRoles] = await Promise.all([
      db.execute({ sql: "SELECT * FROM experience WHERE id = ?", args: [newExpId] }),
      db.execute({ sql: "SELECT * FROM experience_roles WHERE experience_id = ? ORDER BY sort_order ASC", args: [newExpId] }),
    ]);

    res.status(201).json({
      success: true,
      message: "Experience created successfully.",
      experience: mapExperienceRow(createdExp.rows[0], createdRoles.rows),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/experience/:id
 * Update an existing experience organization.
 */
router.put("/experience/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      org,
      fullName,
      full_name,
      location,
      orgType,
      org_type,
      type,
      isCurrent,
      is_current,
      current,
      logoUrl,
      logo_url,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
    } = req.body;

    const db = getDatabaseClient();

    const existingResult = await db.execute({
      sql: "SELECT * FROM experience WHERE id = ?",
      args: [id],
    });

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience record not found.",
      });
    }

    const existing = existingResult.rows[0];

    const finalOrg = typeof org === "string" ? org.trim() : existing.org;
    if (!finalOrg) {
      return res.status(400).json({
        success: false,
        message: "Organization name cannot be empty.",
      });
    }

    const finalFullName = typeof (fullName ?? full_name) === "string"
      ? (fullName ?? full_name).trim()
      : existing.full_name;

    const finalLocation = typeof location === "string"
      ? location.trim()
      : existing.location;

    const finalOrgType = typeof (orgType ?? org_type ?? type) === "string"
      ? (orgType ?? org_type ?? type).trim()
      : existing.org_type;

    const finalIsCurrent = (isCurrent !== undefined || is_current !== undefined || current !== undefined)
      ? (Boolean(isCurrent ?? is_current ?? current) ? 1 : 0)
      : existing.is_current;

    const finalLogoUrl = (logoUrl !== undefined || logo_url !== undefined)
      ? ((logoUrl ?? logo_url) ? String(logoUrl ?? logo_url).trim() : null)
      : existing.logo_url;

    const finalSortOrder = (sortOrder !== undefined || sort_order !== undefined)
      ? Number(sortOrder ?? sort_order)
      : existing.sort_order;

    const finalIsPublished = (isPublished !== undefined || is_published !== undefined)
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : existing.is_published;

    await db.execute({
      sql: `
        UPDATE experience
        SET org = ?, full_name = ?, location = ?, org_type = ?, is_current = ?,
            logo_url = ?, sort_order = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        finalOrg,
        finalFullName,
        finalLocation,
        finalOrgType,
        finalIsCurrent,
        finalLogoUrl,
        finalSortOrder,
        finalIsPublished,
        id,
      ],
    });

    const [updatedExp, rolesResult] = await Promise.all([
      db.execute({ sql: "SELECT * FROM experience WHERE id = ?", args: [id] }),
      db.execute({ sql: "SELECT * FROM experience_roles WHERE experience_id = ? ORDER BY sort_order ASC", args: [id] }),
    ]);

    res.status(200).json({
      success: true,
      message: "Experience updated successfully.",
      experience: mapExperienceRow(updatedExp.rows[0], rolesResult.rows),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/experience/:id
 * Delete an experience organization and its roles.
 */
router.delete("/experience/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabaseClient();

    const existing = await db.execute({
      sql: "SELECT id, org FROM experience WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience record not found.",
      });
    }

    // SQLite foreign keys / cascade
    await db.execute({
      sql: "DELETE FROM experience_roles WHERE experience_id = ?",
      args: [id],
    });

    await db.execute({
      sql: "DELETE FROM experience WHERE id = ?",
      args: [id],
    });

    res.status(200).json({
      success: true,
      message: `Experience "${existing.rows[0].org}" and associated roles deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/experience/:id/roles
 * Add a new role to an existing experience organization.
 */
router.post("/experience/:id/roles", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, dates, description, highlights, sortOrder, sort_order } = req.body;

    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    if (!trimmedTitle) {
      return res.status(400).json({
        success: false,
        message: "Role title is required.",
      });
    }

    const trimmedDates = typeof dates === "string" ? dates.trim() : "";
    if (!trimmedDates) {
      return res.status(400).json({
        success: false,
        message: "Role dates/duration are required.",
      });
    }

    const db = getDatabaseClient();

    const expCheck = await db.execute({
      sql: "SELECT id FROM experience WHERE id = ?",
      args: [id],
    });

    if (expCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parent experience organization not found.",
      });
    }

    const finalDescription = typeof description === "string" ? description.trim() : "";
    const highlightsJson = JSON.stringify(safeJsonArray(highlights));
    const finalSortOrder = Number.isInteger(Number(sortOrder ?? sort_order))
      ? Number(sortOrder ?? sort_order)
      : 0;

    const newRoleId = crypto.randomUUID();

    await db.execute({
      sql: `
        INSERT INTO experience_roles (
          id, experience_id, title, dates, description, highlights, sort_order, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `,
      args: [
        newRoleId,
        id,
        trimmedTitle,
        trimmedDates,
        finalDescription,
        highlightsJson,
        finalSortOrder,
      ],
    });

    const createdRoleResult = await db.execute({
      sql: "SELECT * FROM experience_roles WHERE id = ?",
      args: [newRoleId],
    });

    res.status(201).json({
      success: true,
      message: "Role added successfully.",
      role: mapExperienceRoleRow(createdRoleResult.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/experience-roles/:roleId
 * Update a specific role.
 */
router.put("/experience-roles/:roleId", async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const { title, dates, description, highlights, sortOrder, sort_order } = req.body;

    const db = getDatabaseClient();

    const existingResult = await db.execute({
      sql: "SELECT * FROM experience_roles WHERE id = ?",
      args: [roleId],
    });

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    const existing = existingResult.rows[0];

    const finalTitle = typeof title === "string" ? title.trim() : existing.title;
    if (!finalTitle) {
      return res.status(400).json({
        success: false,
        message: "Role title cannot be empty.",
      });
    }

    const finalDates = typeof dates === "string" ? dates.trim() : existing.dates;
    if (!finalDates) {
      return res.status(400).json({
        success: false,
        message: "Role dates cannot be empty.",
      });
    }

    const finalDescription = typeof description === "string"
      ? description.trim()
      : existing.description;

    const highlightsJson = highlights !== undefined
      ? JSON.stringify(safeJsonArray(highlights))
      : existing.highlights;

    const finalSortOrder = (sortOrder !== undefined || sort_order !== undefined)
      ? Number(sortOrder ?? sort_order)
      : existing.sort_order;

    await db.execute({
      sql: `
        UPDATE experience_roles
        SET title = ?, dates = ?, description = ?, highlights = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [finalTitle, finalDates, finalDescription, highlightsJson, finalSortOrder, roleId],
    });

    const updatedRole = await db.execute({
      sql: "SELECT * FROM experience_roles WHERE id = ?",
      args: [roleId],
    });

    res.status(200).json({
      success: true,
      message: "Role updated successfully.",
      role: mapExperienceRoleRow(updatedRole.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/experience-roles/:roleId
 * Delete a specific role.
 */
router.delete("/experience-roles/:roleId", async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const db = getDatabaseClient();

    const existing = await db.execute({
      sql: "SELECT id, title FROM experience_roles WHERE id = ?",
      args: [roleId],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    await db.execute({
      sql: "DELETE FROM experience_roles WHERE id = ?",
      args: [roleId],
    });

    res.status(200).json({
      success: true,
      message: `Role "${existing.rows[0].title}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

