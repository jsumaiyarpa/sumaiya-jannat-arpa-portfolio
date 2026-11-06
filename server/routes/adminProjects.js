import { Router } from "express";
import { getDatabaseClient } from "../db/client.js";
import { mapProjectRow, mapCategoryRow } from "../utils/projectMapper.js";

const router = Router();

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

/**
 * Helper to serialize JSON input safely.
 * Returns { valid: true, value: string } or { valid: false, error: string }
 */
function serializeJson(input, fieldName, defaultEmpty) {
  if (input === undefined || input === null || input === "") {
    return { valid: true, value: JSON.stringify(defaultEmpty) };
  }
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) {
      return { valid: true, value: JSON.stringify(defaultEmpty) };
    }
    try {
      const parsed = JSON.parse(trimmed);
      return { valid: true, value: JSON.stringify(parsed) };
    } catch (err) {
      return { valid: false, error: `Invalid JSON in ${fieldName}: ${err.message}` };
    }
  }
  if (typeof input === "object") {
    try {
      return { valid: true, value: JSON.stringify(input) };
    } catch (err) {
      return { valid: false, error: `Failed to serialize ${fieldName}: ${err.message}` };
    }
  }
  return { valid: false, error: `${fieldName} must be a valid JSON string or object/array.` };
}

/**
 * GET /api/admin/projects
 * Retrieve all projects (published & unpublished) with full details.
 */
router.get("/projects", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const result = await db.execute(
      "SELECT * FROM projects ORDER BY sort_order ASC, order_num ASC, created_at DESC"
    );
    res.status(200).json({
      success: true,
      projects: result.rows.map(mapProjectRow),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/project-categories
 * Retrieve all project categories.
 */
router.get("/project-categories", async (req, res, next) => {
  try {
    const db = getDatabaseClient();
    const result = await db.execute(
      "SELECT * FROM project_categories ORDER BY sort_order ASC"
    );
    res.status(200).json({
      success: true,
      categories: result.rows.map(mapCategoryRow),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/projects/:slug
 * Retrieve one project by slug.
 */
router.get("/projects/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const db = getDatabaseClient();

    const result = await db.execute({
      sql: "SELECT * FROM projects WHERE slug = ?",
      args: [slug],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.status(200).json({
      success: true,
      project: mapProjectRow(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/projects
 * Create a new project.
 */
router.post("/projects", async (req, res, next) => {
  try {
    const {
      slug,
      title,
      orderNum,
      order_num,
      category,
      category_id,
      featured,
      layoutSpan,
      layout_span,
      status,
      summary,
      cover,
      coverAlt,
      cover_alt,
      aspectRatio,
      aspect_ratio,
      role,
      timeline,
      tools,
      link,
      repo,
      sections,
      evidence,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
    } = req.body || {};

    // 1. Validate required fields
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    const cleanSlug = typeof slug === "string" ? slug.trim().toLowerCase() : "";
    if (!cleanSlug || !SLUG_REGEX.test(cleanSlug)) {
      return res.status(400).json({
        success: false,
        message: "A valid slug is required (letters, numbers, and hyphens only).",
      });
    }

    const targetCategory = (category || category_id || "").trim();
    if (!targetCategory) {
      return res.status(400).json({
        success: false,
        message: "Project category is required.",
      });
    }

    const db = getDatabaseClient();

    // 2. Check for duplicate slug
    const existing = await db.execute({
      sql: "SELECT slug FROM projects WHERE slug = ?",
      args: [cleanSlug],
    });
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `A project with slug "${cleanSlug}" already exists.`,
      });
    }

    // 3. Validate category existence
    const catCheck = await db.execute({
      sql: "SELECT id FROM project_categories WHERE id = ?",
      args: [targetCategory],
    });
    if (catCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Category "${targetCategory}" does not exist.`,
      });
    }

    // 4. Validate JSON fields
    const toolsResult = serializeJson(tools, "tools", []);
    if (!toolsResult.valid) {
      return res.status(400).json({ success: false, message: toolsResult.error });
    }

    const sectionsResult = serializeJson(sections, "sections", {});
    if (!sectionsResult.valid) {
      return res.status(400).json({ success: false, message: sectionsResult.error });
    }

    const evidenceResult = serializeJson(evidence, "evidence", []);
    if (!evidenceResult.valid) {
      return res.status(400).json({ success: false, message: evidenceResult.error });
    }

    // 5. Parameterized Insert
    const finalOrderNum = typeof (orderNum ?? order_num) === "string" ? (orderNum ?? order_num).trim() : "";
    const finalFeatured = Boolean(featured) ? 1 : 0;
    const finalLayoutSpan = typeof (layoutSpan ?? layout_span) === "string" ? (layoutSpan ?? layout_span).trim() : "col-span-1";
    const finalStatus = typeof status === "string" ? status.trim() : "completed";
    const finalSummary = typeof summary === "string" ? summary.trim() : "";
    const finalCover = typeof cover === "string" ? cover.trim() : "";
    const finalCoverAlt = typeof (coverAlt ?? cover_alt) === "string" ? (coverAlt ?? cover_alt).trim() : "";
    const finalAspectRatio = typeof (aspectRatio ?? aspect_ratio) === "string" ? (aspectRatio ?? aspect_ratio).trim() : "16/9";
    const finalRole = typeof role === "string" ? role.trim() : "";
    const finalTimeline = typeof timeline === "string" ? timeline.trim() : "";
    const finalLink = typeof link === "string" ? link.trim() : "";
    const finalRepo = typeof repo === "string" ? repo.trim() : "";
    const finalSortOrder = Number.isInteger(Number(sortOrder ?? sort_order)) ? Number(sortOrder ?? sort_order) : 0;
    const finalIsPublished = (isPublished !== undefined || is_published !== undefined)
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : 1;

    await db.execute({
      sql: `
        INSERT INTO projects (
          slug, title, order_num, category_id, featured, layout_span, status, summary,
          cover, cover_alt, aspect_ratio, role, timeline, tools, link, repo,
          sections, evidence, sort_order, is_published, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `,
      args: [
        cleanSlug,
        title.trim(),
        finalOrderNum,
        targetCategory,
        finalFeatured,
        finalLayoutSpan,
        finalStatus,
        finalSummary,
        finalCover,
        finalCoverAlt,
        finalAspectRatio,
        finalRole,
        finalTimeline,
        toolsResult.value,
        finalLink,
        finalRepo,
        sectionsResult.value,
        evidenceResult.value,
        finalSortOrder,
        finalIsPublished,
      ],
    });

    const inserted = await db.execute({
      sql: "SELECT * FROM projects WHERE slug = ?",
      args: [cleanSlug],
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: mapProjectRow(inserted.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/projects/:slug
 * Update an existing project.
 */
router.put("/projects/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const {
      title,
      orderNum,
      order_num,
      category,
      category_id,
      featured,
      layoutSpan,
      layout_span,
      status,
      summary,
      cover,
      coverAlt,
      cover_alt,
      aspectRatio,
      aspect_ratio,
      role,
      timeline,
      tools,
      link,
      repo,
      sections,
      evidence,
      sortOrder,
      sort_order,
      isPublished,
      is_published,
    } = req.body || {};

    const db = getDatabaseClient();

    // 1. Verify existence
    const existing = await db.execute({
      sql: "SELECT * FROM projects WHERE slug = ?",
      args: [slug],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const current = existing.rows[0];

    // 2. Validate title
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    // 3. Validate category
    const targetCategory = (category || category_id || current.category_id || "").trim();
    if (!targetCategory) {
      return res.status(400).json({
        success: false,
        message: "Project category is required.",
      });
    }

    const catCheck = await db.execute({
      sql: "SELECT id FROM project_categories WHERE id = ?",
      args: [targetCategory],
    });
    if (catCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Category "${targetCategory}" does not exist.`,
      });
    }

    // 4. Validate JSON fields
    const toolsResult = serializeJson(tools !== undefined ? tools : current.tools, "tools", []);
    if (!toolsResult.valid) {
      return res.status(400).json({ success: false, message: toolsResult.error });
    }

    const sectionsResult = serializeJson(sections !== undefined ? sections : current.sections, "sections", {});
    if (!sectionsResult.valid) {
      return res.status(400).json({ success: false, message: sectionsResult.error });
    }

    const evidenceResult = serializeJson(evidence !== undefined ? evidence : current.evidence, "evidence", []);
    if (!evidenceResult.valid) {
      return res.status(400).json({ success: false, message: evidenceResult.error });
    }

    // 5. Update
    const finalOrderNum = (orderNum !== undefined || order_num !== undefined)
      ? String(orderNum ?? order_num).trim()
      : (current.order_num || "");
    const finalFeatured = featured !== undefined ? (Boolean(featured) ? 1 : 0) : current.featured;
    const finalLayoutSpan = (layoutSpan !== undefined || layout_span !== undefined)
      ? String(layoutSpan ?? layout_span).trim()
      : (current.layout_span || "col-span-1");
    const finalStatus = status !== undefined ? String(status).trim() : current.status;
    const finalSummary = summary !== undefined ? String(summary).trim() : current.summary;
    const finalCover = cover !== undefined ? String(cover).trim() : current.cover;
    const finalCoverAlt = (coverAlt !== undefined || cover_alt !== undefined)
      ? String(coverAlt ?? cover_alt).trim()
      : current.cover_alt;
    const finalAspectRatio = (aspectRatio !== undefined || aspect_ratio !== undefined)
      ? String(aspectRatio ?? aspect_ratio).trim()
      : (current.aspect_ratio || "16/9");
    const finalRole = role !== undefined ? String(role).trim() : current.role;
    const finalTimeline = timeline !== undefined ? String(timeline).trim() : current.timeline;
    const finalLink = link !== undefined ? String(link).trim() : current.link;
    const finalRepo = repo !== undefined ? String(repo).trim() : current.repo;
    const finalSortOrder = (sortOrder !== undefined || sort_order !== undefined)
      ? Number(sortOrder ?? sort_order) || 0
      : current.sort_order;
    const finalIsPublished = (isPublished !== undefined || is_published !== undefined)
      ? (Boolean(isPublished ?? is_published) ? 1 : 0)
      : current.is_published;

    await db.execute({
      sql: `
        UPDATE projects SET
          title = ?,
          order_num = ?,
          category_id = ?,
          featured = ?,
          layout_span = ?,
          status = ?,
          summary = ?,
          cover = ?,
          cover_alt = ?,
          aspect_ratio = ?,
          role = ?,
          timeline = ?,
          tools = ?,
          link = ?,
          repo = ?,
          sections = ?,
          evidence = ?,
          sort_order = ?,
          is_published = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE slug = ?
      `,
      args: [
        title.trim(),
        finalOrderNum,
        targetCategory,
        finalFeatured,
        finalLayoutSpan,
        finalStatus,
        finalSummary,
        finalCover,
        finalCoverAlt,
        finalAspectRatio,
        finalRole,
        finalTimeline,
        toolsResult.value,
        finalLink,
        finalRepo,
        sectionsResult.value,
        evidenceResult.value,
        finalSortOrder,
        finalIsPublished,
        slug,
      ],
    });

    const updated = await db.execute({
      sql: "SELECT * FROM projects WHERE slug = ?",
      args: [slug],
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project: mapProjectRow(updated.rows[0]),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/projects/:slug
 * Permanently delete a project.
 */
router.delete("/projects/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const db = getDatabaseClient();

    const existing = await db.execute({
      sql: "SELECT slug FROM projects WHERE slug = ?",
      args: [slug],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    await db.execute({
      sql: "DELETE FROM projects WHERE slug = ?",
      args: [slug],
    });

    res.status(200).json({
      success: true,
      message: `Project "${slug}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/projects/:slug/publish
 * Toggle or set publication status.
 */
router.patch("/projects/:slug/publish", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const db = getDatabaseClient();

    const existing = await db.execute({
      sql: "SELECT slug, is_published FROM projects WHERE slug = ?",
      args: [slug],
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const current = existing.rows[0];
    const { isPublished, is_published } = req.body || {};

    let targetState;
    if (isPublished !== undefined || is_published !== undefined) {
      targetState = Boolean(isPublished ?? is_published) ? 1 : 0;
    } else {
      targetState = current.is_published === 1 ? 0 : 1;
    }

    await db.execute({
      sql: "UPDATE projects SET is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?",
      args: [targetState, slug],
    });

    res.status(200).json({
      success: true,
      isPublished: Boolean(targetState),
      message: targetState ? "Project published." : "Project unpublished.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;

