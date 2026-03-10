import path from 'node:path'
import fs from 'node:fs/promises'
import { convertHtmlToMarkdown } from './convert.js'
import { writePages } from './write-pages.js'
import { generateIndex } from './generate-index.js'
import { generateFull } from './generate-full.js'
import { generateCurrent } from './generate-current.js'
import { enrichDbtSchemas } from './enrich-dbt-schemas.js'

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
    enableLlmsCurrentTxt = true,
  } = options

  return {
    name: 'docusaurus-plugin-llms-txt',

    async postBuild({ outDir }) {
      const siteUrl = (
        context.siteConfig?.url || 'https://docs.snowplow.io'
      ).replace(/\/$/, '')

      // Scan the build directory for HTML files under docs/ and tutorials/
      const htmlFiles = []
      for (const subdir of ['docs', 'tutorials']) {
        const subdirPath = path.join(outDir, subdir)
        try {
          await fs.access(subdirPath)
          await walkDir(subdirPath, subdir, htmlFiles)
        } catch {
          // Directory doesn't exist, skip
        }
      }

      console.log(`[llms-txt] Found ${htmlFiles.length} HTML files to process...`)

      // Process each HTML file
      const pages = []

      for (const { htmlRelPath, routePath } of htmlFiles) {
        if (excludeRoutes.includes(routePath)) continue

        const htmlFullPath = path.join(outDir, htmlRelPath)

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

      // Enrich dbt config pages with variable tables from JSON schemas
      await enrichDbtSchemas(pages, context.siteDir)

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

      // Generate llms-current.txt (excluding previous-version pages)
      if (enableLlmsCurrentTxt) {
        await generateCurrent(outDir, pages, {
          siteTitle,
          siteDescription,
          siteUrl,
        })
      }

      console.log('[llms-txt] Done.')
    },
  }
}

/**
 * Recursively find all index.html files in a directory.
 */
async function walkDir(dir, relBase, results) {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relPath = path.join(relBase, entry.name)

    if (entry.isDirectory()) {
      await walkDir(fullPath, relPath, results)
    } else if (entry.name === 'index.html') {
      // Convert path to route: docs/foo/bar/index.html → /docs/foo/bar/
      const routePath = '/' + relBase.replace(/\\/g, '/') + '/'
      results.push({
        htmlRelPath: relPath.replace(/\\/g, '/'),
        routePath,
      })
    }
  }
}
