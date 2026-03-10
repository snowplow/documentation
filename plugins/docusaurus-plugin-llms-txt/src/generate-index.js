import path from 'node:path'
import fs from 'node:fs/promises'
import { htmlPathToMdPath } from './write-pages.js'

/**
 * Generate llms.txt index file.
 */
export async function generateIndex(outDir, pages, options) {
  const { siteTitle, siteDescription, siteUrl, enableMarkdownFiles } = options

  const lines = []
  lines.push(`# ${siteTitle}`)
  lines.push('')

  if (siteDescription) {
    lines.push(`> ${siteDescription}`)
    lines.push('')
  }

  // Group pages by top-level section
  const sections = groupBySection(pages)

  for (const [section, sectionPages] of Object.entries(sections)) {
    lines.push(`## ${section}`)
    lines.push('')

    for (const page of sectionPages) {
      if (enableMarkdownFiles) {
        const mdPath = htmlPathToMdPath(page.htmlRelPath)
        lines.push(`- [${page.title}](${siteUrl}/${mdPath})`)
      } else {
        lines.push(`- [${page.title}](${siteUrl}${page.routePath})`)
      }
    }

    lines.push('')
  }

  const outputPath = path.join(outDir, 'llms.txt')
  await fs.writeFile(outputPath, lines.join('\n'), 'utf8')
  console.log(`[llms-txt] Wrote llms.txt (${pages.length} pages)`)
}

/**
 * Group pages by their top-level path section.
 * /docs/foo/bar → "docs"
 * /tutorials/baz → "tutorials"
 */
function groupBySection(pages) {
  const sections = {}

  for (const page of pages) {
    const parts = page.routePath.split('/').filter(Boolean)
    const section = parts[0] || 'other'
    const label = section.charAt(0).toUpperCase() + section.slice(1)

    if (!sections[label]) sections[label] = []
    sections[label].push(page)
  }

  return sections
}
