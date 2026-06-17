import { visit } from 'unist-util-visit'
import { getClassString } from './utils.js'

/**
 * Strip availability badges, shields.io badges, badge groups, and FontAwesome icons.
 */
export default function rehypeStripBadges() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Availability badges: div[role="list"][aria-label="Product availability"]
      if (
        node.tagName === 'div' &&
        node.properties?.role === 'list' &&
        String(node.properties?.ariaLabel || '').includes('Product availability')
      ) {
        parent.children.splice(index, 1)
        return index
      }

      // Shields.io badge containers: span.snowplow-badge-container
      const className = getClassString(node)
      if (
        node.tagName === 'span' &&
        className.includes('snowplow-badge-container')
      ) {
        parent.children.splice(index, 1)
        return index
      }

      // Standalone shields.io images (not in container)
      if (
        node.tagName === 'img' &&
        String(node.properties?.src || '').includes('img.shields.io')
      ) {
        parent.children.splice(index, 1)
        return index
      }

      // Links wrapping only a shields.io image
      if (node.tagName === 'a' && node.children?.length === 1) {
        const child = node.children[0]
        if (
          child.type === 'element' &&
          child.tagName === 'img' &&
          String(child.properties?.src || '').includes('img.shields.io')
        ) {
          parent.children.splice(index, 1)
          return index
        }
      }

      // FontAwesome SVG icons: <svg> with class containing "fa-"
      if (node.tagName === 'svg' && className.includes('fa-')) {
        parent.children.splice(index, 1)
        return index
      }
    })
  }
}
