/**
 * Centralized API configuration.
 * Supports VITE_API_BASE_URL environment variable with fallback to local development server.
 */
const rawApiBaseUrl =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:5000";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

