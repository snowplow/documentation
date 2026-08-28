import path from 'node:path'
import fs from 'node:fs/promises'
import { htmlPathToMdPath, tutorialMdPath } from './write-pages.js'
import { isPreviousVersion } from './version-utils.js'
import { groupTutorialSteps } from './content-metadata.js'

/**
 * Generate llms.txt index file.
 */
export async function generateIndex(outDir, pages, options) {
  const {
    siteTitle,
    siteDescription,
    siteUrl,
    enableMarkdownFiles,
    siteDir,
    outdatedPrefixes,
    tutorialMeta,
  } = options

  const labelMap = await buildLabelMap(siteDir)
  const linkOptions = { siteUrl, enableMarkdownFiles, outdatedPrefixes }

  const lines = []
  lines.push(`# ${siteTitle}`)
  lines.push('')

  if (siteDescription) {
    lines.push(`> ${siteDescription}`)
    lines.push('')
  }

  const groups = [
    ...buildDocsGroups(pages, labelMap, linkOptions),
    buildTutorialsGroup(pages, tutorialMeta, linkOptions),
    buildReleaseNotesGroup(pages, linkOptions),
  ].filter((group) => group && group.entries.length > 0)

  for (const group of groups) {
    lines.push(`## ${group.label}`)
    lines.push('')

    if (group.note) {
      lines.push(group.note)
      lines.push('')
    }

    lines.push(...group.entries)
    lines.push('')
  }

  const outputPath = path.join(outDir, 'llms.txt')
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
  console.log(
    `[llms-txt] Wrote llms.txt (${groups.length} sections, ${groups.reduce(
      (n, g) => n + g.entries.length,
      0
    )} entries)`
  )
}

/**
 * Sections large enough to split into subsections.
 */
const SUBSECTION_THRESHOLD = 30

/**
 * Resolve the URL to link a page by: the generated .md when markdown files are
 * enabled, otherwise the page's own route.
 */
function pageHref(page, { siteUrl, enableMarkdownFiles }) {
  return enableMarkdownFiles
    ? `${siteUrl}/${htmlPathToMdPath(page.htmlRelPath)}`
    : `${siteUrl}${page.routePath}`
}

// --- Docs -------------------------------------------------------------------

/**
 * Group docs pages by section, splitting large sections into subsections.
 * Returns an ordered array of { label, entries } objects.
 */
function buildDocsGroups(pages, labelMap, linkOptions) {
  const topLevel = new Map()

  for (const page of pages) {
    if (page.kind !== 'doc') continue

    // Route: /docs/sources/web-trackers/...
    // Pages at /docs/ with no section (e.g. the landing page) go into get-started
    const parts = page.routePath.split('/').filter(Boolean)
    const section = parts[1] || 'get-started'
    const subsection = parts[2] || null
    addToGroup(topLevel, section, subsection, page)
  }

  // Order sections by sidebar_position from frontmatter
  const sectionKeys = [...topLevel.keys()]
  sectionKeys.sort((a, b) => {
    const posA = labelMap.get(a)?.position ?? Infinity
    const posB = labelMap.get(b)?.position ?? Infinity
    return posA - posB
  })

  const result = []

  for (const sectionKey of sectionKeys) {
    const group = topLevel.get(sectionKey)
    if (!group) continue

    const sectionLabel = labelMap.get(sectionKey)?.label || formatSlug(sectionKey)
    const toGroup = (label, sectionPages) => ({
      label,
      entries: sectionPages.map((page) => formatDocsEntry(page, linkOptions)),
    })

    if (group.total >= SUBSECTION_THRESHOLD && group.subsections.size > 1) {
      // Split into subsections
      // First emit pages that sit directly in the section (no subsection)
      const directPages = group.subsections.get(null)
      if (directPages && directPages.length > 0) {
        result.push(toGroup(sectionLabel, directPages))
      }

      // Then emit each subsection, ordered by sidebar_position
      const subKeys = [...group.subsections.keys()].filter((k) => k !== null)
      subKeys.sort((a, b) => {
        const posA = labelMap.get(a)?.position ?? Infinity
        const posB = labelMap.get(b)?.position ?? Infinity
        if (posA !== posB) return posA - posB
        return a.localeCompare(b)
      })

      for (const subKey of subKeys) {
        const subLabel = labelMap.get(subKey)?.label || formatSlug(subKey)
        result.push(toGroup(`${sectionLabel} > ${subLabel}`, group.subsections.get(subKey)))
      }
    } else {
      result.push(toGroup(sectionLabel, group.allPages))
    }
  }

  return result
}

function formatDocsEntry(page, linkOptions) {
  const prevTag = isPreviousVersion(page.routePath, linkOptions.outdatedPrefixes)
    ? ' [previous version]'
    : ''
  const desc = page.description ? `: ${page.description}` : ''

  return `- [${page.title}](${pageHref(page, linkOptions)})${desc}${prevTag}`
}

// --- Tutorials --------------------------------------------------------------

/**
 * One entry per tutorial rather than per step, linking to the combined
 * tutorial page. The individual steps stay addressable at their own URLs, so
 * this is the index a reader drills down from rather than a full listing.
 */
function buildTutorialsGroup(pages, tutorialMeta, linkOptions) {
  const bySlug = groupTutorialSteps(pages)
  if (bySlug.size === 0) return null

  const entries = []

  for (const [slug, steps] of bySlug) {
    const meta = tutorialMeta.get(slug) || {}
    const title = meta.title || formatSlug(slug)

    // Without per-page markdown files there is no combined page to link to,
    // and no tutorial landing route either, so fall back to the first step.
    const href = linkOptions.enableMarkdownFiles
      ? `${linkOptions.siteUrl}/${tutorialMdPath(slug)}`
      : pageHref(steps[0], linkOptions)

    const desc = meta.description ? `: ${meta.description}` : ''
    const facets = formatTutorialFacets(meta, steps.length)

    entries.push(`- [${title}](${href})${desc} (${facets})`)
  }

  return {
    label: 'Tutorials',
    note: 'Each link returns the complete tutorial as a single page. Individual steps are also published at their own URLs, listed at the top of each tutorial.',
    entries,
  }
}

function formatTutorialFacets(meta, stepCount) {
  const facets = []

  if (meta.label) facets.push(meta.label)
  if (meta.useCase) facets.push(`use case: ${meta.useCase}`)

  const uses = [...(meta.snowplowTech || []), ...(meta.technologies || [])]
  if (uses.length > 0) facets.push(`uses: ${uses.join(', ')}`)

  facets.push(`${stepCount} ${stepCount === 1 ? 'step' : 'steps'}`)

  return facets.join(' · ')
}

// --- Release notes ----------------------------------------------------------

/**
 * A single dated section, newest first. Release notes live one per directory,
 * so the generic docs grouping would give each one its own heading.
 */
function buildReleaseNotesGroup(pages, linkOptions) {
  const releaseNotes = pages.filter((page) => page.kind === 'release-note')
  if (releaseNotes.length === 0) return null

  const entries = releaseNotes.map((page) => {
    const date = page.date ? `${page.date} — ` : ''
    const components = page.components?.length ? ` (${page.components.join(', ')})` : ''
    const desc = page.description ? `: ${page.description}` : ''

    return `- ${date}[${page.title}](${pageHref(page, linkOptions)})${components}${desc}`
  })

  return {
    label: 'Release notes',
    note: 'Changes to Snowplow components, newest first. Each note describes one release and is superseded by later ones for the same component.',
    entries,
  }
}

// --- Shared helpers ---------------------------------------------------------

/**
 * Build a map of slug → { label, position } by reading frontmatter from
 * docs index files. Scans both top-level sections and subsections.
 */
async function buildLabelMap(siteDir) {
  const labelMap = new Map()
  const docsDir = path.join(siteDir, 'docs')

  try {
    await fs.access(docsDir)
  } catch {
    return labelMap
  }

  const topEntries = await fs.readdir(docsDir, { withFileTypes: true })

  for (const entry of topEntries) {
    if (!entry.isDirectory()) continue

    const slug = entry.name
    const indexPath = path.join(docsDir, slug, 'index.md')
    const meta = await readFrontmatter(indexPath)
    if (meta) {
      labelMap.set(slug, meta)
    }

    // Scan subsections
    const subDir = path.join(docsDir, slug)
    let subEntries
    try {
      subEntries = await fs.readdir(subDir, { withFileTypes: true })
    } catch {
      continue
    }

    for (const subEntry of subEntries) {
      if (!subEntry.isDirectory()) continue

      const subSlug = subEntry.name
      const subIndexPath = path.join(subDir, subSlug, 'index.md')
      const subMeta = await readFrontmatter(subIndexPath)
      if (subMeta) {
        labelMap.set(subSlug, subMeta)
      }
    }
  }

  return labelMap
}

/**
 * Read sidebar_label and sidebar_position from an index.md file's frontmatter.
 * Returns { label, position } or null if the file doesn't exist.
 */
async function readFrontmatter(filePath) {
  let content
  try {
    content = await fs.readFile(filePath, 'utf8')
  } catch {
    return null
  }

  if (!content.startsWith('---')) return null

  const endIndex = content.indexOf('---', 3)
  if (endIndex === -1) return null

  const frontmatter = content.slice(3, endIndex)

  const labelMatch = frontmatter.match(/^sidebar_label:\s*"?([^"\n]+)"?\s*$/m)
  const posMatch = frontmatter.match(/^sidebar_position:\s*(\S+)\s*$/m)

  const label = labelMatch ? labelMatch[1].trim() : null
  const position = posMatch ? parseFloat(posMatch[1]) : Infinity

  return label ? { label, position } : null
}

function addToGroup(map, sectionKey, subsectionKey, page) {
  if (!map.has(sectionKey)) {
    map.set(sectionKey, {
      total: 0,
      allPages: [],
      subsections: new Map(),
    })
  }
  const group = map.get(sectionKey)
  group.total++
  group.allPages.push(page)

  if (!group.subsections.has(subsectionKey)) {
    group.subsections.set(subsectionKey, [])
  }
  group.subsections.get(subsectionKey).push(page)
}

/**
 * Convert a URL slug to a readable label.
 * "web-trackers" → "Web trackers"
 */
function formatSlug(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
}
