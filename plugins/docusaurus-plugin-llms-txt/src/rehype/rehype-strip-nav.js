import { visit } from 'unist-util-visit'
import { getClassString } from './utils.js'

const STRIP_TAGS = new Set(['nav', 'footer'])

const STRIP_CLASS_PATTERNS = [
  'navbar',
  'pagination-nav',
  'theme-doc-toc-',
  'theme-doc-breadcrumbs',
  'theme-edit-this-page',
  'theme-doc-footer',
  'theme-last-updated',
  'table-of-contents',
]

/**
 * Strip navigation chrome: navbar, footer, sidebar, ToC, pagination, breadcrumbs.
 */
export default function rehypeStripNav() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Strip by tag name
      if (STRIP_TAGS.has(node.tagName)) {
        parent.children.splice(index, 1)
        return index
      }

      // Strip by role="navigation"
      if (node.properties?.role === 'navigation') {
        parent.children.splice(index, 1)
        return index
      }

      // Strip by class patterns
      const className = getClassString(node)
      if (className && STRIP_CLASS_PATTERNS.some((p) => className.includes(p))) {
        parent.children.splice(index, 1)
        return index
      }
    })
  }
}
