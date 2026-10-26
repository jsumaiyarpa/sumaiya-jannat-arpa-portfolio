/**
 * GitHub REST API Data Layer
 * 
 * Configured for user: jsumaiyarpa
 * Public REST API: https://api.github.com/users/jsumaiyarpa/repos
 * - Zero API tokens or credentials required.
 * - Normalized deduplication against manually curated projects in src/data/projects.js.
 * - Safe localStorage caching with error boundaries and stale-cache fallback.
 */

export const githubConfig = {
  username: 'jsumaiyarpa',
  apiUrl: 'https://api.github.com/users/jsumaiyarpa/repos?sort=updated&per_page=100',
  excludeForks: true,
  // Additional repositories to exclude (e.g. test repos, forks, or coursework)
  // Matching is case-insensitive
  excludeRepos: [
    // e.g. 'CS423-SOLID-TEAM3_QUERY',
  ],
  cacheKey: 'arpa_github_repos_v1',
  cacheTTL: 15 * 60 * 1000, // 15 minutes TTL
};

export const languageColors = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  HTML: '#E34F26',
  CSS: '#563D7C',
  Java: '#B07219',
  Python: '#3572A5',
  'C++': '#F34B7D',
  C: '#555555',
  Shell: '#89E051',
  Vue: '#41B883',
  React: '#61DAFB',
};

/**
 * Extracts normalized GitHub repo identifiers from manually curated projects list.
 * Normalizes both full URLs and short repository names to lowercase.
 */
export function getFeaturedRepoIdentifiers(projectsList = []) {
  const urls = new Set();
  const names = new Set();

  for (const p of projectsList) {
    if (p && p.repo && typeof p.repo === 'string' && p.repo.trim()) {
      const cleanedUrl = p.repo.trim().toLowerCase().replace(/\/+$/, '');
      urls.add(cleanedUrl);

      const match = cleanedUrl.match(/github\.com\/[^/]+\/([^/]+)/);
      if (match && match[1]) {
        names.add(match[1].replace(/\.git$/, ''));
      }
    }
  }

  return { urls, names };
}

/**
 * Safe localStorage wrapper with try/catch for private browsing or quota limits.
 */
function safeGetCache(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function safeSetCache(key, data) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch (e) {
    // Ignore quota or private browsing exceptions
  }
}

/**
 * Formats ISO timestamp into relative human-readable format.
 */
export function formatRelativeDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Updated today';
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 30) return `Updated ${diffDays} days ago`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Updated ${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    return `Updated on ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  } catch (e) {
    return '';
  }
}

/**
 * Fetches public GitHub repositories and filters out:
 * 1. Forks (if excludeForks is true)
 * 2. Any repo in excludeRepos list
 * 3. Any repo already represented in manually curated projectsList (deduplication)
 */
export async function fetchAdditionalRepos(projectsList = []) {
  const { urls: featuredUrls, names: featuredNames } = getFeaturedRepoIdentifiers(projectsList);
  const excludeSet = new Set((githubConfig.excludeRepos || []).map((r) => r.toLowerCase()));

  const cached = safeGetCache(githubConfig.cacheKey);
  const isCacheFresh =
    cached && cached.timestamp && Date.now() - cached.timestamp < githubConfig.cacheTTL;

  let rawRepos = null;

  if (isCacheFresh && Array.isArray(cached.data)) {
    rawRepos = cached.data;
  } else {
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 7000) : null;

      const res = await fetch(githubConfig.apiUrl, {
        signal: controller ? controller.signal : undefined,
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          rawRepos = json;
          safeSetCache(githubConfig.cacheKey, json);
        }
      } else {
        // Fall back to stale cache if rate-limited or server error
        if (cached && Array.isArray(cached.data)) {
          rawRepos = cached.data;
        }
      }
    } catch (err) {
      // Network failure: fall back to stale cache
      if (cached && Array.isArray(cached.data)) {
        rawRepos = cached.data;
      }
    }
  }

  if (!rawRepos) {
    return { repos: [], error: true, totalFetched: 0 };
  }

  // Filter out forks, excluded repos, and already-featured repos
  const filtered = rawRepos.filter((repo) => {
    if (githubConfig.excludeForks && repo.fork) return false;

    const repoNameLower = (repo.name || '').toLowerCase();
    const repoUrlLower = (repo.html_url || '').toLowerCase().replace(/\/+$/, '');

    if (excludeSet.has(repoNameLower)) return false;
    if (featuredNames.has(repoNameLower)) return false;
    if (featuredUrls.has(repoUrlLower)) return false;

    return true;
  });

  // Sort by updated_at descending
  filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return { repos: filtered, error: false, totalFetched: rawRepos.length };
}
