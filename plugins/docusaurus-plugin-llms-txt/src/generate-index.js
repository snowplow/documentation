import path from 'node:path'
import fs from 'node:fs/promises'
import { htmlPathToMdPath } from './write-pages.js'
import { isPreviousVersion } from './version-utils.js'

/**
 * Generate llms.txt index file.
 */
export async function generateIndex(outDir, pages, options) {
  const { siteTitle, siteDescription, siteUrl, enableMarkdownFiles } = options

  const lines = []
  lines.push(`# ${siteTitle}`)
  lines.push('')

  if (siteDescription) {
    lines.push(`> ${siteDescription}`)
    lines.push('')
  }

  // Group pages hierarchically by docs section
  const groups = groupByDocsSection(pages)

  for (const group of groups) {
    lines.push(`## ${group.label}`)
    lines.push('')

    for (const page of group.pages) {
      const prevTag = isPreviousVersion(page.routePath)
        ? ' [previous version]'
        : ''

      if (enableMarkdownFiles) {
        const mdPath = htmlPathToMdPath(page.htmlRelPath)
        lines.push(`- [${page.title}](${siteUrl}/${mdPath})${prevTag}`)
      } else {
        lines.push(`- [${page.title}](${siteUrl}${page.routePath})${prevTag}`)
      }
    }

    lines.push('')
  }

  const outputPath = path.join(outDir, 'llms.txt')
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
  console.log(`[llms-txt] Wrote llms.txt (${pages.length} pages)`)
}

/**
 * Human-readable labels for docs sections.
 * Keys are the slug from the URL path; values are display labels.
 */
const SECTION_LABELS = {
  'get-started': 'Getting started',
  'fundamentals': 'Fundamentals',
  'sources': 'Sources (trackers & webhooks)',
  'events': 'Events',
  'event-studio': 'Event Studio',
  'pipeline': 'Pipeline',
  'destinations': 'Destinations',
  'modeling-your-data': 'Data modeling',
  'signals': 'Signals',
  'monitoring': 'Monitoring',
  'testing': 'Testing & debugging',
  'api-reference': 'API reference & components',
  'account-management': 'Account management',
  'licensing': 'Licensing',
  'migration-guides': 'Migration guides',
  'glossary': 'Glossary',
}

/**
 * Sections large enough to split into subsections.
 * Maps section slug to the minimum page count that triggers splitting.
 */
const SUBSECTION_THRESHOLD = 30

/**
 * Human-readable labels for common subsection slugs.
 */
const SUBSECTION_LABELS = {
  'web-trackers': 'Web trackers',
  'mobile-trackers': 'Mobile trackers',
  'react-native-tracker': 'React Native tracker',
  'java-tracker': 'Java tracker',
  'scala-tracker': 'Scala tracker',
  'node-js-tracker': 'Node.js tracker',
  'python-tracker': 'Python tracker',
  'google-tag-manager': 'Google Tag Manager',
  'flutter-tracker': 'Flutter tracker',
  'roku-tracker': 'Roku tracker',
  'net-tracker': '.NET tracker',
  'unity-tracker': 'Unity tracker',
  'c-tracker': 'C++ tracker',
  'golang-tracker': 'Go tracker',
  'php-tracker': 'PHP tracker',
  'ruby-tracker': 'Ruby tracker',
  'rust-tracker': 'Rust tracker',
  'webview-tracker': 'WebView tracker',
  'google-amp-tracker': 'Google AMP tracker',
  'snowplow-tracking-cli': 'Snowplow Tracking CLI',
  'lua-tracker': 'Lua tracker',
  'pixel-tracker': 'Pixel tracker',
  'first-party-tracking': 'First-party tracking',
  'tracker-maintenance-classification': 'Tracker maintenance classification',
  'webhooks': 'Webhooks',
  'loaders-storage-targets': 'Loaders & storage targets',
  'snowbridge': 'Snowbridge',
  'iglu': 'Iglu',
  'enrichment-components': 'Enrichment components',
  'stream-collector': 'Stream collector',
  'analytics-sdk': 'Analytics SDKs',
  'snowplow-mini': 'Snowplow Mini',
  'snowplow-micro': 'Snowplow Micro',
  'modeling-your-data-with-dbt': 'dbt',
  'forwarding-events': 'Event forwarding',
  'warehouses-lakes': 'Warehouses & lakes',
  'enrichments': 'Enrichments',
  'recovering-failed-events': 'Recovering failed events',
  'ootb-data': 'Out-of-the-box data',
  'collector': 'Collector',
  'enriched-tsv-format': 'Enriched TSV format',
  'security': 'Security',
  'reverse-etl': 'Reverse ETL',
  'automatically-generated-data-models': 'Automatically generated data models',
  'modeling-your-data-with-sql-runner': 'SQL Runner',
  'running-data-models-via-console': 'Running data models via Console',
  'visualization': 'Visualization',
  'failed-events': 'Failed events',
  'json-schema-reference': 'JSON schema reference',
  'trackers': 'Trackers',
  'versions': 'Versions',
  'dataflow-runner': 'Dataflow Runner',
}

/**
 * Group pages by docs section, splitting large sections into subsections.
 * Returns an ordered array of { label, pages } objects.
 */
function groupByDocsSection(pages) {
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

  // Second pass: decide whether to split large sections
  const result = []

  // Emit sections in a logical order
  const orderedSections = [
    'get-started',
    'fundamentals',
    'sources',
    'events',
    'event-studio',
    'pipeline',
    'destinations',
    'modeling-your-data',
    'signals',
    'monitoring',
    'testing',
    'api-reference',
    'account-management',
    'licensing',
    'migration-guides',
    'glossary',
    'tutorials',
  ]

  // Add any sections not in the ordered list
  for (const key of topLevel.keys()) {
    if (!orderedSections.includes(key)) {
      orderedSections.push(key)
    }
  }

  for (const sectionKey of orderedSections) {
    const group = topLevel.get(sectionKey)
    if (!group) continue

    const sectionLabel =
      sectionKey === 'tutorials'
        ? 'Tutorials'
        : SECTION_LABELS[sectionKey] || formatSlug(sectionKey)

    if (group.total >= SUBSECTION_THRESHOLD && group.subsections.size > 1) {
      // Split into subsections
      // First emit pages that sit directly in the section (no subsection)
      const directPages = group.subsections.get(null)
      if (directPages && directPages.length > 0) {
        result.push({ label: sectionLabel, pages: directPages })
      }

      // Then emit each subsection
      const subKeys = [...group.subsections.keys()].filter((k) => k !== null)
      subKeys.sort()

      for (const subKey of subKeys) {
        const subPages = group.subsections.get(subKey)
        const subLabel =
          SUBSECTION_LABELS[subKey] || formatSlug(subKey)
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
