import path from 'node:path'
import fs from 'node:fs/promises'
import { htmlPathToMdPath } from './write-pages.js'
import { isPreviousVersion } from './version-utils.js'

/**
 * Generate llms.txt index file.
 */
export async function generateIndex(outDir, pages, options) {
  const { siteTitle, siteDescription, siteUrl, enableMarkdownFiles, siteDir, outdatedPrefixes } =
    options

  const labelMap = await buildLabelMap(siteDir)

  const lines = []
  lines.push(`# ${siteTitle}`)
  lines.push('')

  if (siteDescription) {
    lines.push(`> ${siteDescription}`)
    lines.push('')
  }

  // Group pages hierarchically by docs section
  const groups = groupByDocsSection(pages, labelMap)

  for (const group of groups) {
    lines.push(`## ${group.label}`)
    lines.push('')

    for (const page of group.pages) {
      const prevTag = isPreviousVersion(page.routePath, outdatedPrefixes)
        ? ' [previous version]'
        : ''

      const desc = page.description ? `: ${page.description}` : ''

      if (enableMarkdownFiles) {
        const mdPath = htmlPathToMdPath(page.htmlRelPath)
        lines.push(`- [${page.title}](${siteUrl}/${mdPath})${desc}${prevTag}`)
      } else {
        lines.push(`- [${page.title}](${siteUrl}${page.routePath})${desc}${prevTag}`)
      }
    }

    lines.push('')
  }

  const outputPath = path.join(outDir, 'llms.txt')
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
  console.log(`[llms-txt] Wrote llms.txt (${pages.length} pages)`)
}

/**
 * Sections large enough to split into subsections.
 */
const SUBSECTION_THRESHOLD = 30

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

/**
 * Group pages by docs section, splitting large sections into subsections.
 * Returns an ordered array of { label, pages } objects.
 */
function groupByDocsSection(pages, labelMap) {
  // First pass: group by top-level section (e.g. "sources", "api-reference")
  const topLevel = new Map()

  for (const page of pages) {
    // Route: /docs/sources/web-trackers/... or /tutorials/...
    const parts = page.routePath.split('/').filter(Boolean)
    const root = parts[0] // "docs" or "tutorials"

    if (root === 'tutorials') {
      addToGroup(topLevel, 'tutorials', null, page)
    } else {
      // parts[1] is the docs section slug
      // Pages at /docs/ with no section (e.g. the landing page) go into get-started
      const section = parts[1] || 'get-started'
      const subsection = parts[2] || null
      addToGroup(topLevel, section, subsection, page)
    }
  }

  // Order sections by sidebar_position from frontmatter
  const sectionKeys = [...topLevel.keys()]
  sectionKeys.sort((a, b) => {
    if (a === 'tutorials') return 1
    if (b === 'tutorials') return -1
    const posA = labelMap.get(a)?.position ?? Infinity
    const posB = labelMap.get(b)?.position ?? Infinity
    return posA - posB
  })

  // Second pass: decide whether to split large sections
  const result = []

  for (const sectionKey of sectionKeys) {
    const group = topLevel.get(sectionKey)
    if (!group) continue

    const sectionLabel =
      sectionKey === 'tutorials'
        ? 'Tutorials'
        : labelMap.get(sectionKey)?.label || formatSlug(sectionKey)

    if (group.total >= SUBSECTION_THRESHOLD && group.subsections.size > 1) {
      // Split into subsections
      // First emit pages that sit directly in the section (no subsection)
      const directPages = group.subsections.get(null)
      if (directPages && directPages.length > 0) {
        result.push({ label: sectionLabel, pages: directPages })
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
        const subPages = group.subsections.get(subKey)
        const subLabel = labelMap.get(subKey)?.label || formatSlug(subKey)
        result.push({
          label: `${sectionLabel} > ${subLabel}`,
          pages: subPages,
        })
      }
    } else {
      // Emit as a single section
      result.push({ label: sectionLabel, pages: group.allPages })
    }
  }

  return result
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
