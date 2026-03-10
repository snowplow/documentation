import path from 'node:path'
import fs from 'node:fs/promises'
import { convertHtmlToMarkdown } from './convert.js'
import { writePages } from './write-pages.js'
import { generateIndex } from './generate-index.js'
import { generateFull } from './generate-full.js'

/**
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {object} options
 */
export default function pluginLlmsTxt(context, options) {
  const {
    siteTitle = 'Documentation',
    siteDescription = '',
    excludeRoutes = [],
    contentSelectors = ['.theme-doc-markdown', 'article', 'main'],
    enableMarkdownFiles = true,
    enableLlmsFullTxt = true,
  } = options

  return {
    name: 'docusaurus-plugin-llms-txt',

    async postBuild({ outDir, routes }) {
      const siteUrl = (
        context.siteConfig?.url || 'https://docs.snowplow.io'
      ).replace(/\/$/, '')

      // Flatten nested routes
      const flatRoutes = flattenRoutes(routes)

      // Filter to doc/tutorial pages, skip excluded routes
      const pageRoutes = flatRoutes.filter((route) => {
        const routePath = route.path || ''
        if (excludeRoutes.includes(routePath)) return false
        // Only process pages that have an HTML file
        return routePath.startsWith('/docs/') || routePath.startsWith('/tutorials/')
      })

      console.log(
        `[llms-txt] Processing ${pageRoutes.length} pages...`
      )

      // Process each route: read HTML, convert to markdown, collect metadata
      const pages = []

      for (const route of pageRoutes) {
        const routePath = route.path
        const htmlRelPath = routePathToHtmlPath(routePath)
        const htmlFullPath = path.join(outDir, htmlRelPath)

        try {
          await fs.access(htmlFullPath)
        } catch {
          continue // HTML file doesn't exist, skip
        }

        try {
          const html = await fs.readFile(htmlFullPath, 'utf8')
          const { markdown, title, description } = await convertHtmlToMarkdown(
            html,
            contentSelectors
          )

          if (!markdown || !markdown.trim()) continue

          pages.push({
            routePath,
            htmlRelPath,
            title: title || routePath,
            description: description || '',
            markdown,
          })
        } catch (err) {
          console.warn(
            `[llms-txt] Warning: Failed to process ${routePath}: ${err.message}`
          )
        }
      }

      console.log(`[llms-txt] Converted ${pages.length} pages to markdown`)

      // Write per-page .md files
      if (enableMarkdownFiles) {
        await writePages(outDir, pages, siteUrl)
      }

      // Generate llms.txt index
      await generateIndex(outDir, pages, {
        siteTitle,
        siteDescription,
        siteUrl,
        enableMarkdownFiles,
      })

      // Generate llms-full.txt
      if (enableLlmsFullTxt) {
        await generateFull(outDir, pages, {
          siteTitle,
          siteDescription,
          siteUrl,
        })
      }

      console.log('[llms-txt] Done.')
    },
  }
}

function flattenRoutes(routes) {
  const flat = []
  for (const route of routes) {
    flat.push(route)
    if (route.routes) {
      flat.push(...flattenRoutes(route.routes))
    }
  }
  return flat
}

function routePathToHtmlPath(routePath) {
  // /docs/foo/bar/ → docs/foo/bar/index.html
  const cleaned = routePath.replace(/^\//, '').replace(/\/$/, '')
  if (!cleaned) return 'index.html'
  return `${cleaned}/index.html`
}
