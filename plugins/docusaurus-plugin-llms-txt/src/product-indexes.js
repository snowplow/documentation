import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * The per-product indexes. Each is an llms.txt-format file listing the docs
 * pages in one sidebar (see sidebars.js), so an agent working on one product
 * can fetch a smaller index. The root llms.txt links to them.
 *
 * `file` is the output path relative to the build directory.
 */
export const PRODUCT_INDEXES = [
  {
    sidebar: 'cdi',
    file: 'docs/cdi/llms.txt',
    title: 'Snowplow CDI',
    description:
      'Snowplow Customer Data Infrastructure: designing tracking, trackers and webhooks, the pipeline and enrichments, destinations, data models, identities, and monitoring.',
  },
  {
    sidebar: 'signals',
    file: 'docs/signals/llms.txt',
    title: 'Snowplow Signals',
    description:
      'Snowplow Signals: connecting to Signals, defining attributes and agentic contexts, serving them through services and the MCP server, and interventions.',
    // Tutorials that use Signals are listed in this index too
    tutorialTech: 'Signals',
  },
  {
    sidebar: 'reference',
    file: 'docs/api-reference/llms.txt',
    title: 'Snowplow reference',
    description:
      'Reference material shared by Snowplow CDI and Signals: APIs, tracker and SDK reference, component configuration, schemas, versions and compatibility, and previous versions of components.',
  },
  {
    sidebar: 'platform',
    file: 'docs/platform/llms.txt',
    title: 'Snowplow platform and AI',
    description:
      'Pages shared by Snowplow CDI and Signals: fundamentals, working with AI, account management, security and licensing, migration guides, and the glossary.',
  },
]

function normalizeRoute(route) {
  return route.endsWith('/') ? route : `${route}/`
}

/**
 * Map each docs route to the sidebar it's in, from the docs plugin's loaded
 * content. Routes in no sidebar map to nothing.
 *
 * @param {import('@docusaurus/types').LoadedPlugin[]} plugins
 */
export function buildSidebarMap(plugins = []) {
  const map = new Map()
  for (const plugin of plugins) {
    if (plugin.name !== 'docusaurus-plugin-content-docs') continue
    for (const version of plugin.content?.loadedVersions ?? []) {
      for (const doc of version.docs ?? []) {
        if (doc.sidebar) map.set(normalizeRoute(doc.permalink), doc.sidebar)
      }
    }
  }
  return map
}

/**
 * The "Indexes by product" section for the top of the root llms.txt.
 */
export function buildProductRouter(siteUrl) {
  const lines = ['## Indexes by product', '']
  lines.push(
    'Each index below lists the pages for one part of the docs, in the same format as this file. Fetch the one that matches your task instead of reading this whole file.'
  )
  lines.push('')
  for (const index of PRODUCT_INDEXES) {
    lines.push(`- [${index.title}](${siteUrl}/${index.file}): ${index.description}`)
  }
  lines.push('')
  return lines
}

/**
 * Write one index per product.
 *
 * @param {string} outDir build directory
 * @param {object[]} pages converted pages, in output order
 * @param {Map<string, string>} sidebarMap route to sidebar
 * @param {(pages: object[], meta: object) => {label: string, entries: string[], note?: string}[]} buildGroups
 *   builds the docs and tutorials groups for a subset of pages, as in llms.txt
 * @param {{ siteUrl: string, tutorialMeta: Map<string, object> }} options
 */
export async function writeProductIndexes(outDir, pages, sidebarMap, buildGroups, { siteUrl, tutorialMeta }) {
  if (sidebarMap.size === 0) {
    console.warn('[llms-txt] No sidebar data from the docs plugin, so no product indexes were written')
    return
  }

  for (const index of PRODUCT_INDEXES) {
    const subset = pages.filter((page) => {
      if (page.kind === 'doc') return sidebarMap.get(normalizeRoute(page.routePath)) === index.sidebar
      if (page.kind === 'tutorial-step' && index.tutorialTech) {
        const meta = tutorialMeta.get(page.tutorialSlug) || {}
        return (meta.snowplowTech || []).includes(index.tutorialTech)
      }
      return false
    })

    const groups = buildGroups(subset).filter((g) => g && g.entries.length > 0)
    const lines = [`# ${index.title}`, '', `> ${index.description}`, '']
    lines.push(
      `This index is part of the Snowplow documentation. Read the instructions for AI agents at the top of ${siteUrl}/llms.txt before you write Snowplow code. Every link points to a Markdown copy of the page.`
    )
    lines.push('')

    for (const group of groups) {
      lines.push(`## ${group.label}`, '')
      if (group.note) lines.push(group.note, '')
      lines.push(...group.entries, '')
    }

    const outputPath = path.join(outDir, index.file)
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
    const count = groups.reduce((n, g) => n + g.entries.length, 0)
    console.log(`[llms-txt] Wrote ${index.file} (${count} entries)`)
  }
}
