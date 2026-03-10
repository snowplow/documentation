import path from 'node:path'
import fs from 'node:fs/promises'
import { isPreviousVersion } from './version-utils.js'

/**
 * Generate llms-current.txt — same as llms-full.txt but excluding
 * previous-version pages.
 */
export async function generateCurrent(outDir, pages, options) {
  const { siteTitle, siteDescription, siteUrl } = options

  const currentPages = pages.filter((p) => !isPreviousVersion(p.routePath))

  const lines = []

  // Header
  lines.push(`# ${siteTitle}`)
  lines.push('')

  if (siteDescription) {
    lines.push(`> ${siteDescription}`)
    lines.push('')
  }

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

  const outputPath = path.join(outDir, 'llms-current.txt')
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
  console.log(
    `[llms-txt] Wrote llms-current.txt (${currentPages.length} current pages, excluded ${pages.length - currentPages.length} previous-version pages)`
  )
}
