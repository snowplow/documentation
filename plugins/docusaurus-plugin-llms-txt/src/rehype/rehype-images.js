import { visit } from 'unist-util-visit'
import { getClassString } from './utils.js'

/**
 * Handle images:
 * - ThemedImage: uses two <img> tags with themedComponent--light/dark classes.
 *   Strip dark-theme images, keep light-theme ones.
 * - ThemedImage <picture>: extract light-theme <img>, convert to ![alt](src)
 * - Mermaid SVGs: replace with placeholder text (enriched later by enrich-mermaid)
 * - Standard <img>: rehype-remark handles natively
 */
export default function rehypeImages() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Replace Mermaid SVGs with placeholders (enriched later by enrich-mermaid)
      if (node.tagName === 'svg') {
        const className = getClassString(node)
        if (className.includes('mermaid')) {
          parent.children.splice(index, 1, {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [{ type: 'text', value: 'MERMAID_DIAGRAM_PLACEHOLDER' }],
          })
          return index
        }
      }

      // Strip dark-theme ThemedImage <img> tags
      if (node.tagName === 'img') {
        const className = getClassString(node)
        if (className.includes('themedComponent--dark')) {
          parent.children.splice(index, 1)
          return index
        }
      }

      // Convert <picture> (ThemedImage) to <img>
      if (node.tagName === 'picture') {
        const img = findImg(node)
        if (img) {
          parent.children.splice(index, 1, img)
          return index
        }
        // No img found, remove the picture
        parent.children.splice(index, 1)
        return index
      }
    })
  }
}

/**
 * Find the <img> element inside a <picture>, preferring light theme.
 */
function findImg(pictureNode) {
  if (!pictureNode.children) return null

  // Look for direct <img> child
  for (const child of pictureNode.children) {
    if (child.type === 'element' && child.tagName === 'img') {
      return child
    }
  }

  return null
}
