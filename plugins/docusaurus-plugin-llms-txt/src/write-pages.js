import path from 'node:path'
import fs from 'node:fs/promises'
import { isPreviousVersion, extractCurrentVersionLink, stripDeprecationBanner } from './version-utils.js'
import { groupTutorialSteps } from './content-metadata.js'

/**
 * Write per-page .md files alongside the HTML in the build directory.
 * Path conversion: docs/page/index.html → docs/page.md
 */
export async function writePages(outDir, pages, siteUrl, outdatedPrefixes) {
  for (const page of pages) {
    const mdPath = htmlPathToMdPath(page.htmlRelPath)
    const fullPath = path.join(outDir, mdPath)
    const pageUrl = `${siteUrl}${page.routePath}`

    const content = formatPageMarkdown(page, pageUrl, siteUrl, outdatedPrefixes)

    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, content, 'utf8')
  }

  console.log(`[llms-txt] Wrote ${pages.length} per-page .md files`)
}

/**
 * Write one combined .md per tutorial, with every step in order.
 *
 * A tutorial is a single document that the site splits across pages for
 * navigation. llms.txt links these rather than all 100+ steps, so a reader
 * fetches a whole tutorial in one request and drills into individual steps
 * only if they need to cite one.
 */
export async function writeTutorialPages(outDir, pages, siteUrl, tutorialMeta) {
  const bySlug = groupTutorialSteps(pages)

  for (const [slug, steps] of bySlug) {
    const fullPath = path.join(outDir, tutorialMdPath(slug))
    const content = formatTutorialMarkdown(slug, steps, tutorialMeta.get(slug) || {}, siteUrl)

    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, content, 'utf8')
  }

  console.log(`[llms-txt] Wrote ${bySlug.size} combined tutorial .md files`)
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
 * Path of a tutorial's combined markdown file.
 * "abandoned-browse-ccdp" → tutorials/abandoned-browse-ccdp.md
 */
export function tutorialMdPath(slug) {
  return `tutorials/${slug}.md`
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

  if (page.kind === 'release-note') {
    if (page.date) lines.push(`> Date: ${page.date}`)
    if (page.components?.length) {
      lines.push(`> Components: ${page.components.join(', ')}`)
    }
  }

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

/**
 * Format a tutorial's steps into one document: a metadata header, a list of
 * the steps and their source URLs, then each step's content in order.
 */
function formatTutorialMarkdown(slug, steps, meta, siteUrl) {
  const lines = []

  lines.push(`# ${meta.title || slug}`)

  if (meta.description) lines.push(`> ${meta.description}`)
  if (meta.label) lines.push(`> Category: ${meta.label}`)
  if (meta.useCase) lines.push(`> Use case: ${meta.useCase}`)

  const uses = [...(meta.snowplowTech || []), ...(meta.technologies || [])]
  if (uses.length > 0) lines.push(`> Uses: ${uses.join(', ')}`)

  lines.push(`> Steps: ${steps.length}, in order below`)
  lines.push('')

  steps.forEach((step, index) => {
    lines.push(`${index + 1}. [${step.title}](${siteUrl}${step.routePath})`)
  })
  lines.push('')

  for (const step of steps) {
    lines.push('---')
    lines.push('')
    lines.push(`# ${step.title}`)

    if (step.description) lines.push(`> ${step.description}`)
    lines.push(`> Source: ${siteUrl}${step.routePath}`)

    lines.push('')
    lines.push(step.markdown)
    lines.push('')
  }

  return lines.join('\n')
}
