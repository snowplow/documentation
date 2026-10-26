/**
 * Utilities for reading metadata that only exists in the source files.
 *
 * Release notes carry `date` and `components` in their frontmatter, tutorial
 * pages carry `position`, and each tutorial directory has a `meta.json`. None
 * of it survives into the built HTML, so we read it back off disk and attach
 * it to the page objects.
 */

import path from 'node:path'
import fs from 'node:fs/promises'
import matter from 'gray-matter'

/**
 * Parse the frontmatter of a source markdown file.
 * Returns the data object, or null if the file can't be read or parsed.
 */
async function readFrontmatter(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return matter(content).data
  } catch {
    return null
  }
}

/**
 * Locate the source file behind a built route.
 * /release-notes/<slug>/      → release-notes/<slug>/index.md
 * /tutorials/<slug>/<step>/   → tutorials/<slug>/<step>.md
 *
 * Returns null for route shapes we don't know how to map back to a file.
 */
function sourcePathFor(siteDir, parts) {
  if (parts[0] === 'release-notes' && parts.length === 2) {
    return path.join(siteDir, 'release-notes', parts[1], 'index.md')
  }
  if (parts[0] === 'tutorials' && parts.length === 3) {
    return path.join(siteDir, 'tutorials', parts[1], `${parts[2]}.md`)
  }
  return null
}

/**
 * Coerce a frontmatter value that may be a string or a list into an array.
 */
function toArray(value) {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

/**
 * Normalize a frontmatter date to YYYY-MM-DD. Dates are quoted in the release
 * note sources so they parse as strings, but js-yaml turns an unquoted one
 * into a Date.
 */
function toDateString(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'string') return value.trim()
  return ''
}

/**
 * Classify every page and attach the source frontmatter that release-note and
 * tutorial pages need, in place.
 */
export async function attachSourceMetadata(pages, siteDir) {
  let missing = 0

  for (const page of pages) {
    const parts = page.routePath.split('/').filter(Boolean)

    // Classify from the route, which is always available. The frontmatter read
    // below only fills in detail — a page that loses its metadata should still
    // be grouped as what it is.
    if (parts[0] === 'release-notes') page.kind = 'release-note'
    else if (parts[0] === 'tutorials') page.kind = 'tutorial-step'
    else page.kind = 'doc'

    if (page.kind === 'tutorial-step') {
      page.tutorialSlug = parts[1]
      page.position = Infinity
    }

    const sourcePath = sourcePathFor(siteDir, parts)
    if (!sourcePath) {
      if (page.kind !== 'doc') missing++
      continue
    }

    const data = await readFrontmatter(sourcePath)
    if (!data) {
      missing++
      continue
    }

    if (page.kind === 'release-note') {
      page.date = toDateString(data.date)
      page.components = toArray(data.components)
    } else if (page.kind === 'tutorial-step') {
      if (Number.isFinite(data.position)) page.position = data.position
    }
  }

  if (missing > 0) {
    console.warn(
      `[llms-txt] Warning: could not read source frontmatter for ${missing} page(s)`
    )
  }
}

/**
 * Read every tutorials/<slug>/meta.json into a Map of slug → metadata.
 */
export async function buildTutorialMeta(siteDir) {
  const metaMap = new Map()
  const tutorialsDir = path.join(siteDir, 'tutorials')

  let entries
  try {
    entries = await fs.readdir(tutorialsDir, { withFileTypes: true })
  } catch {
    return metaMap
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const metaPath = path.join(tutorialsDir, entry.name, 'meta.json')
    try {
      metaMap.set(entry.name, JSON.parse(await fs.readFile(metaPath, 'utf8')))
    } catch {
      console.warn(`[llms-txt] Warning: no readable meta.json for tutorial ${entry.name}`)
    }
  }

  return metaMap
}

/**
 * Group tutorial step pages by tutorial slug, each list ordered by `position`.
 * Returns a Map of slug → pages[], in the order the tutorials were encountered.
 */
export function groupTutorialSteps(pages) {
  const bySlug = new Map()

  for (const page of pages) {
    if (page.kind !== 'tutorial-step') continue
    if (!bySlug.has(page.tutorialSlug)) bySlug.set(page.tutorialSlug, [])
    bySlug.get(page.tutorialSlug).push(page)
  }

  for (const steps of bySlug.values()) {
    steps.sort(comparePosition)
  }

  return bySlug
}

function comparePosition(a, b) {
  if (a.position !== b.position) return a.position - b.position
  return a.routePath.localeCompare(b.routePath)
}

/**
 * Reorder pages so tutorial steps read in step order and release notes read
 * newest first. Docs keep their original walk order.
 *
 * The three groups are already contiguous in the input (they come from
 * separate content directories), so concatenating them back preserves the
 * overall shape of the file.
 */
export function sortPages(pages) {
  const docs = []
  const tutorials = []
  const releaseNotes = []

  for (const page of pages) {
    if (page.kind === 'release-note') releaseNotes.push(page)
    else if (page.kind === 'tutorial-step') tutorials.push(page)
    else docs.push(page)
  }

  tutorials.sort(
    (a, b) => a.tutorialSlug.localeCompare(b.tutorialSlug) || comparePosition(a, b)
  )

  // Newest first; anything without a date sorts to the end.
  releaseNotes.sort((a, b) => {
    if (!a.date || !b.date) return (b.date ? 1 : 0) - (a.date ? 1 : 0)
    return b.date.localeCompare(a.date)
  })

  return [...docs, ...tutorials, ...releaseNotes]
}
