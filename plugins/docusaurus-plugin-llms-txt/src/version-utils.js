/**
 * Utilities for detecting and handling previous-version pages.
 *
 * Instead of hardcoding URL patterns, we read sidebar_custom_props.outdated
 * from the docs frontmatter — the same source of truth the live site uses
 * (via MDXContent's breadcrumb inheritance).
 */

import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * Scan the docs directory for index files with `sidebar_custom_props.outdated: true`
 * in their frontmatter. Returns a Set of route path prefixes (e.g. "/docs/sources/web-trackers/previous-versions/").
 *
 * Any page whose route starts with one of these prefixes is considered a previous version.
 */
export async function buildOutdatedPaths(siteDir) {
  const outdatedPrefixes = new Set()
  const docsDir = path.join(siteDir, 'docs')

  try {
    await fs.access(docsDir)
  } catch {
    return outdatedPrefixes
  }

  await scanForOutdated(docsDir, '/docs/', outdatedPrefixes)
  return outdatedPrefixes
}

/**
 * Recursively scan directories for index.md/index.mdx files with outdated: true.
 */
async function scanForOutdated(dir, routePrefix, results) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }

  // Check for index.md or index.mdx in this directory
  for (const entry of entries) {
    if (
      !entry.isDirectory() &&
      (entry.name === 'index.md' || entry.name === 'index.mdx')
    ) {
      const filePath = path.join(dir, entry.name)
      if (await hasOutdatedProp(filePath)) {
        results.add(routePrefix)
      }
    }
  }

  // Recurse into subdirectories
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await scanForOutdated(
        path.join(dir, entry.name),
        `${routePrefix}${entry.name}/`,
        results
      )
    }
  }
}

/**
 * Check if a markdown file has sidebar_custom_props.outdated: true in its frontmatter.
 */
async function hasOutdatedProp(filePath) {
  let content
  try {
    content = await fs.readFile(filePath, 'utf8')
  } catch {
    return false
  }

  if (!content.startsWith('---')) return false

  const endIndex = content.indexOf('---', 3)
  if (endIndex === -1) return false

  const frontmatter = content.slice(3, endIndex)

  // Check for outdated: true within sidebar_custom_props block
  const customPropsMatch = frontmatter.match(
    /sidebar_custom_props:\s*\n((?:\s+.+\n)*)/
  )
  if (!customPropsMatch) return false

  return /^\s+outdated:\s*true\s*$/m.test(customPropsMatch[1])
}

/**
 * Scan the docs directory for files with `type: link` in their frontmatter.
 * Returns a Set of route paths (e.g. "/docs/discourse/", "/docs/api-reference/console-api/").
 *
 * These are sidebar link entries that redirect to external URLs and have no
 * renderable content.
 */
export async function buildLinkRoutes(siteDir) {
  const linkRoutes = new Set()
  const docsDir = path.join(siteDir, 'docs')

  try {
    await fs.access(docsDir)
  } catch {
    return linkRoutes
  }

  await scanForLinks(docsDir, '/docs/', linkRoutes)
  return linkRoutes
}

/**
 * Recursively scan for markdown files with `type: link` in frontmatter.
 */
async function scanForLinks(dir, routePrefix, results) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await scanForLinks(
        path.join(dir, entry.name),
        `${routePrefix}${entry.name}/`,
        results
      )
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      const filePath = path.join(dir, entry.name)
      if (await hasTypeLink(filePath)) {
        // Standalone files like discourse.md become /docs/discourse/
        // index.md files use the directory route directly
        if (entry.name === 'index.md' || entry.name === 'index.mdx') {
          results.add(routePrefix)
        } else {
          const slug = entry.name.replace(/\.mdx?$/, '')
          results.add(`${routePrefix}${slug}/`)
        }
      }
    }
  }
}

/**
 * Check if a markdown file has `type: link` in its frontmatter.
 */
async function hasTypeLink(filePath) {
  let content
  try {
    content = await fs.readFile(filePath, 'utf8')
  } catch {
    return false
  }

  if (!content.startsWith('---')) return false

  const endIndex = content.indexOf('---', 3)
  if (endIndex === -1) return false

  const frontmatter = content.slice(3, endIndex)
  return /^type:\s*link\s*$/m.test(frontmatter)
}

/**
 * Check if a route path is a previous-version page.
 * @param {string} routePath - The page's route path (e.g. "/docs/sources/web-trackers/previous-versions/v3/")
 * @param {Set<string>} outdatedPrefixes - Set of outdated route prefixes from buildOutdatedPaths()
 */
export function isPreviousVersion(routePath, outdatedPrefixes) {
  for (const prefix of outdatedPrefixes) {
    if (routePath.startsWith(prefix)) return true
  }
  return false
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
