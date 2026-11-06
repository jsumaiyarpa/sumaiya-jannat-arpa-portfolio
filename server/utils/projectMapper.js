/**
 * Utilities for mapping and safely parsing Turso database rows for projects.
 */

export function parseJsonField(value, fallback) {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === "object") {
    return value;
  }
  if (typeof value !== "string") {
    return fallback;
  }
  try {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    return JSON.parse(trimmed);
  } catch {
    return fallback;
  }
}

export function mapProjectRow(row) {
  if (!row) return null;

  const tools = parseJsonField(row.tools, []);
  const sections = parseJsonField(row.sections, {});
  const evidence = parseJsonField(row.evidence, []);

  return {
    slug: row.slug,
    title: row.title,
    orderNum: row.order_num || "",
    category: row.category_id || "",
    featured: Boolean(row.featured),
    layoutSpan: row.layout_span || "col-span-1",
    status: row.status || "",
    summary: row.summary || "",
    cover: row.cover || "",
    coverAlt: row.cover_alt || "",
    aspectRatio: row.aspect_ratio || "16/9",
    role: row.role || "",
    timeline: row.timeline || "",
    tools: Array.isArray(tools) ? tools : [],
    link: row.link || "",
    repo: row.repo || "",
    sections: sections && typeof sections === "object" ? sections : {},
    evidence: Array.isArray(evidence) ? evidence : [],
    sortOrder: Number(row.sort_order) || 0,
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCategoryRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code || "",
    label: row.label,
    tag: row.tag || "",
    blurb: row.blurb || "",
    sortOrder: Number(row.sort_order) || 0,
    isPublished: Boolean(row.is_published),
  };
}

