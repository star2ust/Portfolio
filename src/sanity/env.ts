export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** False until NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET are set (see .env.local.example).
 *  Pages fall back to the seed content in src/lib/content.ts while this is false, so the site
 *  keeps working before Sanity is set up — only /studio actually needs real credentials. */
export const isSanityConfigured = Boolean(projectId && dataset);
