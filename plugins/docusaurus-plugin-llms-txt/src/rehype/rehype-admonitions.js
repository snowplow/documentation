import { visit } from 'unist-util-visit'
import { getClassString } from './utils.js'

const ADMONITION_TYPES = ['note', 'tip', 'info', 'warning', 'danger', 'caution']

/**
 * Convert Docusaurus admonitions to blockquote format:
 * > **Note:** content here
 */
export default function rehypeAdmonitions() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return
      if (node.tagName !== 'div') return

      const className = getClassString(node)
      if (!className.includes('admonition')) return

      // Determine admonition type from class
      let type = 'Note'
      for (const t of ADMONITION_TYPES) {
        if (className.includes(`admonition-${t}`) || className.includes(`admonition_${t}`)) {
          type = t.charAt(0).toUpperCase() + t.slice(1)
          break
        }
      }

      // Find the admonition content (skip the heading/icon)
      const contentChildren = extractAdmonitionContent(node)

      // Build the label prefix
      const labelNodes = [
        {
          type: 'element',
          tagName: 'strong',
          properties: {},
          children: [{ type: 'text', value: `${type}:` }],
        },
        { type: 'text', value: ' ' },
      ]

      // Prepend label to first paragraph, or create a new one
      const blockquoteChildren = []

      if (contentChildren.length > 0) {
        const first = contentChildren[0]
        if (first.type === 'element' && first.tagName === 'p') {
          // Prepend label to existing first paragraph
          blockquoteChildren.push({
            ...first,
            children: [...labelNodes, ...(first.children || [])],
          })
          // Add remaining content children directly
          blockquoteChildren.push(...contentChildren.slice(1))
        } else {
          // Wrap label + all content in a new paragraph
          blockquoteChildren.push({
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [...labelNodes, ...contentChildren],
          })
        }
      } else {
        blockquoteChildren.push({
          type: 'element',
          tagName: 'p',
          properties: {},
          children: labelNodes,
        })
      }

      const blockquote = {
        type: 'element',
        tagName: 'blockquote',
        properties: {},
        children: blockquoteChildren,
      }

      parent.children.splice(index, 1, blockquote)
      return index
    })
  }
}

/**
 * Extract the content children from an admonition, skipping the heading/icon row.
 */
function extractAdmonitionContent(node) {
  if (!node.children) return []

  // Look for the content div (class contains "admonitionContent")
  for (const child of node.children) {
    if (child.type !== 'element') continue
    const className = getClassString(child)
    if (className.includes('admonitionContent')) {
      return child.children || []
    }
  }

  // Fallback: skip the first child (heading) and return the rest
  const nonHeadingChildren = node.children.filter((child) => {
    if (child.type !== 'element') return true
    const className = getClassString(child)
    return !className.includes('admonitionHeading')
  })

  return nonHeadingChildren
}
