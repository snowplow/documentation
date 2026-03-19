import { visit } from 'unist-util-visit'
import { getClassString } from './utils.js'

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

/**
 * Strip hash-link anchors from headings (e.g. "Direct link to heading").
 */
export default function rehypeStripHeadingAnchors() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (!HEADING_TAGS.has(node.tagName)) return
      if (!node.children) return

      node.children = node.children.filter((child) => {
        if (child.type !== 'element' || child.tagName !== 'a') return true
        const className = getClassString(child)
        return !className.includes('hash-link')
      })
    })
  }
}
