import { visit } from 'unist-util-visit'
import { getClassString } from './utils.js'

/**
 * Handle images and mermaid diagrams:
 * - Mermaid: convert <div data-mermaid-source> (from swizzled theme component)
 *   directly into <pre><code class="language-mermaid"> for markdown conversion
 * - ThemedImage: uses two <img> tags with themedComponent--light/dark classes.
 *   Strip dark-theme images, keep light-theme ones.
 * - ThemedImage <picture>: extract light-theme <img>, convert to ![alt](src)
 * - Standard <img>: rehype-remark handles natively
 */
export default function rehypeImages() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Convert mermaid source divs (from swizzled Mermaid component) to code blocks
      if (
        node.tagName === 'div' &&
        node.properties?.dataMermaidSource !== undefined
      ) {
        const source = extractText(node).trim()
        if (source) {
          parent.children.splice(index, 1, {
            type: 'element',
            tagName: 'pre',
            properties: {},
            children: [
              {
                type: 'element',
                tagName: 'code',
                properties: { className: ['language-mermaid'] },
                children: [{ type: 'text', value: source }],
              },
            ],
          })
        } else {
          parent.children.splice(index, 1)
        }
        return index
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
 * Recursively extract text content from a hast node tree.
 */
function extractText(node) {
  if (node.type === 'text') return node.value
  if (node.children) return node.children.map(extractText).join('')
  return ''
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
