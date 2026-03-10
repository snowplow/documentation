import path from 'node:path'
import fs from 'node:fs/promises'
import { isPreviousVersion, extractCurrentVersionLink, stripDeprecationBanner } from './version-utils.js'

/**
 * Generate llms-full.txt — index header + all page content concatenated.
 */
export async function generateFull(outDir, pages, options) {
  const { siteTitle, siteDescription, siteUrl } = options

  const lines = []

  // Header (same as llms.txt)
  lines.push(`# ${siteTitle}`)
  lines.push('')

  if (siteDescription) {
    lines.push(`> ${siteDescription}`)
    lines.push('')
  }

  // Each page's content
  for (const page of pages) {
    const pageUrl = `${siteUrl}${page.routePath}`

    lines.push('---')
    lines.push('')
    lines.push(`# ${page.title}`)

    if (page.description) {
      lines.push(`> ${page.description}`)
    }
    lines.push(`> Source: ${pageUrl}`)

    if (isPreviousVersion(page.routePath)) {
      const currentLink = extractCurrentVersionLink(page.markdown, siteUrl)
      lines.push('> Status: Previous version')
      if (currentLink) {
        lines.push(`> Current version: ${currentLink}`)
      }
    }

    lines.push('')
    lines.push(stripDeprecationBanner(page.markdown))
    lines.push('')
  }

  const outputPath = path.join(outDir, 'llms-full.txt')
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
  console.log(
    `[llms-txt] Wrote llms-full.txt (${pages.length} pages)`
  )
}
