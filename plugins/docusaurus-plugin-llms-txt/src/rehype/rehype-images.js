import { visit } from 'unist-util-visit'

/**
 * Handle images:
 * - ThemedImage: uses two <img> tags with themedComponent--light/dark classes.
 *   Strip dark-theme images, keep light-theme ones.
 * - ThemedImage <picture>: extract light-theme <img>, convert to ![alt](src)
 * - Mermaid SVGs: strip entirely (not useful as text)
 * - Standard <img>: rehype-remark handles natively
 */
export default function rehypeImages() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Strip Mermaid SVGs
      if (node.tagName === 'svg') {
        const className = getClassString(node)
        if (className.includes('mermaid')) {
          parent.children.splice(index, 1)
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

function getClassString(node) {
  const cls = node.properties?.className
  if (!cls) return ''
  if (Array.isArray(cls)) return cls.join(' ')
  return String(cls)
}
