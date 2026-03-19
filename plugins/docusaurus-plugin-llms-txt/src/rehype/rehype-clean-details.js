import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'

/**
 * Unwrap <details> elements: convert <summary> to bold paragraph,
 * keep remaining children inline.
 */
export default function rehypeCleanDetails() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return
      if (node.tagName !== 'details') return

      const replacements = []

      for (const child of node.children || []) {
        if (child.type === 'element' && child.tagName === 'summary') {
          // Convert summary to bold paragraph
          const text = toString(child).trim()
          if (text) {
            replacements.push({
              type: 'element',
              tagName: 'p',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'strong',
                  properties: {},
                  children: [{ type: 'text', value: text }],
                },
              ],
            })
          }
        } else {
          replacements.push(child)
        }
      }

      parent.children.splice(index, 1, ...replacements)
      return index
    })
  }
}
