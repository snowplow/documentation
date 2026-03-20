import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { select, selectAll } from 'hast-util-select'
import { toString } from 'hast-util-to-string'
import { visit, EXIT } from 'unist-util-visit'
import { toHtml } from 'hast-util-to-html'

import rehypeStripNav from './rehype/rehype-strip-nav.js'
import rehypeStripHeadingAnchors from './rehype/rehype-strip-heading-anchors.js'
import rehypeStripBadges from './rehype/rehype-strip-badges.js'
import rehypeStripCodeLabels from './rehype/rehype-strip-code-labels.js'
import rehypeTabsToSections from './rehype/rehype-tabs-to-sections.js'
import rehypeAdmonitions from './rehype/rehype-admonitions.js'
import rehypeCleanDetails from './rehype/rehype-clean-details.js'
import rehypeStripInteractive from './rehype/rehype-strip-interactive.js'
import rehypeImages from './rehype/rehype-images.js'
import rehypeSchemaProperties from './rehype/rehype-schema-properties.js'

/**
 * Convert an HTML string to clean markdown.
 * @param {string} html - Full HTML page content
 * @param {string[]} contentSelectors - CSS selectors to extract main content
 * @returns {Promise<{markdown: string, title: string, description: string}>}
 */
export async function convertHtmlToMarkdown(html, contentSelectors) {
  // Parse the full HTML to extract metadata
  const fullTree = unified().use(rehypeParse).parse(html)

  const title = extractTitle(fullTree)
  const description = extractDescription(fullTree)

  // Extract main content element
  const contentTree = extractContent(fullTree, contentSelectors)
  if (!contentTree) {
    return { markdown: '', title, description }
  }

  // Run the conversion pipeline on the content subtree
  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeStripFirstH1)
    .use(rehypeStripComments)
    .use(rehypeStripNav)
    .use(rehypeStripHeadingAnchors)
    .use(rehypeStripBadges)
    .use(rehypeStripCodeLabels)
    .use(rehypeSchemaProperties)
    .use(rehypeTabsToSections)
    .use(rehypeAdmonitions)
    .use(rehypeCleanDetails)
    .use(rehypeStripInteractive)
    .use(rehypeImages)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify, {
      bullet: '-',
      emphasis: '_',
      strong: '*',
      fence: '`',
      fences: true,
      listItemIndent: 'one',
    })

  // Serialize the content subtree back to HTML, then re-parse and convert
  // This is necessary because we extracted a subtree from the full parse
  const contentHtml = toHtml(contentTree)

  const result = await processor.process(contentHtml)
  const markdown = String(result).trim()

  return { markdown, title, description }
}

/**
 * Extract the page title from <title> or <h1>
 */
function extractTitle(tree) {
  // Try <title> tag
  const titleEl = select('title', tree)
  if (titleEl) {
    const text = toString(titleEl).trim()
    // Strip site name suffix (e.g. " | Snowplow Documentation")
    const pipeIdx = text.lastIndexOf(' | ')
    return pipeIdx > 0 ? text.substring(0, pipeIdx).trim() : text
  }

  // Fallback to first <h1>
  const h1 = select('h1', tree)
  if (h1) return toString(h1).trim()

  return ''
}

/**
 * Extract description from meta tag
 */
function extractDescription(tree) {
  const metaDesc = select('meta[name="description"]', tree)
  if (metaDesc?.properties?.content) {
    return String(metaDesc.properties.content).trim()
  }
  return ''
}

/**
 * Extract the main content element using CSS selectors (first match wins)
 */
function extractContent(tree, selectors) {
  for (const sel of selectors) {
    const node = select(sel, tree)
    if (node) return node
  }
  return null
}

/**
 * Strip the first H1 from page content (we add it in the per-page header).
 */
function rehypeStripFirstH1() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return
      if (node.tagName === 'h1') {
        parent.children.splice(index, 1)
        return EXIT
      }
    })
  }
}

/**
 * Strip HTML comment nodes (<!-- -->) from the tree.
 * React inserts these as fragment markers.
 */
function rehypeStripComments() {
  return (tree) => {
    visit(tree, 'comment', (node, index, parent) => {
      if (!parent || index == null) return
      parent.children.splice(index, 1)
      return index
    })
  }
}
