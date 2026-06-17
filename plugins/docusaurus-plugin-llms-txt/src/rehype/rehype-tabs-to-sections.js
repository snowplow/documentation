import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { getClassString } from './utils.js'

/**
 * Convert Docusaurus tab groups to labeled sections.
 * Finds [role="tablist"] → extracts tab labels from [role="tab"] →
 * finds sibling [role="tabpanel"] → replaces with **Label:** + content.
 */
export default function rehypeTabsToSections() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Only match Docusaurus tab container divs by their class names.
      // Do NOT use a recursive "contains tablist" check — that would match
      // ancestor divs wrapping both tabs and other content, causing the
      // splice to replace the ancestor and lose sibling content.
      const className = getClassString(node)
      if (!className.includes('tabs-container') && !className.includes('tabs_')) {
        return
      }

      // Find the tablist within this container
      const tablist = findTabList(node)
      if (!tablist) return

      // Extract tab labels
      const tabs = findTabs(tablist)
      if (tabs.length === 0) return

      // Find tab panels (sibling or child elements with role="tabpanel")
      const panels = findTabPanels(node)

      // Build replacement nodes: for each tab, create **Label:** + panel content
      const replacements = []

      for (let i = 0; i < tabs.length; i++) {
        const label = tabs[i]
        const panel = panels[i]

        // Skip "JSON schema" tabs (SchemaProperties — table-only is preferred)
        if (label.toLowerCase() === 'json schema') continue

        // Bold label
        replacements.push({
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'strong',
              properties: {},
              children: [{ type: 'text', value: `${label}:` }],
            },
          ],
        })

        // Panel content (if available)
        if (panel?.children) {
          replacements.push(...panel.children)
        }
      }

      if (replacements.length > 0) {
        // Add a horizontal rule after the tab group to mark where
        // platform-specific content ends and shared content resumes
        replacements.push({
          type: 'element',
          tagName: 'hr',
          properties: {},
          children: [],
        })

        parent.children.splice(index, 1, ...replacements)
        return index
      }
    })
  }
}

function findTabList(node) {
  if (node.properties?.role === 'tablist') return node
  if (!node.children) return null
  for (const child of node.children) {
    if (child.type !== 'element') continue
    const found = findTabList(child)
    if (found) return found
  }
  return null
}

function findTabs(tablist) {
  const labels = []
  if (!tablist.children) return labels
  for (const child of tablist.children) {
    if (child.type !== 'element') continue
    if (child.properties?.role === 'tab') {
      labels.push(toString(child).trim())
    }
  }
  return labels
}

function findTabPanels(container) {
  const panels = []
  collectTabPanels(container, panels)
  return panels
}

function collectTabPanels(node, panels) {
  if (!node.children) return
  for (const child of node.children) {
    if (child.type !== 'element') continue
    if (child.properties?.role === 'tabpanel') {
      panels.push(child)
    } else {
      collectTabPanels(child, panels)
    }
  }
}
