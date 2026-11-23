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
      'Snowplow Customer Data Infrastructure: getting started, designing tracking, trackers and webhooks, testing and enrichments, destinations, querying and modeling data, identities, monitoring, and core concepts such as events, entities, and schemas.',
  },
  {
    sidebar: 'signals',
    file: 'docs/signals/llms.txt',
    title: 'Snowplow Signals',
    description:
      'Snowplow Signals: getting started, setting up and connecting, data sources (events and warehouse tables), defining attributes, serving them through services and training datasets, feeding AI agents with agentic contexts and the MCP server, and interventions.',
    // Tutorials that use Signals are listed in this index too
    tutorialTech: 'Signals',
    // List the docs under the sidebar's section headers, in sidebar order
    groupBySidebar: true,
    // Hidden in the sidebar, but an entry point worth listing
    includeHidden: ['signals/applications/index'],
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
      'Running and administering Snowplow, for CDI and Signals: deployment options and setup, infrastructure and security, users and access, migration guides, working with AI, and the glossary.',
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

const classesOf = (item) => String(item.className ?? '').split(/\s+/)

/**
 * The section headers of each sidebar, each with the permalinks of the docs
 * under it in sidebar order, from the docs plugin's loaded content. Hidden
 * items are skipped unless their doc ID is in `includeHidden`.
 *
 * @param {import('@docusaurus/types').LoadedPlugin[]} plugins
 * @returns {Map<string, {sidebar: object[], permalinkOf: Map<string, string>}>}
 */
export function buildSidebarOutlines(plugins = []) {
  const outlines = new Map()
  for (const plugin of plugins) {
    if (plugin.name !== 'docusaurus-plugin-content-docs') continue
    for (const version of plugin.content?.loadedVersions ?? []) {
      const permalinkOf = new Map(
        (version.docs ?? []).map((doc) => [doc.id, normalizeRoute(doc.permalink)])
      )
      for (const [name, sidebar] of Object.entries(version.sidebars ?? {})) {
        outlines.set(name, { sidebar, permalinkOf })
      }
    }
  }
  return outlines
}

/**
 * Split a sidebar into its section headers, each listing its doc routes in
 * order, as a whole and per top-level item. Top-level docs outside any header
 * go into a group of their own.
 */
function sidebarSections({ sidebar, permalinkOf }, includeHidden = []) {
  const sections = []
  const collect = (item, out) => {
    const docId =
      item.type === 'doc' || item.type === 'ref'
        ? item.id
        : item.type === 'category' && item.link?.type === 'doc'
          ? item.link.id
          : null
    const hidden = classesOf(item).includes('hidden')
    if (!hidden || includeHidden.includes(docId)) {
      if (docId && permalinkOf.has(docId)) out.push(permalinkOf.get(docId))
    }
    if (item.type === 'category' && !hidden) item.items.forEach((child) => collect(child, out))
    return out
  }
  const entryOf = (item) => ({ label: item.label ?? null, routes: collect(item, []) })
  for (const item of sidebar) {
    if (item.type === 'category' && classesOf(item).includes('section-header')) {
      const items = classesOf(item).includes('hidden') ? [] : item.items.map(entryOf)
      sections.push({ label: item.label, items })
    } else {
      const last = sections[sections.length - 1]
      if (last && last.loose) last.items.push(entryOf(item))
      else sections.push({ label: null, loose: true, items: [entryOf(item)] })
    }
  }
  return sections
    .map((section) => {
      const items = section.items.filter((item) => item.routes.length > 0)
      return { ...section, items, routes: items.flatMap((item) => item.routes) }
    })
    .filter((s) => s.routes.length > 0)
}

/**
 * Docs groups that follow the sidebar's section headers. Pages in the
 * sidebar map but not reached through the outline are listed at the end, so
 * the set of links matches the URL-ordered listing.
 */
function sidebarGroups(docPages, outline, includeHidden, formatEntry) {
  const byRoute = new Map(docPages.map((page) => [normalizeRoute(page.routePath), page]))
  const used = new Set()
  const groups = []
  for (const section of sidebarSections(outline, includeHidden)) {
    const entries = []
    for (const route of section.routes) {
      const page = byRoute.get(route)
      if (!page || used.has(route)) continue
      used.add(route)
      entries.push(formatEntry(page))
    }
    groups.push({ label: section.label ?? 'Overview', entries })
  }
  const rest = docPages.filter((page) => !used.has(normalizeRoute(page.routePath)))
  if (rest.length > 0) groups.push({ label: 'More pages', entries: rest.map(formatEntry) })
  return groups
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
 * @param {{ siteUrl: string, tutorialMeta: Map<string, object>,
 *   sidebarOutlines?: Map<string, object>,
 *   buildTutorialGroups?: (pages: object[]) => object[],
 *   formatDocsEntry?: (page: object) => string }} options
 */
export async function writeProductIndexes(
  outDir,
  pages,
  sidebarMap,
  buildGroups,
  { siteUrl, tutorialMeta, sidebarOutlines = new Map(), buildTutorialGroups, formatDocsEntry }
) {
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

    const outline = sidebarOutlines.get(index.sidebar)
    const ordered = index.groupBySidebar && outline && buildTutorialGroups && formatDocsEntry
    const groups = (
      ordered
        ? [
            ...sidebarGroups(
              subset.filter((page) => page.kind === 'doc'),
              outline,
              index.includeHidden,
              formatDocsEntry
            ),
            ...buildTutorialGroups(subset),
          ]
        : buildGroups(subset)
    ).filter((g) => g && g.entries.length > 0)
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

const slugOf = (label) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const pageCount = (count) => `${count} ${count === 1 ? 'page' : 'pages'}`

export const INLINE_SECTION_PAGES = 1

const SINGLE_INDEX_PRODUCT_PAGES = 50

export function buildSectionIndexes(pages, sidebarMap, sidebarOutlines, formatDocsEntry) {
  return PRODUCT_INDEXES.flatMap((product) => {
    const outline = sidebarOutlines.get(product.sidebar)
    if (!outline) return []

    const docPages = pages.filter(
      (page) =>
        page.kind === 'doc' && sidebarMap.get(normalizeRoute(page.routePath)) === product.sidebar
    )
    const byRoute = new Map(docPages.map((page) => [normalizeRoute(page.routePath), page]))
    const used = new Set()
    const take = (routes) =>
      routes.flatMap((route) => {
        const page = byRoute.get(route)
        if (!page || used.has(route)) return []
        used.add(route)
        return [page]
      })
    const dir = path.posix.dirname(product.file)
    const toSection = (label, items) => {
      const direct = items.filter((item) => item.pages.length === 1).flatMap((item) => item.pages)
      const groups = [
        { label, pages: direct },
        ...items.filter((item) => item.pages.length > 1),
      ].filter((group) => group.pages.length > 0)
      const count = items.reduce((n, item) => n + item.pages.length, 0)
      const topics = items.map((item) => item.label).join('; ')
      return {
        title: `${product.title}: ${label}`,
        label,
        file: `${dir}/${slugOf(label)}/llms.txt`,
        description: `${topics}. ${pageCount(count)}.`,
        pages: items.flatMap((item) => item.pages),
        groups: groups.map((group) => ({
          label: group.label,
          entries: group.pages.map(formatDocsEntry),
        })),
      }
    }

    const outlined = sidebarSections(outline, product.includeHidden).map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          const itemPages = take(item.routes)
          return { label: item.label ?? itemPages[0]?.title, pages: itemPages }
        })
        .filter((item) => item.pages.length > 0),
    }))
    const rest = docPages.filter((page) => !used.has(normalizeRoute(page.routePath)))

    const sections = [
      ...outlined
        .filter((section) => !section.loose && section.items.length > 0)
        .map((section) => toSection(section.label, section.items)),
    ]
    const isSmall = (section) => section.pages.length <= INLINE_SECTION_PAGES

    if (docPages.length <= SINGLE_INDEX_PRODUCT_PAGES) {
      const topics = sections.map((section) => section.label).join('; ')
      return [
        {
          product,
          wholeProduct: { description: `${topics}. ${pageCount(docPages.length)}.`, pages: docPages },
          rootPages: [],
          sections: [],
        },
      ]
    }

    const withRest = [
      ...sections,
      ...(rest.length > 0
        ? [toSection('More pages', rest.map((page) => ({ label: page.title, pages: [page] })))]
        : []),
    ]

    return [
      {
        product,
        rootPages: [
          ...outlined
            .filter((section) => section.loose)
            .flatMap((section) => section.items.flatMap((item) => item.pages)),
          ...withRest.filter(isSmall).flatMap((section) => section.pages),
        ],
        sections: withRest.filter((section) => !isSmall(section)),
      },
    ]
  })
}

export function buildSectionRouter(productSections, siteUrl, formatDocsEntry) {
  return productSections.flatMap(({ product, wholeProduct, rootPages, sections }) => [
    `## ${product.title}`,
    '',
    product.description,
    '',
    ...(wholeProduct
      ? [`- [${product.title}](${siteUrl}/${product.file}): ${wholeProduct.description}`]
      : []),
    ...rootPages.map(formatDocsEntry),
    ...sections.map(
      (section) => `- [${section.label}](${siteUrl}/${section.file}): ${section.description}`
    ),
    '',
  ])
}

export async function writeIndexFile(outDir, { file, title, description, groups }, siteUrl) {
  const lines = [`# ${title}`, '', `> ${description}`, '']
  lines.push(
    `This index lists the pages in one section of the Snowplow documentation. The other sections are listed in ${siteUrl}/llms.txt. Read the instructions for AI agents at the top of that file before you write Snowplow code. Every link points to a Markdown copy of the page.`
  )
  lines.push('')

  for (const group of groups) {
    lines.push(`## ${group.label}`, '')
    if (group.note) lines.push(group.note, '')
    lines.push(...group.entries, '')
  }

  const outputPath = path.join(outDir, file)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
  const count = groups.reduce((n, g) => n + g.entries.length, 0)
  console.log(`[llms-txt] Wrote ${file} (${count} entries)`)
}
