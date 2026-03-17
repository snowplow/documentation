import path from 'node:path'
import fs from 'node:fs/promises'
import { isPreviousVersion, extractCurrentVersionLink, stripDeprecationBanner } from './version-utils.js'

/**
 * Write per-page .md files alongside the HTML in the build directory.
 * Path conversion: docs/page/index.html → docs/page.md
 */
export async function writePages(outDir, pages, siteUrl, outdatedPrefixes) {
  let written = 0

  for (const page of pages) {
    const mdPath = htmlPathToMdPath(page.htmlRelPath)
    const fullPath = path.join(outDir, mdPath)
    const pageUrl = `${siteUrl}${page.routePath}`

    const content = formatPageMarkdown(page, pageUrl, siteUrl, outdatedPrefixes)

    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, content, 'utf8')
    written++
  }

}

/**
 * Convert HTML path to markdown path.
 * docs/page/index.html → docs/page.md
 * index.html → index.md
 */
export function htmlPathToMdPath(htmlRelPath) {
  // If it ends with /index.html, replace with .md on the parent dir
  if (htmlRelPath.endsWith('/index.html')) {
    return htmlRelPath.replace(/\/index\.html$/, '.md')
  }
  // Otherwise just swap extension
  return htmlRelPath.replace(/\.html$/, '.md')
}

/**
 * Format a single page's markdown with header metadata.
 */
function formatPageMarkdown(page, pageUrl, siteUrl, outdatedPrefixes) {
  const lines = []
  lines.push(`# ${page.title}`)

  if (page.description) {
    lines.push(`> ${page.description}`)
  }
  lines.push(`> Source: ${pageUrl}`)

  if (isPreviousVersion(page.routePath, outdatedPrefixes)) {
    const currentLink = extractCurrentVersionLink(page.markdown, siteUrl)
    lines.push('> Status: Previous version')
    if (currentLink) {
      lines.push(`> Current version: ${currentLink}`)
    }
  }

  lines.push('')
  lines.push(stripDeprecationBanner(page.markdown))
  lines.push('')

  return lines.join('\n')
}
