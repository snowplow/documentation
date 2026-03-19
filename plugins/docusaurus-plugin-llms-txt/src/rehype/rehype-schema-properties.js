import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { getClassString } from './utils.js'

/**
 * Transform SchemaProperties card components into clean, labeled markdown.
 *
 * The component renders as a card (div.bg-card) containing:
 *   - Header: h3 (schema name), badge span (Event/Entity), description span
 *   - Content: Schema URI, and <details> sections for Example,
 *     Properties and schema (with Table/JSON schema tabs), Warehouse query (with DB tabs)
 *
 * This plugin restructures the card into:
 *   ### schema_name
 *   **Type:** Event
 *   description text
 *   **Schema:** `iglu:vendor/name/format/version`
 *   **Example:**
 *   ```json ... ```
 *   **Properties:**
 *   | table... |
 *   **Example warehouse query (Snowflake):**
 *   ```sql ... ```
 *
 * Must run BEFORE rehype-tabs-to-sections and rehype-clean-details.
 */
export default function rehypeSchemaProperties() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return

      // Detect SchemaProperties card by bg-card class
      const className = getClassString(node)
      if (!className.includes('bg-card')) return

      // Confirm it contains an h3 (schema name)
      const h3 = findFirst(node, (n) => n.tagName === 'h3')
      if (!h3) return

      const schemaName = toString(h3).trim()
      if (!schemaName) return

      // Extract badge text (Event/Entity/Schema) from span with bg-primary
      const badge = findFirst(
        node,
        (n) => n.tagName === 'span' && getClassString(n).includes('bg-primary')
      )
      const typeName = badge ? toString(badge).trim() : ''

      // Extract description from the header area (first child div).
      // The description is a span.text-muted-foreground inside the header,
      // not in the content section.
      const descText = extractDescription(node)

      // Extract Schema URI from the content section
      const schemaUri = extractSchemaUri(node)

      // Find all <details> sections
      const detailSections = []
      collectDetails(node, detailSections)

      // Build replacement nodes
      const replacements = []

      // H3 heading with inline code
      replacements.push({
        type: 'element',
        tagName: 'h3',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: {},
            children: [{ type: 'text', value: schemaName }],
          },
        ],
      })

      // Type label
      if (typeName) {
        replacements.push(makeLabeledP('Type:', ` ${typeName}`))
      }

      // Description
      if (descText) {
        replacements.push({
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [{ type: 'text', value: descText }],
        })
      }

      // Schema URI
      if (schemaUri) {
        replacements.push({
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'strong',
              properties: {},
              children: [{ type: 'text', value: 'Schema:' }],
            },
            { type: 'text', value: ' ' },
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [{ type: 'text', value: schemaUri }],
            },
          ],
        })
      }

      // Process each <details> section
      for (const detail of detailSections) {
        const summary = findFirst(detail, (n) => n.tagName === 'summary')
        const summaryText = summary ? toString(summary).trim().toLowerCase() : ''

        if (summaryText === 'example') {
          replacements.push(makeLabeledP('Example:'))
          // Add non-summary children (the code block)
          pushNonSummaryChildren(detail, replacements)
        } else if (summaryText === 'properties and schema') {
          replacements.push(makeLabeledP('Properties:'))
          // Extract the table directly, skipping the tab wrapper
          const table = findFirst(detail, (n) => n.tagName === 'table')
          if (table) {
            replacements.push(table)
          }
        } else if (summaryText.includes('warehouse')) {
          // Keep only the first tab panel (Snowflake) as a representative example.
          // The queries differ only in SQL dialect; one example is sufficient.
          const firstPanel = findFirst(
            detail,
            (n) => n.properties?.role === 'tabpanel'
          )
          if (firstPanel) {
            replacements.push(makeLabeledP('Example warehouse query (Snowflake):'))
            replacements.push(...(firstPanel.children || []))
          }
        }
      }

      if (replacements.length > 0) {
        parent.children.splice(index, 1, ...replacements)
        return index
      }
    })
  }
}

/**
 * Depth-first search for the first element matching a predicate.
 */
function findFirst(node, predicate) {
  if (node.type === 'element' && predicate(node)) return node
  if (!node.children) return null
  for (const child of node.children) {
    if (child.type !== 'element') continue
    const found = findFirst(child, predicate)
    if (found) return found
  }
  return null
}

/**
 * Collect all direct or nested <details> elements.
 */
function collectDetails(node, results) {
  if (!node.children) return
  for (const child of node.children) {
    if (child.type !== 'element') continue
    if (child.tagName === 'details') {
      results.push(child)
    } else {
      collectDetails(child, results)
    }
  }
}

/**
 * Extract the description text from the card header area.
 * The header is the first child div of the card. The description is
 * a span with text-muted-foreground inside that header div.
 */
function extractDescription(cardNode) {
  if (!cardNode.children) return ''

  // First child div is the header section
  const headerDiv = cardNode.children.find(
    (c) => c.type === 'element' && c.tagName === 'div'
  )
  if (!headerDiv) return ''

  const descSpan = findFirst(
    headerDiv,
    (n) => n.tagName === 'span' && getClassString(n).includes('text-muted-foreground')
  )
  return descSpan ? toString(descSpan).trim() : ''
}

/**
 * Extract Schema URI from the content section.
 * Looks for a container with a span containing "Schema URI" text,
 * then gets the value from the next sibling span.
 */
function extractSchemaUri(cardNode) {
  if (!cardNode.children) return ''

  // Find a span whose text is exactly "Schema URI"
  const uriLabel = findFirst(
    cardNode,
    (n) => n.tagName === 'span' && toString(n).trim() === 'Schema URI'
  )
  if (!uriLabel) return ''

  // The URI value is the next sibling span of the label
  const labelParent = findParentOf(cardNode, uriLabel)
  if (!labelParent?.children) return ''

  const labelIdx = labelParent.children.indexOf(uriLabel)
  for (let i = labelIdx + 1; i < labelParent.children.length; i++) {
    const sibling = labelParent.children[i]
    if (sibling.type === 'element' && sibling.tagName === 'span') {
      return toString(sibling).trim()
    }
  }
  return ''
}

/**
 * Find the parent element of a target node within a tree.
 */
function findParentOf(root, target) {
  if (!root.children) return null
  for (const child of root.children) {
    if (child === target) return root
    if (child.type === 'element') {
      const found = findParentOf(child, target)
      if (found) return found
    }
  }
  return null
}

/**
 * Create a paragraph with a bold label and optional trailing text.
 */
function makeLabeledP(label, trailingText) {
  const children = [
    {
      type: 'element',
      tagName: 'strong',
      properties: {},
      children: [{ type: 'text', value: label }],
    },
  ]
  if (trailingText) {
    children.push({ type: 'text', value: trailingText })
  }
  return {
    type: 'element',
    tagName: 'p',
    properties: {},
    children,
  }
}

/**
 * Push all non-summary children of a <details> element into an array.
 */
function pushNonSummaryChildren(detailNode, target) {
  for (const child of detailNode.children || []) {
    if (child.type === 'element' && child.tagName === 'summary') continue
    target.push(child)
  }
}
