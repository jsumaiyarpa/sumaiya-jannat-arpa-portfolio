/**
 * Safe JSON parser helper for array fields (highlights, coursework, etc.)
 */
export function safeJsonArray(input, fallback = []) {
  if (!input) return fallback;
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/**
 * Map skill row from Turso
 */
export function mapSkillRow(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    sortOrder: Number(row.sort_order ?? 0),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map skill category row from Turso
 */
export function mapSkillCategoryRow(row) {
  return {
    id: row.id,
    title: row.title,
    blurb: row.blurb || "",
    sortOrder: Number(row.sort_order ?? 0),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map experience role row from Turso
 */
export function mapExperienceRoleRow(row) {
  return {
    id: row.id,
    experienceId: row.experience_id,
    title: row.title,
    dates: row.dates,
    description: row.description || "",
    highlights: safeJsonArray(row.highlights),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map experience row from Turso with optional nested roles
 */
export function mapExperienceRow(row, roles = []) {
  const orgName = row.org || row.company || row.full_name || "";
  const fullName = row.full_name || orgName;
  const logo = row.logo_url || "";
  return {
    id: row.id,
    org: orgName,
    company: orgName, // alias
    fullName: fullName,
    full_name: fullName, // alias
    organization: fullName || orgName, // UI organization name
    location: row.location || "",
    orgType: row.org_type || "",
    type: row.org_type || "", // public alias
    isCurrent: Boolean(row.is_current),
    current: Boolean(row.is_current), // public alias
    logoUrl: logo,
    imageUrl: logo,
    image: logo,
    sortOrder: Number(row.sort_order ?? 0),
    isPublished: Boolean(row.is_published),
    roles: Array.isArray(roles) ? roles.map(mapExperienceRoleRow) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map education row from Turso
 */
export function mapEducationRow(row) {
  const institutionName = row.institution || row.school || "";
  return {
    id: row.id,
    institution: institutionName,
    school: institutionName, // public alias
    degree: row.degree || "",
    major: row.major || "",
    dates: row.dates || row.timeline || "",
    timeline: row.dates || row.timeline || "", // public alias
    status: row.status || "",
    location: row.location || "",
    gpa: row.gpa != null ? String(row.gpa) : "",
    stageTag: row.stage_tag || "",
    stage_tag: row.stage_tag || "", // public alias
    details: row.details || "",
    highlights: safeJsonArray(row.highlights),
    coursework: safeJsonArray(row.coursework),
    sortOrder: Number(row.sort_order ?? 0),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map certificate row from Turso
 */
export function mapCertificateRow(row) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    organization: row.organization,
    dateIssued: row.date_issued || "",
    date: row.date_issued || "", // public alias
    certificateType: row.certificate_type || "",
    description: row.description || "",
    image: row.image || "",
    url: row.url || "",
    sortOrder: Number(row.sort_order ?? 0),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map review row from Turso
 */
export function mapReviewRow(row) {
  const authorName = row.reviewer_name || row.author || row.name || "";
  return {
    id: row.id,
    author: authorName,
    name: authorName,
    reviewerName: authorName,
    reviewer_name: authorName,
    role: row.role || "",
    organization: row.organization || "",
    image: row.image || "",
    avatar: row.image || "",
    quote: row.quote || row.testimonial || "",
    testimonial: row.testimonial || row.quote || "",
    sortOrder: Number(row.sort_order ?? 0),
    sort_order: Number(row.sort_order ?? 0),
    isPublished: Boolean(row.is_published),
    is_published: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
