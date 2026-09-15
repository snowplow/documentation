import { useEffect } from 'react'
import { useHistory } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import type { AlgoliaConfig } from './docsTools'
import { getModelContext, reportErrors } from './types'

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

// Exposes the documentation site to browser AI agents through WebMCP
// (https://webmachinelearning.github.io/webmcp/). Renders nothing: in a browser
// without WebMCP support this is a no-op, and readers never see a difference.
//
// The site has a small, fixed set of tools, so they are registered once for the
// lifetime of the app rather than per route, which is what the specification
// recommends for simple applications. Tools that depend on the page the reader
// is on read that at call time.
export function WebMcpTools(): null {
  const history = useHistory()
  const { siteConfig } = useDocusaurusContext()

  useEffect(() => {
    const modelContext = getModelContext()
    if (!modelContext) {
      return undefined
    }

    const navigate = (path: string) => history.push(path)
    const algolia = readAlgoliaConfig(siteConfig.themeConfig.algolia)

    // WebMCP has no `unregisterTool`: aborting the signal passed at
    // registration is how tools are taken down again.
    const controller = new AbortController()

    // Loaded on demand, so a reader without an agent downloads none of this and
    // the tutorial index the tools read stays out of the bundle every page
    // already pays for.
    Promise.all([
      import('./docsTools'),
      import('./tutorialTools'),
      import('./demoTools'),
    ])
      .then(([docsTools, tutorialTools, demoTools]) => {
        if (controller.signal.aborted) {
          return undefined
        }

        return Promise.all(
          [
            ...docsTools.createDocsTools({ algolia, navigate }),
            ...tutorialTools.createTutorialTools({ navigate }),
            ...demoTools.createDemoTools(),
          ]
            .map(reportErrors)
            .map((tool) =>
              modelContext.registerTool(tool, { signal: controller.signal })
            )
        )
      })
      .catch((error: unknown) => {
        console.warn('[webmcp] Could not register documentation tools', error)
      })

    return () => controller.abort()
  }, [history, siteConfig])

  return null
}
