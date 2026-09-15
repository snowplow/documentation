import { useEffect } from 'react'
import { useHistory } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import type { AlgoliaConfig } from './docsTools'
import { getModelContext, reportErrors, type ModelContext } from './types'

// The search tool reuses the site's existing Algolia DocSearch credentials, so
// there is nothing extra to configure and nothing new to keep in sync.
function readAlgoliaConfig(value: unknown): AlgoliaConfig | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }
  if (!('appId' in value && 'apiKey' in value && 'indexName' in value)) {
    return null
  }

  const { appId, apiKey, indexName } = value
  if (
    typeof appId !== 'string' ||
    typeof apiKey !== 'string' ||
    typeof indexName !== 'string'
  ) {
    return null
  }

  return { appId, apiKey, indexName }
}

type ResolvedContext = {
  modelContext: ModelContext
  // Takes down the server, the transport, and any polyfill this component
  // installed. A no-op for anything it found already in place.
  release: () => void
}

// Registering a tool needs `document.modelContext`, and almost no browser
// provides it yet: it is behind a flag or an origin trial in Chrome and Edge,
// and absent everywhere else, agent browsers included. Registering is also only
// half the job. The WebMCP API has no notion of a connection, so a page that
// only registers tools is still invisible from outside itself: an extension or
// a desktop agent reaches the page over an MCP transport, and with no server
// listening it reports the site as having no WebMCP at all.
//
// `@mcp-b/global` supplies both halves. It installs the reference polyfill
// where the browser has no WebMCP, and in every browser it puts an MCP server
// and a tab transport in front of whatever context is there, native or
// polyfilled, mirroring registrations down so a native consumer still sees
// them. So it runs unconditionally rather than only as a fallback.
//
// The runtime is loaded in its own chunk, after hydration, so it costs nothing
// until the page is interactive — but unlike the tools it does load for every
// reader, because an agent arrives unannounced and the page cannot know to wait
// for one.
async function resolveModelContext(): Promise<ResolvedContext | null> {
  // The module initializes itself on import, with a transport that accepts any
  // origin. Opt out of that so the connection is configured here instead.
  window.__webModelContextOptions = { autoInitialize: false }

  const runtime = await import('@mcp-b/global')
  runtime.initializeWebModelContext({
    // An agent connects by injecting a client into this page, so it posts from
    // this origin; nothing else has any business connecting.
    transport: { tabServer: { allowedOrigins: [window.location.origin] } },
  })

  // Absent over plain HTTP on a public host, where WebMCP does not run at all.
  const modelContext = getModelContext()
  if (!modelContext) {
    return null
  }
  return { modelContext, release: runtime.cleanupWebModelContext }
}

// Exposes the documentation site to browser AI agents through WebMCP
// (https://webmachinelearning.github.io/webmcp/). Renders nothing, and changes
// nothing a reader can see.
//
// The site has a small, fixed set of tools, so they are registered once for the
// lifetime of the app rather than per route, which is what the specification
// recommends for simple applications. Tools that depend on the page the reader
// is on read that at call time.
export function WebMcpTools(): null {
  const history = useHistory()
  const { siteConfig } = useDocusaurusContext()

  useEffect(() => {
    const navigate = (path: string) => history.push(path)
    const algolia = readAlgoliaConfig(siteConfig.themeConfig.algolia)

    // WebMCP has no `unregisterTool`: aborting the signal passed at
    // registration is how tools are taken down again.
    const controller = new AbortController()
    let release: (() => void) | undefined

    // The tools are loaded on demand, so the tutorial index they read stays out
    // of the bundle every page already pays for.
    Promise.all([
      resolveModelContext(),
      import('./docsTools'),
      import('./tutorialTools'),
      import('./demoTools'),
    ])
      .then(([resolved, docsTools, tutorialTools, demoTools]) => {
        if (resolved === null) {
          return undefined
        }
        if (controller.signal.aborted) {
          resolved.release()
          return undefined
        }
        release = resolved.release

        return Promise.all(
          [
            ...docsTools.createDocsTools({ algolia, navigate }),
            ...tutorialTools.createTutorialTools({ navigate }),
            ...demoTools.createDemoTools(),
          ]
            .map(reportErrors)
            .map((tool) =>
              resolved.modelContext.registerTool(tool, {
                signal: controller.signal,
              })
            )
        )
      })
      .catch((error: unknown) => {
        console.warn('[webmcp] Could not register documentation tools', error)
      })

    return () => {
      controller.abort()
      release?.()
    }
  }, [history, siteConfig])

  return null
}
