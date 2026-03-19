import path from 'node:path'
import fs from 'node:fs/promises'
import { isPreviousVersion } from './version-utils.js'

/**
 * Generate llms-full.txt — index header + page content concatenated.
 * Excludes any sections with `sidebar_custom_props.outdated`.
 */
export async function generateFull(outDir, pages, options) {
  const { siteTitle, siteDescription, siteUrl, outdatedPrefixes } = options

  const currentPages = pages.filter(
    (p) => !isPreviousVersion(p.routePath, outdatedPrefixes)
  )

  const lines = []

  // Header (same as llms.txt)
  lines.push(`# ${siteTitle}`)
  lines.push('')

  if (siteDescription) {
    lines.push(`> ${siteDescription}`)
    lines.push('')
  }

  lines.push(
    'Documentation for previous versions of components is available on the site but is not included in this file.'
  )
  lines.push('')

  // Each page's content
  for (const page of currentPages) {
    const pageUrl = `${siteUrl}${page.routePath}`

    lines.push('---')
    lines.push('')
    lines.push(`# ${page.title}`)

    if (page.description) {
      lines.push(`> ${page.description}`)
    }
    lines.push(`> Source: ${pageUrl}`)

    lines.push('')
    lines.push(page.markdown)
    lines.push('')
  }

  const outputPath = path.join(outDir, 'llms-full.txt')
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
  console.log(
    `[llms-txt] Wrote llms-full.txt (${
      currentPages.length
    } current pages, excluded ${
      pages.length - currentPages.length
    } previous-version pages)`
  )
}
