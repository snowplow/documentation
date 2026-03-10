import { visit } from 'unist-util-visit'

/**
 * Strip the language label header div above code blocks.
 * The custom CodeBlock/Layout renders a header div with a language badge span
 * and copy/wrap buttons above the <pre><code>. We strip the header div;
 * the class="language-xxx" on <code> provides the language for fenced output.
 */
export default function rehypeStripCodeLabels() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Look for divs that are code block wrappers containing both
      // a header div (with buttons/language badge) and a <pre> element
      if (node.tagName !== 'div' || !node.children) return

      const hasPreChild = node.children.some(
        (c) => c.type === 'element' && c.tagName === 'pre'
      )
      if (!hasPreChild) return

      // Remove non-<pre> children that look like header/toolbar divs
      node.children = node.children.filter((child) => {
        if (child.type !== 'element') return true
        if (child.tagName === 'pre') return true

        // Keep if it's NOT a header div with buttons or language labels
        const className = getClassString(child)

        // Strip divs containing copy buttons or language badges
        if (child.tagName === 'div' && containsButtonOrBadge(child)) {
          return false
        }

        // Strip standalone button elements (copy button)
        if (child.tagName === 'button') return false

        return true
      })
    })
  }
}

function containsButtonOrBadge(node) {
  if (!node.children) return false

  for (const child of node.children) {
    if (child.type !== 'element') continue
    if (child.tagName === 'button') return true
    // Language badge span
    if (child.tagName === 'span') {
      const className = getClassString(child)
      if (
        className.includes('language') ||
        className.includes('badge') ||
        className.includes('rounded')
      ) {
        return true
      }
    }
    // Recurse
    if (containsButtonOrBadge(child)) return true
  }

  return false
}

function getClassString(node) {
  const cls = node.properties?.className
  if (!cls) return ''
  if (Array.isArray(cls)) return cls.join(' ')
  return String(cls)
}
