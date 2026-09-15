import { findFirstSidebarItemLink } from '@docusaurus/plugin-content-docs/client'
import type {
  PropSidebar,
  PropSidebarItem,
} from '@docusaurus/plugin-content-docs'

import { TABS } from '@site/src/components/tutorials/TutorialTabs'
import { getActiveSidebar, getLastDocsSidebar } from './pageContext'
import { readNumber, requireString, type WebMcpTool } from './types'

export type AlgoliaConfig = {
  appId: string
  apiKey: string
  indexName: string
}

type DocsToolsOptions = {
  // Null when the site has no Algolia config, in which case `search_docs` is
  // left out and the other tools carry on.
  algolia: AlgoliaConfig | null
  navigate: (path: string) => void
}

const DEFAULT_SEARCH_LIMIT = 10
const MAX_SEARCH_LIMIT = 30

// How long to wait for the SPA to render a route after navigating to it, before
// falling back to whatever is on screen, and how often to look.
const ROUTE_RENDER_TIMEOUT_MS = 3000
const ROUTE_POLL_INTERVAL_MS = 50

type SidebarEntry = {
  type: PropSidebarItem['type']
  label: string
  href: string | null
}

// --- Paths ------------------------------------------------------------------

// The site is built with `trailingSlash: true`, so sidebar hrefs and
// `location.pathname` both end in a slash while Algolia records and
// hand-written links often don't. Compare on a normalized form.
function normalizePath(path: string): string {
  const withoutTrailingSlash = path.replace(/\/+$/, '')
  return withoutTrailingSlash === '' ? '/' : withoutTrailingSlash
}

// The route a path addresses, without the query string or hash.
function routePath(path: string): string {
  return normalizePath(path.split(/[?#]/)[0])
}

// Accepts a site-relative path or an absolute URL on this site. Search results
// carry absolute `docs.snowplow.io` URLs, which stay valid on a preview or a
// local build, so those are resolved to a path rather than rejected.
function toSitePath(input: string): string {
  const url = new URL(input, window.location.origin)
  const isSameSite =
    url.origin === window.location.origin || url.hostname === 'docs.snowplow.io'

  if (!isSameSite) {
    throw new Error(
      `\`url\` must point at this documentation site, got ${url.origin}.`
    )
  }

  return `${url.pathname}${url.search}${url.hash}`
}

function toSitePathOrNull(input: string): string | null {
  try {
    return toSitePath(input)
  } catch {
    return null
  }
}

// --- Search -----------------------------------------------------------------

type AlgoliaHit = {
  url?: string
  hierarchy?: Record<string, string | null>
  content?: string | null
  _snippetResult?: { content?: { value?: string } }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function collapse(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

// Only a snippet carries markup, and only Algolia's own highlight tags. Raw
// indexed text is left alone, so a heading like "Add the <script> tag" survives.
function snippetText(value: string): string {
  return collapse(decodeEntities(value.replace(/<[^>]*>/g, '')))
}

// DocSearch records store the page's place in the site under `hierarchy`:
// `lvl0` is the section, `lvl1` the page title, `lvl2`-`lvl6` its headings.
function hitTitle(hierarchy: Record<string, string | null>): string {
  const levels = ['lvl6', 'lvl5', 'lvl4', 'lvl3', 'lvl2', 'lvl1']
  const deepest = levels.map((level) => hierarchy[level]).find(Boolean)
  return collapse(deepest ?? hierarchy.lvl0 ?? 'Untitled')
}

async function searchAlgolia(
  algolia: AlgoliaConfig,
  query: string,
  limit: number,
  signal: AbortSignal | undefined
) {
  // Credentials go in the query string, the way Algolia's own browser client
  // sends them, so the request stays a simple CORS request with no preflight.
  const endpoint = new URL(
    `https://${algolia.appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(
      algolia.indexName
    )}/query`
  )
  endpoint.searchParams.set('x-algolia-application-id', algolia.appId)
  endpoint.searchParams.set('x-algolia-api-key', algolia.apiKey)

  const response = await fetch(endpoint.toString(), {
    method: 'POST',
    signal,
    body: JSON.stringify({
      query,
      hitsPerPage: limit,
      attributesToRetrieve: ['hierarchy', 'url', 'content'],
      attributesToSnippet: ['content:30'],
      snippetEllipsisText: '…',
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Documentation search is unavailable (Algolia responded ${response.status}).`
    )
  }

  const body: { hits?: AlgoliaHit[] } = await response.json()

  return (body.hits ?? []).flatMap((hit) => {
    const url = typeof hit.url === 'string' ? toSitePathOrNull(hit.url) : null
    if (url === null) {
      return []
    }
    const hierarchy = hit.hierarchy ?? {}
    const highlighted = hit._snippetResult?.content?.value
    const snippet = highlighted
      ? snippetText(highlighted)
      : hit.content
      ? collapse(hit.content)
      : null

    return [
      {
        title: hitTitle(hierarchy),
        section: hierarchy.lvl0 ? collapse(hierarchy.lvl0) : null,
        url,
        snippet,
      },
    ]
  })
}

// --- Page content -----------------------------------------------------------

// Every page is published alongside a Markdown twin by the llms-txt plugin:
// `/docs/fundamentals/events/` is also served at `/docs/fundamentals/events.md`.
// This is the same URL the page's own "Copy Markdown" button uses.
function markdownUrl(path: string): string {
  const base = routePath(path)
  return base === '/' ? '/index.md' : `${base}.md`
}

function articleElement(): Element | null {
  return (
    document.querySelector('.theme-doc-markdown') ??
    document.querySelector('main')
  )
}

// Resolves once the route has actually rendered. `pushState` updates the path
// synchronously, so the path alone would let a caller read the page it was on
// before; wait for React to swap the article node too.
function waitForRoute(path: string, previous: Element | null): Promise<void> {
  const target = routePath(path)
  const rendered = () =>
    routePath(window.location.pathname) === target &&
    articleElement() !== previous

  return new Promise((resolve) => {
    if (rendered()) {
      resolve()
      return
    }

    // A poll rather than animation frames: an agent may be driving a tab that is
    // in the background, where frames never fire and this would never settle.
    const poll = window.setInterval(() => {
      if (rendered()) {
        finish()
      }
    }, ROUTE_POLL_INTERVAL_MS)
    const deadline = window.setTimeout(finish, ROUTE_RENDER_TIMEOUT_MS)

    function finish() {
      window.clearInterval(poll)
      window.clearTimeout(deadline)
      resolve()
    }
  })
}

// Some hosts answer an unknown path with the SPA shell at 200 rather than 404.
function looksLikeHtml(response: Response, body: string): boolean {
  return (
    (response.headers.get('content-type') ?? '').includes('text/html') ||
    /^\s*<(!doctype|html)/i.test(body)
  )
}

function renderedText(): string {
  const article = articleElement()
  return article instanceof HTMLElement ? article.innerText.trim() : ''
}

// --- Sidebar ----------------------------------------------------------------

function itemHref(item: PropSidebarItem): string | null {
  if (item.type === 'link') {
    return item.href
  }
  if (item.type === 'category') {
    return item.href ?? findFirstSidebarItemLink(item) ?? null
  }
  return null
}

function toEntry(item: PropSidebarItem): SidebarEntry | null {
  if (item.type === 'html') {
    return null
  }
  return { type: item.type, label: item.label, href: itemHref(item) }
}

function toEntries(items: PropSidebarItem[]): SidebarEntry[] {
  return items
    .map(toEntry)
    .filter((entry): entry is SidebarEntry => entry !== null)
}

// Walks the sidebar to the item for `path`, returning the chain of items from
// the top-level section down to it, or null when the page isn't in the sidebar.
function findTrail(
  items: PropSidebarItem[],
  path: string
): PropSidebarItem[] | null {
  for (const item of items) {
    // Look inside first: `sidebars.js` gives a section wrapper the link of its
    // first child, and that child is still in the section, so matching the
    // wrapper would stop one level too high.
    if (item.type === 'category') {
      const trail = findTrail(item.items, path)
      if (trail) {
        return [item, ...trail]
      }
    }
    const href = item.type === 'html' ? null : itemHref(item)
    if (href && normalizePath(href) === path) {
      return [item]
    }
  }
  return null
}

function siblingsOf(
  sidebar: PropSidebar,
  trail: PropSidebarItem[]
): PropSidebarItem[] {
  const parent = trail[trail.length - 2]
  if (parent && parent.type === 'category') {
    return parent.items
  }
  return sidebar
}

// --- Tools ------------------------------------------------------------------

function searchDocsTool(algolia: AlgoliaConfig): WebMcpTool {
  return {
    name: 'search_docs',
    description:
      "Searches documentation for the provided query and returns matching doc articles. Perform a keyword search using the site's documentation search interface.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Keywords to search for, for example "collector configuration" or "iOS tracker".',
        },
        limit: {
          type: 'number',
          description: `Maximum number of results to return. Defaults to ${DEFAULT_SEARCH_LIMIT}, maximum ${MAX_SEARCH_LIMIT}.`,
        },
      },
      required: ['query'],
    },
    async execute(input, options) {
      const query = requireString(input, 'query')
      const requested = readNumber(input, 'limit') ?? DEFAULT_SEARCH_LIMIT
      const limit = Math.min(
        Math.max(Math.trunc(requested), 1),
        MAX_SEARCH_LIMIT
      )
      const results = await searchAlgolia(
        algolia,
        query,
        limit,
        options?.signal
      )

      return {
        query,
        count: results.length,
        results,
        hint: 'Call open_doc with a result url to read the full article.',
      }
    },
  }
}

export function createDocsTools({
  algolia,
  navigate,
}: DocsToolsOptions): WebMcpTool[] {
  const searchTools: WebMcpTool[] = algolia ? [searchDocsTool(algolia)] : []

  return [
    ...searchTools,
    {
      name: 'list_navigation_sections',
      description:
        'Lists main documentation sections and featured categories from the website navigation. List top-level documentation sections, categories, and featured guides from site navigation.',
      annotations: { readOnlyHint: true },
      inputSchema: { type: 'object', properties: {} },
      async execute() {
        const sidebar = getLastDocsSidebar()
        const sections = sidebar
          ? sidebar.items.flatMap((item) => {
              const entry = toEntry(item)
              if (!entry) {
                return []
              }
              const categories =
                item.type === 'category' ? toEntries(item.items) : []
              return [{ ...entry, categories }]
            })
          : []

        return {
          areas: TABS.map((tab) => ({ label: tab.label, href: tab.value })),
          sections,
          ...(sections.length === 0 && {
            note: 'The docs section list is only built while a /docs/ page is open, and none has been opened yet in this tab. The areas above are still accurate; opening any /docs/ page fills in the sections.',
          }),
        }
      },
    },

    {
      name: 'open_doc',
      description:
        'Navigates to the specified documentation article URL and returns its content as Markdown. Navigate to a documentation article or tutorial by URL and return the page content.',
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description:
              'The article to open, either a path such as "/docs/fundamentals/events/" or a full docs.snowplow.io URL.',
          },
        },
        required: ['url'],
      },
      async execute(input, options) {
        const path = toSitePath(requireString(input, 'url'))
        const alreadyOpen =
          routePath(window.location.pathname) === routePath(path)
        const previous = alreadyOpen ? null : articleElement()

        navigate(path)
        if (!alreadyOpen) {
          await waitForRoute(path, previous)
        }

        const response = await fetch(markdownUrl(path), {
          signal: options?.signal,
        })
        const markdown = response.ok ? await response.text() : null
        if (markdown !== null && !looksLikeHtml(response, markdown)) {
          return {
            url: path,
            title: document.title,
            format: 'markdown',
            content: markdown,
          }
        }

        // The Markdown twins are written during the production build, so on a
        // dev server they aren't there. Read the rendered page instead.
        const text = renderedText()
        if (text === '') {
          throw new Error(
            `${path} has no readable article content. Index pages are not articles: use list_tutorials for the tutorials index, or list_navigation_sections for the documentation sections.`
          )
        }

        return {
          url: path,
          title: document.title,
          format: 'text',
          content: text,
        }
      },
    },

    {
      name: 'list_sidebar_topics',
      description:
        'Lists all related topics and section links in the documentation sidebar. List adjacent documentation topics and categories from the active sidebar.',
      annotations: { readOnlyHint: true },
      inputSchema: { type: 'object', properties: {} },
      async execute() {
        const sidebar = getActiveSidebar()
        const currentPath = window.location.pathname

        if (!sidebar) {
          return {
            currentPath,
            breadcrumbs: [],
            siblings: [],
            children: [],
            note: 'This page has no documentation sidebar. Tutorials and release notes use their own navigation: call list_tutorials or get_tutorial instead.',
          }
        }

        const trail = findTrail(sidebar.items, normalizePath(currentPath))
        const current = trail?.[trail.length - 1]

        return {
          sidebar: sidebar.name,
          currentPath,
          breadcrumbs: trail ? toEntries(trail.slice(0, -1)) : [],
          siblings: toEntries(
            trail ? siblingsOf(sidebar.items, trail) : sidebar.items
          ),
          children:
            current && current.type === 'category'
              ? toEntries(current.items)
              : [],
        }
      },
    },
  ]
}
