import path from 'node:path'
import fs from 'node:fs/promises'
import { htmlPathToMdPath, tutorialMdPath } from './write-pages.js'
import { isPreviousVersion } from './version-utils.js'
import { groupTutorialSteps } from './content-metadata.js'
import { buildAgentInstructions } from './agent-instructions.js'
import { buildProductRouter, writeProductIndexes } from './product-indexes.js'

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
    agentInstructions = true,
    sidebarMap = new Map(),
    sidebarOutlines = new Map(),
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

  lines.push(...buildReadingGuide(siteUrl))

  if (agentInstructions) {
    lines.push(...(await buildAgentInstructions({ siteDir, siteUrl: '' })))
  }

  if (sidebarMap.size > 0) {
    lines.push(...buildProductRouter(siteUrl))
  }

  const releaseNotes = buildReleaseNotesGroup(pages, linkOptions)
  if (releaseNotes) {
    lines.push('## Release notes')
    lines.push('')
    lines.push(
      `Release notes aren't listed in this file. They have their own index, newest first: /${RELEASE_NOTES_INDEX}`
    )
    lines.push('')
    await writeReleaseNotesIndex(outDir, releaseNotes)
  }

  const tree = buildPageTree(pages, labelMap, tutorialMeta, outdatedPrefixes)
  const treeLines = renderTree(tree)
  lines.push('## Pages')
  lines.push('')
  lines.push(...treeLines)
  lines.push('')

  const outputPath = path.join(outDir, 'llms.txt')
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')

  // The docs and tutorials groups, one file per product sidebar
  await writeProductIndexes(
    outDir,
    pages,
    sidebarMap,
    (subset) => [
      ...buildDocsGroups(subset, labelMap, linkOptions),
      buildTutorialsGroup(subset, tutorialMeta, linkOptions),
    ],
    {
      siteUrl,
      tutorialMeta,
      sidebarOutlines,
      buildTutorialGroups: (subset) => [buildTutorialsGroup(subset, tutorialMeta, linkOptions)],
      formatDocsEntry: (page) => formatDocsEntry(page, linkOptions),
    }
  )
  console.log(`[llms-txt] Wrote llms.txt (${treeLines.length} lines in the page tree)`)
}

function buildReadingGuide(siteUrl) {
  return [
    '## How to build a page URL',
    '',
    `Every path in this file is relative to \`${siteUrl}\`. Put that base in front of a path to get the full URL: \`/docs/sources.md\` is \`${siteUrl}/docs/sources.md\`.`,
    '',
    'The "Pages" section at the end of this file lists every page as a tree that follows the URL path. Each line is `<path segment>: <title>. <description>`, indented one space deeper than its parent. To build the URL of a page:',
    '',
    "1. Start at the page's line and take its path segment.",
    "2. Walk up to its parent, the nearest line above with one space less of indentation, then to that line's parent, until you reach a line with no indentation. Take the path segment of each.",
    `3. Join the segments from the top down with \`/\`, put \`${siteUrl}/\` in front and \`.md\` at the end.`,
    '',
    'For example, in this tree',
    '',
    '```',
    'docs: Snowplow documentation. ...',
    ' sources: Snowplow sources overview. ...',
    '  web-trackers: Web tracker SDKs. ...',
    '   tracking-events: Track data out-of-the-box with the web trackers. ...',
    '  mobile-trackers: Native mobile tracker SDKs. ...',
    '```',
    '',
    `the "Track data out-of-the-box with the web trackers" page is \`${siteUrl}/docs/sources/web-trackers/tracking-events.md\` and the "Native mobile tracker SDKs" page is \`${siteUrl}/docs/sources/mobile-trackers.md\`.`,
    '',
    'A line that ends in `/` and has no title is a folder with no page of its own. Only the lines below it are pages, and its path segment is the name without the `/`.',
    '',
    'A line marked `[previous version]` describes an old version of a component. Each line under `tutorials` is a complete tutorial as a single page. Its steps are also published at their own URLs, listed at the top of the tutorial.',
    '',
  ]
}

function newNode() {
  return { text: null, children: new Map() }
}

function addToTree(root, segments, text) {
  let node = root
  for (const segment of segments) {
    if (!node.children.has(segment)) node.children.set(segment, newNode())
    node = node.children.get(segment)
  }
  node.text = text
}

function buildPageTree(pages, labelMap, tutorialMeta, outdatedPrefixes) {
  const root = newNode()

  for (const page of pages) {
    if (page.kind !== 'doc') continue
    const prevTag = isPreviousVersion(page.routePath, outdatedPrefixes) ? ' [previous version]' : ''
    addToTree(
      root,
      page.routePath.split('/').filter(Boolean),
      `${titleWithDescription(page.title, page.description)}${prevTag}`
    )
  }

  const docs = root.children.get('docs')
  if (docs) {
    sortBySidebarPosition(docs, labelMap)
    for (const section of docs.children.values()) sortBySidebarPosition(section, labelMap)
  }

  for (const [slug, steps] of groupTutorialSteps(pages)) {
    const meta = tutorialMeta.get(slug) || {}
    addToTree(
      root,
      ['tutorials', slug],
      `${titleWithDescription(meta.title || formatSlug(slug), meta.description)} (${formatTutorialFacets(meta, steps.length)})`
    )
  }

  return root
}

function sortBySidebarPosition(node, labelMap) {
  const position = ([slug]) => labelMap.get(slug)?.position ?? Infinity
  node.children = new Map([...node.children].sort((a, b) => position(a) - position(b)))
}

function titleWithDescription(title, description) {
  if (!description) return title
  return `${title}${/[.?!]$/.test(title) ? '' : '.'} ${description}`
}

function renderTree(node, depth = 0, lines = []) {
  for (const [segment, child] of node.children) {
    lines.push(`${' '.repeat(depth)}${segment}${child.text ? `: ${child.text}` : '/'}`)
    renderTree(child, depth + 1, lines)
  }
  return lines
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

/**
 * Keep the separators ASCII. These files are served as text/plain and
 * text/markdown with no charset, so any multi-byte character we introduce
 * turns into mojibake for clients that fall back to Latin-1.
 */
function formatTutorialFacets(meta, stepCount) {
  const facets = []

  if (meta.label) facets.push(meta.label)
  if (meta.useCase) facets.push(`use case: ${meta.useCase}`)

  const uses = [...(meta.snowplowTech || []), ...(meta.technologies || [])]
  if (uses.length > 0) facets.push(`uses: ${uses.join(', ')}`)

  facets.push(`${stepCount} ${stepCount === 1 ? 'step' : 'steps'}`)

  return facets.join('; ')
}

// --- Release notes ----------------------------------------------------------

const RELEASE_NOTES_INDEX = 'release-notes/llms.txt'

/**
 * A single dated section, newest first. Release notes live one per directory,
 * so the generic docs grouping would give each one its own heading.
 */
function buildReleaseNotesGroup(pages, linkOptions) {
  const releaseNotes = pages.filter((page) => page.kind === 'release-note')
  if (releaseNotes.length === 0) return null

  const entries = releaseNotes.map((page) => {
    const date = page.date ? `${page.date} ` : ''
    const components = page.components?.length ? ` (${page.components.join(', ')})` : ''
    const desc = page.description ? `: ${page.description}` : ''

    return `- ${date}[${page.title}](${pageHref(page, linkOptions)})${components}${desc}`
  })

  return {
    label: 'Snowplow release notes',
    note: 'Changes to Snowplow components, newest first. Each note describes one release and is superseded by later ones for the same component.',
    entries,
  }
}

async function writeReleaseNotesIndex(outDir, group) {
  const lines = [`# ${group.label}`, '', group.note, '', ...group.entries, '']
  const outputPath = path.join(outDir, RELEASE_NOTES_INDEX)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
  console.log(`[llms-txt] Wrote ${RELEASE_NOTES_INDEX} (${group.entries.length} entries)`)
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
