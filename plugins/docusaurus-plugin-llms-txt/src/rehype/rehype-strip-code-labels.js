import { visit } from 'unist-util-visit'
import { getClassString } from './utils.js'

/**
 * Clean up code blocks:
 * 1. Strip the language label header div (badge + buttons) above code blocks
 * 2. Ensure the language class is on <code> so rehype-remark produces fenced blocks
 *
 * HTML structure:
 * <div class="language-bash codeBlockContainer_xxx theme-code-block">
 *   <div class="flex ...">           ← header with language badge (STRIP)
 *   <div class="relative">           ← wrapper (unwrap)
 *     <pre class="language-bash ...">
 *       <code class="codeBlockLines_xxx">...</code>
 *     </pre>
 *   </div>
 * </div>
 */
export default function rehypeStripCodeLabels() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Match the outer code block container
      const className = getClassString(node)
      if (
        node.tagName !== 'div' ||
        (!className.includes('codeBlockContainer') &&
        !className.includes('theme-code-block'))
      ) {
        return
      }

      // Extract language from the container's class (e.g. "language-bash")
      const lang = extractLanguage(className)

      // Find the <pre> element (may be nested in a wrapper div)
      const pre = findPre(node)
      if (!pre) return

      // Ensure language class is on <code> element inside <pre>
      if (lang && pre.children) {
        for (const child of pre.children) {
          if (child.type === 'element' && child.tagName === 'code') {
            const codeClasses = Array.isArray(child.properties?.className)
              ? child.properties.className
              : []
            if (!codeClasses.some((c) => c.startsWith('language-'))) {
              child.properties = child.properties || {}
              child.properties.className = [...codeClasses, `language-${lang}`]
            }
          }
        }
      }

      // Replace the container with just the <pre>
      parent.children.splice(index, 1, pre)
      return index
    })
  }
}

function extractLanguage(className) {
  const match = className.match(/\blanguage-(\S+)/)
  return match ? match[1] : null
}

function findPre(node) {
  if (!node.children) return null
  for (const child of node.children) {
    if (child.type !== 'element') continue
    if (child.tagName === 'pre') return child
    // Recurse into wrapper divs
    const found = findPre(child)
    if (found) return found
  }
  return null
}
