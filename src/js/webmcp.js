/**
 * WebMCP tools for the docs site.
 *
 * Registers four tools with the browser's model context so an agent (for
 * example the ChatGPT desktop app's built-in browser) can search the docs,
 * browse tutorials, read tutorial progress, and book a demo without driving
 * the UI by hand. Spec: https://webmachinelearning.github.io/webmcp/
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import siteConfig from '@generated/docusaurus.config'

const MAX_SEARCH_RESULTS = 10
const PROGRESS_STORAGE_PREFIX = 'tutorial-progress-'

function textResult(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value)
  return { content: [{ type: 'text', text }] }
}

function errorResult(message) {
  return { ...textResult(message), isError: true }
}

function absoluteUrl(path) {
  return new URL(`${trimTrailingSlash(path)}/`, window.location.origin).href
}

function includesIgnoringCase(haystack, needle) {
  return haystack.toLowerCase().includes(String(needle).trim().toLowerCase())
}

function unique(values) {
  return Array.from(new Set(values)).sort()
}

function trimTrailingSlash(path) {
  return path.replace(/\/+$/, '')
}

// Loaded on demand: the tutorial helpers pull in every tutorial page through
// require.context, which the rest of the site only needs on tutorial routes.
async function loadTutorials() {
  const { getMetaData, getSteps } = await import(
    '@site/src/components/tutorials/utils'
  )
  return getMetaData().map((meta) => ({ meta, steps: getSteps(meta.id) }))
}

// The tutorial progress tracker stores the paths of the steps the reader has
// finished under this key, one array per tutorial.
function readCompletedStepPaths(tutorialId) {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(`${PROGRESS_STORAGE_PREFIX}${tutorialId}`) ??
        '[]'
    )
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function summarizeTutorial({ meta, steps }) {
  return {
    slug: meta.id,
    title: meta.title,
    description: meta.description,
    topic: meta.label,
    useCase: meta.useCase,
    technologies: meta.technologies,
    snowplowTech: meta.snowplowTech,
    totalSteps: steps.length,
    url: steps.length > 0 ? absoluteUrl(steps[0].path) : null,
  }
}

function availableFilterValues(tutorials) {
  return {
    useCases: unique(tutorials.map(({ meta }) => meta.useCase)),
    topics: unique(tutorials.map(({ meta }) => meta.label)),
    technologies: unique(
      tutorials.flatMap(({ meta }) => [
        ...meta.technologies,
        ...meta.snowplowTech,
      ])
    ),
  }
}

function formatSearchHit(hit) {
  const { lvl0, lvl1, ...deeperLevels } = hit.hierarchy ?? {}
  const headings = Object.values(deeperLevels).filter(Boolean).join(' > ')
  const excerpt = [headings, hit.content].filter(Boolean).join(': ')
  return {
    title: lvl1 || lvl0 || hit.url,
    url: hit.url,
    excerpt: excerpt.slice(0, 240),
    hasContent: Boolean(hit.content),
  }
}

// Queries the same Algolia DocSearch index that powers the site's search box.
async function searchDocs({ query }) {
  if (typeof query !== 'string' || query.trim() === '') {
    return errorResult('Provide a non-empty search query.')
  }

  const { appId, apiKey, indexName } = siteConfig.themeConfig.algolia
  const response = await fetch(
    `https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-Application-Id': appId,
        'X-Algolia-API-Key': apiKey,
      },
      body: JSON.stringify({
        query,
        hitsPerPage: 20,
        attributesToRetrieve: ['hierarchy', 'content', 'type', 'url'],
      }),
    }
  )
  if (!response.ok) {
    return errorResult(`Documentation search failed (HTTP ${response.status}).`)
  }

  const { hits = [] } = await response.json()
  // The index holds one record per heading or paragraph. Keep the best-ranked
  // hit per page, but take the excerpt from the first hit that has body text.
  const pages = new Map()
  for (const hit of hits) {
    const pageUrl = hit.url.split('#')[0]
    const page = pages.get(pageUrl)
    if (!page) {
      pages.set(pageUrl, formatSearchHit(hit))
    } else if (!page.hasContent && hit.content) {
      pages.set(pageUrl, {
        ...page,
        excerpt: formatSearchHit(hit).excerpt,
        hasContent: true,
      })
    }
  }
  const results = Array.from(pages.values())
    .slice(0, MAX_SEARCH_RESULTS)
    .map(({ hasContent, ...result }) => result)

  if (results.length === 0) {
    return textResult(
      `No documentation matched "${query}". Try different or fewer keywords.`
    )
  }
  return textResult({ query, results })
}

async function listTutorials({ useCase, topic, technology } = {}) {
  const tutorials = await loadTutorials()
  const matches = tutorials.filter(
    ({ meta }) =>
      (!useCase || includesIgnoringCase(meta.useCase, useCase)) &&
      (!topic || includesIgnoringCase(meta.label, topic)) &&
      (!technology ||
        [...meta.technologies, ...meta.snowplowTech].some((tech) =>
          includesIgnoringCase(tech, technology)
        ))
  )

  if (matches.length === 0) {
    return textResult({
      message: 'No tutorials matched the filters.',
      availableFilterValues: availableFilterValues(tutorials),
    })
  }
  return textResult({ tutorials: matches.map(summarizeTutorial) })
}

async function getTutorial({ slug }) {
  // Accept a bare slug, a /tutorials/<slug>/... path, or a full URL.
  const id = String(slug ?? '')
    .replace(/^.*\btutorials\//, '')
    .split('/')[0]
    .trim()
  const tutorials = await loadTutorials()
  const tutorial = tutorials.find(({ meta }) => meta.id === id)
  if (!tutorial) {
    return errorResult(
      `No tutorial with slug "${id}". Available slugs: ${tutorials
        .map(({ meta }) => meta.id)
        .join(', ')}.`
    )
  }

  const completedPaths = readCompletedStepPaths(id)
  const currentPath = trimTrailingSlash(window.location.pathname)
  const steps = tutorial.steps.map((step) => ({
    position: step.position,
    title: step.title,
    url: absoluteUrl(step.path),
    completed: completedPaths.includes(step.path),
    current: trimTrailingSlash(step.path) === currentPath,
  }))
  const completedSteps = steps.filter((step) => step.completed).length

  return textResult({
    ...summarizeTutorial(tutorial),
    progress: {
      completedSteps,
      totalSteps: steps.length,
      percentage:
        steps.length > 0
          ? Math.round((completedSteps / steps.length) * 100)
          : 0,
    },
    currentStep: steps.find((step) => step.current)?.url ?? null,
    steps,
  })
}

function bookDemo() {
  const button = Array.from(document.querySelectorAll('a, button')).find(
    (element) =>
      element.textContent.trim().toLowerCase() === 'book a demo' &&
      element.getClientRects().length > 0
  )
  if (!button) {
    return errorResult(
      'The "Book a demo" button is not visible on this page. It appears next to the table of contents of documentation and tutorial pages in a wide browser window.'
    )
  }

  button.click()
  const destination = button.href
    ? ` It opens ${button.href} in a new tab.`
    : ''
  return textResult(`Selected the "Book a demo" button.${destination}`)
}

const tools = [
  {
    name: 'search_docs',
    description:
      'Search the Snowplow documentation for a keyword query and return the matching articles with title, URL, and a short excerpt. Use it to find the right page before answering a question about Snowplow.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Keywords to search for, for example "javascript tracker cookies".',
        },
      },
      required: ['query'],
    },
    execute: searchDocs,
  },
  {
    name: 'list_tutorials',
    description:
      'List the Snowplow tutorials and solution accelerators from the tutorials index, optionally filtered by use case, topic, or technology (case-insensitive partial match). Returns slug, title, description, facets, and URL for each tutorial. Call it without filters to see every tutorial and the available filter values.',
    inputSchema: {
      type: 'object',
      properties: {
        useCase: {
          type: 'string',
          description:
            'Filter by use case, for example "Composable CDP" or "Real-time personalization".',
        },
        topic: {
          type: 'string',
          description:
            'Filter by topic, for example "Tracking implementation" or "Solution accelerator".',
        },
        technology: {
          type: 'string',
          description:
            'Filter by technology, for example "Snowflake", "Kafka", or "Signals".',
        },
      },
    },
    execute: listTutorials,
  },
  {
    name: 'get_tutorial',
    description:
      "Return the steps of a Snowplow tutorial and the reader's progress through it in this browser: which steps are completed, the current step, and the percentage complete. Look the tutorial up by its slug, the folder name in its URL (https://docs.snowplow.io/tutorials/<slug>/...).",
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description:
            'The tutorial slug, for example "signals-quickstart". Use list_tutorials to find it.',
        },
      },
      required: ['slug'],
    },
    execute: getTutorial,
  },
  {
    name: 'book_demo',
    description:
      'Book a demo with Snowplow by selecting the "Book a demo" button visible on the page. It opens the Snowplow demo booking page in a new tab.',
    inputSchema: { type: 'object', properties: {} },
    execute: bookDemo,
  },
]

// Tool failures come back as results rather than rejections, so the agent can
// read the message and recover instead of seeing an opaque error.
function withErrorHandling(name, execute) {
  return async (input) => {
    console.log(`WebMCP: ${name} called`, input ?? {})
    try {
      return await execute(input ?? {})
    } catch (error) {
      return errorResult(
        `Tool failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
}

async function registerTools(modelContext) {
  for (const tool of tools) {
    try {
      await modelContext.registerTool({
        ...tool,
        execute: withErrorHandling(tool.name, tool.execute),
      })
    } catch (error) {
      console.warn(`WebMCP: could not register the "${tool.name}" tool`, error)
    }
  }
}

if (ExecutionEnvironment.canUseDOM) {
  // The spec exposes the API on document; early Chrome builds used navigator.
  const modelContext = document.modelContext ?? navigator.modelContext
  if (modelContext) {
    registerTools(modelContext)
  }
}
