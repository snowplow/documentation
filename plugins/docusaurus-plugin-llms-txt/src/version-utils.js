/**
 * Utilities for detecting and handling previous-version pages.
 */

const PREVIOUS_VERSION_PATTERNS = [
  'previous-versions/',
  'previous-version/',
  'previous_versions/',
  'previous-releases/',
]

/**
 * Check if a route path points to a previous-version page.
 * Matches anywhere in the path (e.g. /rdb-loader-previous-versions/).
 */
export function isPreviousVersion(routePath) {
  return PREVIOUS_VERSION_PATTERNS.some((p) => routePath.includes(p))
}

/**
 * Extract the link to the current version from the deprecation banner.
 * The banner format is:
 *   > **Caution:** You are reading documentation for an outdated version. Here's the [latest one](/docs/...)!
 * Returns the full URL or null if not found.
 */
export function extractCurrentVersionLink(markdown, siteUrl) {
  const match = markdown.match(
    /outdated version.*?\[latest one\]\(([^)]+)\)/
  )
  if (!match) return null

  const linkPath = match[1]
  // Convert relative path to full URL
  if (linkPath.startsWith('/')) {
    return `${siteUrl}${linkPath}`
  }
  return linkPath
}

/**
 * Strip the deprecation banner from markdown content.
 * The banner is promoted to structured metadata in the page header,
 * so it doesn't need to appear inline as well.
 */
export function stripDeprecationBanner(markdown) {
  return markdown.replace(
    /> \*\*Caution:\*\* You are reading documentation for an outdated version\. Here's the \[latest one\]\([^)]+\)!\n*/,
    ''
  )
}
